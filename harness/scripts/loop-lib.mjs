/**
 * Loop Forge execution harness — workflow, manifest, runtime state, and receipts.
 *
 * `loop-state.json` is a projection of an append-only journal, not durable
 * project knowledge. CURRENT.md remains the human-readable handoff.
 */
import {
  appendFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  renameSync,
  writeFileSync,
} from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';
import { parse as parseYaml } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, '../..');
export const HARNESS = join(ROOT, 'harness');
const STATE_DIR = process.env.LOOP_STATE_DIR ? resolve(process.env.LOOP_STATE_DIR) : join(ROOT, 'state');
const STATE_PATH = join(STATE_DIR, 'loop-state.json');
const EVENTS_PATH = join(STATE_DIR, 'run-events.jsonl');
const REVIEW_RECEIPT_PATH = join(STATE_DIR, 'review-receipt.json');
const DEFAULT_LOOP_SAFETY = readYaml(join(HARNESS, 'context-budget.yaml')).loop_safety || {};
const CAPABILITIES_RELATIVE_PATH = join('harness', 'project-capabilities.yaml');
const ALLOWED_PACKAGE_MANAGERS = new Set(['npm', 'pnpm']);
const POSTFLIGHT_GATES = {
  verify: { profileScript: 'verify' },
  review: { profileScript: 'review' },
  'project-doctor': { command: 'node', args: ['harness/scripts/loop.mjs', 'doctor'], targetRoot: true },
  'project-verify': { profileScript: 'verify', targetRoot: true },
};

export class LoopTransitionError extends Error {}

export function readYaml(path) {
  return parseYaml(readFileSync(path, 'utf8'));
}

/**
 * Read the small, declarative project profile used to select only pre-approved
 * package-manager scripts. It intentionally cannot name executables or args.
 */
export function loadProjectCapabilities(projectRoot = ROOT) {
  const path = join(projectRoot, CAPABILITIES_RELATIVE_PATH);
  if (!existsSync(path)) throw new LoopTransitionError(`Missing project capability profile: ${path}`);
  const raw = readYaml(path);
  if (!raw || raw.version !== 1 || !ALLOWED_PACKAGE_MANAGERS.has(raw.package_manager)) {
    throw new LoopTransitionError(`Invalid project capability profile: ${path}`);
  }
  if (!raw.gates || typeof raw.gates !== 'object' || raw.gates.verify !== true || raw.gates.review !== true) {
    throw new LoopTransitionError(`Capability profile must enable verify and review: ${path}`);
  }
  if (raw.gates.smoke_all !== undefined && typeof raw.gates.smoke_all !== 'boolean') {
    throw new LoopTransitionError(`Capability profile smoke_all must be boolean: ${path}`);
  }
  return {
    version: raw.version,
    packageManager: raw.package_manager,
    gates: { verify: true, review: true, smokeAll: raw.gates.smoke_all === true },
  };
}

export function resolvePostflightGate(gate, projectRoot = ROOT) {
  const spec = POSTFLIGHT_GATES[gate];
  if (!spec) throw new LoopTransitionError(`Unknown postflight gate: ${gate}`);
  if (!spec.profileScript) return { command: spec.command, args: spec.args, targetRoot: spec.targetRoot === true };
  const profile = loadProjectCapabilities(projectRoot);
  return { command: profile.packageManager, args: ['run', spec.profileScript], targetRoot: spec.targetRoot === true };
}

export function loadWorkflows() {
  const dir = join(HARNESS, 'workflows');
  return readdirSync(dir)
    .filter((file) => file.endsWith('.yaml'))
    .map((file) => ({ file, ...readYaml(join(dir, file)) }));
}

export function loadManifest(name) {
  const path = join(HARNESS, 'manifests', `${name}.yaml`);
  if (!existsSync(path)) throw new Error(`Manifest not found: ${name}`);
  return readYaml(path);
}

function staticPath(path) {
  return typeof path === 'string' && !path.includes('{') && !path.includes('*');
}

function validateManifest(workflowName, manifestName, manifest) {
  const errors = [];
  if (!manifest || typeof manifest !== 'object') {
    return [`[${workflowName}] manifest ${manifestName}: invalid YAML object`];
  }
  if (!Array.isArray(manifest.skills) || manifest.skills.length === 0) {
    errors.push(`[${workflowName}] manifest ${manifestName}: missing non-empty skills`);
  }
  for (const item of manifest.before || []) {
    if (!item?.path || typeof item.path !== 'string') {
      errors.push(`[${workflowName}] manifest ${manifestName}: before item missing path`);
    } else if (!item.runtime && staticPath(item.path) && !existsSync(join(ROOT, item.path))) {
      errors.push(`[${workflowName}] manifest ${manifestName}: missing before path ${item.path}`);
    }
  }
  for (const item of manifest.postflight || []) {
    if (item?.gate && !POSTFLIGHT_GATES[item.gate]) {
      errors.push(`[${workflowName}] manifest ${manifestName}: unknown postflight gate ${item.gate}`);
    } else if (!item?.gate && item?.execution !== 'external') {
      errors.push(`[${workflowName}] manifest ${manifestName}: postflight must use an allowlisted gate or execution: external`);
    }
    if (item?.execution === 'external' && (!item.command || typeof item.command !== 'string')) {
      errors.push(`[${workflowName}] manifest ${manifestName}: external postflight needs a command description`);
    }
  }
  for (const path of manifest.after_must_exist || []) {
    if (typeof path !== 'string') errors.push(`[${workflowName}] manifest ${manifestName}: after_must_exist needs string paths`);
  }
  return errors;
}

/** Mechanical L2/L3 checks. External project commands are described, never shell-executed. */
export function validateWorkflows() {
  const errors = [];
  for (const workflow of loadWorkflows()) {
    if (!workflow.name || !Array.isArray(workflow.steps) || workflow.steps.length === 0) {
      errors.push(`[${workflow.file}] workflow needs name and non-empty steps`);
      continue;
    }
    const ids = new Set();
    const skills = new Set();
    for (const step of workflow.steps) {
      if (!step.id || ids.has(step.id)) errors.push(`[${workflow.name}] duplicate or missing step id: ${step.id}`);
      ids.add(step.id);
      if (!step.skill) errors.push(`[${workflow.name}] step ${step.id}: missing skill`);
      skills.add(step.skill);
      if (!step.manifest) {
        errors.push(`[${workflow.name}] step ${step.id}: missing manifest`);
        continue;
      }
      const manifestPath = join(HARNESS, 'manifests', `${step.manifest}.yaml`);
      if (!existsSync(manifestPath)) {
        errors.push(`[${workflow.name}] step ${step.id}: missing manifest ${step.manifest}`);
        continue;
      }
      const manifest = readYaml(manifestPath);
      errors.push(...validateManifest(workflow.name, step.manifest, manifest));
      if (step.skill && manifest.skills && !manifest.skills.includes(step.skill)) {
        errors.push(`[${workflow.name}] step ${step.id}: skill ${step.skill} not in manifest ${step.manifest} skills`);
      }
    }
    if (workflow.goal?.checker === 'reviewer' && !skills.has('reviewer')) {
      errors.push(`[${workflow.name}] goal checker reviewer has no reviewer workflow step`);
    }
    if (workflow.goal?.success_condition && (!workflow.goal.completion_gate || !POSTFLIGHT_GATES[workflow.goal.completion_gate])) {
      errors.push(`[${workflow.name}] goal needs an allowlisted completion_gate`);
    }
  }
  return errors;
}

function defaultState() {
  return {
    version: 2,
    currentRound: 1,
    currentIteration: 0,
    handoffCount: 0,
    maxIterations: DEFAULT_LOOP_SAFETY.max_iterations || 10,
    maxConsecutiveVerifyFail: DEFAULT_LOOP_SAFETY.consecutive_verify_fail || 3,
    maxRoundsPerSession: DEFAULT_LOOP_SAFETY.max_rounds_per_session || 3,
    sessionRoundCount: 0,
    status: 'idle',
    stopReason: null,
    goal: '',
    consecutiveVerifyFail: 0,
    history: [],
    run: { runId: null, makerSession: null },
    targetRoot: null,
    completedGates: [],
    handoff: { workflow: 'round-cycle', stepIndex: 0, activeSkill: null },
    lastUpdated: new Date().toISOString(),
  };
}

function normalizeState(raw) {
  const defaults = defaultState();
  const state = { ...defaults, ...(raw || {}) };
  state.version = 2;
  state.handoff = { ...defaults.handoff, ...(raw?.handoff || {}) };
  state.run = { ...defaults.run, ...(raw?.run || {}) };
  state.history = Array.isArray(raw?.history) ? raw.history : [];
  state.targetRoot = typeof raw?.targetRoot === 'string' ? raw.targetRoot : null;
  state.completedGates = Array.isArray(raw?.completedGates) ? raw.completedGates.filter((gate) => typeof gate === 'string') : [];
  for (const key of ['currentRound', 'currentIteration', 'handoffCount', 'maxIterations', 'maxConsecutiveVerifyFail', 'maxRoundsPerSession', 'sessionRoundCount', 'consecutiveVerifyFail']) {
    state[key] = Number.isInteger(state[key]) && state[key] >= 0 ? state[key] : defaults[key];
  }
  if (state.maxIterations < 1) state.maxIterations = defaults.maxIterations;
  if (state.maxConsecutiveVerifyFail < 1) state.maxConsecutiveVerifyFail = defaults.maxConsecutiveVerifyFail;
  if (state.maxRoundsPerSession < 1) state.maxRoundsPerSession = defaults.maxRoundsPerSession;
  return state;
}

function ensureStateDir() {
  mkdirSync(STATE_DIR, { recursive: true });
}

export function appendRunEvent(event) {
  ensureStateDir();
  appendFileSync(EVENTS_PATH, `${JSON.stringify({ at: new Date().toISOString(), ...event })}\n`);
}

export function loadLoopState() {
  if (!existsSync(STATE_PATH)) return defaultState();
  return normalizeState(JSON.parse(readFileSync(STATE_PATH, 'utf8')));
}

export function saveLoopState(state) {
  ensureStateDir();
  const next = normalizeState({ ...state, lastUpdated: new Date().toISOString() });
  const tmp = `${STATE_PATH}.${process.pid}.tmp`;
  writeFileSync(tmp, JSON.stringify(next, null, 2));
  renameSync(tmp, STATE_PATH);
  Object.assign(state, next);
}

function workflowFor(state) {
  const name = state.handoff?.workflow || 'round-cycle';
  const workflow = loadWorkflows().find((item) => item.name === name);
  if (!workflow) throw new LoopTransitionError(`Workflow not found: ${name}`);
  return workflow;
}

function currentStep(state, workflow = workflowFor(state)) {
  const index = state.handoff?.stepIndex ?? 0;
  const step = workflow.steps[index];
  if (!step) throw new LoopTransitionError(`Workflow ${workflow.name} has no active step at index ${index}`);
  return { workflow, index, step };
}

function assertCanActivate(state) {
  if (state.status === 'blocked') throw new LoopTransitionError('Loop blocked. Manual intervention required.');
  if (state.status === 'completed') throw new LoopTransitionError('Workflow completed. Select a workflow to begin the next round.');
  if (state.currentIteration >= state.maxIterations) {
    throw new LoopTransitionError(`Iteration budget exhausted (${state.currentIteration}/${state.maxIterations}).`);
  }
  if (state.sessionRoundCount >= state.maxRoundsPerSession) {
    throw new LoopTransitionError(`Round budget exhausted (${state.sessionRoundCount}/${state.maxRoundsPerSession}).`);
  }
}

export function getNextHandoff(state) {
  assertCanActivate(state);
  const { workflow, index, step } = currentStep(state);
  return {
    done: false,
    workflow: workflow.name,
    stepIndex: index,
    step,
    skill: step.skill,
    manifest: loadManifest(step.manifest),
    phase: step.phase,
    instruction: `Activate @${step.skill}. ${step.description || ''}`,
  };
}

export function activateNextHandoff(state) {
  const handoff = getNextHandoff(state);
  if (!state.run.runId) state.run.runId = randomUUID();
  state.status = 'running';
  state.stopReason = null;
  state.handoff.activeSkill = handoff.skill;
  appendRunEvent({ type: 'handoff_activated', runId: state.run.runId, workflow: handoff.workflow, step: handoff.step.id, skill: handoff.skill });
  saveLoopState(state);
  return handoff;
}

function reviewReceiptMatches(state, workflow) {
  if (!existsSync(REVIEW_RECEIPT_PATH)) return false;
  const receipt = JSON.parse(readFileSync(REVIEW_RECEIPT_PATH, 'utf8'));
  return receipt.result === 'approved'
    && receipt.workflow === workflow.name
    && receipt.round === state.currentRound
    && receipt.runId === state.run.runId;
}

function requiresReviewReceipt(workflow, index) {
  return workflow.steps.slice(0, index).some((step) => step.skill === 'reviewer');
}

function resolveArtifactPath(state, rawPath) {
  if (rawPath.includes('{target_root}')) {
    if (!state.targetRoot) throw new LoopTransitionError(`Artifact ${rawPath} needs workflow --target-root <path>.`);
    return resolve(rawPath.replace('{target_root}', state.targetRoot));
  }
  return join(ROOT, rawPath);
}

function assertRequiredArtifacts(manifest, state) {
  for (const rawPath of manifest.after_must_exist || []) {
    const path = resolveArtifactPath(state, rawPath);
    if (!existsSync(path)) throw new LoopTransitionError(`Required artifact missing: ${path}`);
  }
}

function executePostflight(manifest, state, runGate) {
  const passed = [];
  for (const item of manifest.postflight || []) {
    if (!item.gate) continue; // external commands are declared for a project runner, never shell-executed here.
    const projectRoot = POSTFLIGHT_GATES[item.gate]?.targetRoot ? state.targetRoot : ROOT;
    if (!projectRoot) throw new LoopTransitionError(`Gate ${item.gate} needs workflow --target-root <path>.`);
    runGate(item.gate, resolvePostflightGate(item.gate, projectRoot));
    passed.push(item.gate);
  }
  return passed;
}

function assertGoalSatisfied(workflow, state) {
  const gate = workflow.goal?.completion_gate;
  if (gate && !state.completedGates.includes(gate)) {
    throw new LoopTransitionError(`Workflow goal requires completed gate: ${gate}`);
  }
}

function recordFailure(state, workflow, step, error) {
  state.consecutiveVerifyFail += 1;
  state.stopReason = 'postflight_failed';
  state.history.push({ type: 'postflight_failed', workflow: workflow.name, step: step.id, timestamp: new Date().toISOString(), error: error.message });
  if (state.consecutiveVerifyFail >= state.maxConsecutiveVerifyFail) {
    state.status = 'blocked';
    state.stopReason = 'consecutive_verify_fail';
  }
  appendRunEvent({ type: 'postflight_failed', runId: state.run.runId, workflow: workflow.name, step: step.id, error: error.message, consecutiveVerifyFail: state.consecutiveVerifyFail });
  saveLoopState(state);
}

/** Advance only an active step; every rejection leaves its cursor unchanged. */
export function completeHandoff(state, options = {}) {
  const { workflow, index, step } = currentStep(state);
  if (state.status !== 'running') throw new LoopTransitionError('No running handoff. Run `pnpm loop next` first.');
  if (state.handoff.activeSkill !== step.skill) {
    throw new LoopTransitionError(`Active skill must be ${step.skill}; got ${state.handoff.activeSkill || 'none'}.`);
  }
  if (step.skill === 'implementer' && !state.run.makerSession && !options.makerSession) {
    throw new LoopTransitionError('Implementer handoff requires --maker-session <session-id>.');
  }
  if (requiresReviewReceipt(workflow, index) && !reviewReceiptMatches(state, workflow)) {
    throw new LoopTransitionError('Transition requires an approved reviewer receipt for this run.');
  }
  if (step.skill === 'reviewer') {
    if (!options.reviewerSession) throw new LoopTransitionError('Reviewer handoff requires --reviewer-session <independent-session-id>.');
    if (!state.run.makerSession) throw new LoopTransitionError('Reviewer handoff requires a recorded maker session.');
    if (options.reviewerSession === state.run.makerSession) throw new LoopTransitionError('Reviewer session must differ from maker session.');
  }

  const manifest = loadManifest(step.manifest);
  const runGate = options.runGate || ((gate, spec) => {
    if (!spec) throw new LoopTransitionError(`Unknown postflight gate: ${gate}`);
    const cwd = spec.targetRoot ? state.targetRoot : ROOT;
    if (!cwd) throw new LoopTransitionError(`Gate ${gate} needs workflow --target-root <path>.`);
    execFileSync(spec.command, spec.args, { cwd, stdio: 'inherit', shell: false });
  });
  let passedGates;
  try {
    passedGates = executePostflight(manifest, state, runGate);
    assertRequiredArtifacts(manifest, state);
  } catch (error) {
    recordFailure(state, workflow, step, error);
    throw new LoopTransitionError(`Postflight failed for ${step.id}: ${error.message}`);
  }

  if (step.skill === 'implementer') state.run.makerSession = options.makerSession || state.run.makerSession;
  state.completedGates = [...new Set([...state.completedGates, ...passedGates])];
  state.consecutiveVerifyFail = 0;
  if (step.skill === 'reviewer') {
    const receipt = {
      version: 1,
      result: 'approved',
      runId: state.run.runId,
      workflow: workflow.name,
      round: state.currentRound,
      step: step.id,
      makerSession: state.run.makerSession,
      reviewerSession: options.reviewerSession,
      reviewedRevision: options.reviewedRevision || 'working-tree',
      approvedAt: new Date().toISOString(),
    };
    ensureStateDir();
    writeFileSync(REVIEW_RECEIPT_PATH, JSON.stringify(receipt, null, 2));
    appendRunEvent({ type: 'review_approved', ...receipt });
  }

  state.handoff.stepIndex = index + 1;
  state.handoff.activeSkill = null;
  state.handoffCount += 1;
  const completed = state.handoff.stepIndex >= workflow.steps.length;
  if (completed) {
    assertGoalSatisfied(workflow, state);
    state.currentIteration += 1; // completed workflow, never individual handoffs
    state.currentRound += 1;
    state.sessionRoundCount += 1;
    state.status = 'completed';
    state.stopReason = 'workflow_completed';
    state.handoff.stepIndex = 0;
  }
  state.history.push({ type: 'handoff_completed', workflow: workflow.name, step: step.id, handoffCount: state.handoffCount, timestamp: new Date().toISOString(), result: 'postflight_passed' });
  appendRunEvent({ type: 'handoff_completed', runId: state.run.runId, workflow: workflow.name, step: step.id, completed });
  saveLoopState(state);
  return state;
}

export function selectWorkflow(state, workflowName, options = {}) {
  const workflow = loadWorkflows().find((item) => item.name === workflowName);
  if (!workflow) throw new LoopTransitionError(`Workflow not found: ${workflowName}`);
  if (state.status === 'running') throw new LoopTransitionError('Cannot switch a running workflow. Complete it or resolve its failure first.');
  if (options.newSession && !options.resetReason) throw new LoopTransitionError('Starting a new session requires --reason <human-readable-reason>.');
  state.handoff = { workflow: workflowName, stepIndex: 0, activeSkill: null };
  state.run = { runId: null, makerSession: null };
  state.targetRoot = options.targetRoot ? resolve(options.targetRoot) : null;
  state.completedGates = [];
  state.status = 'idle';
  state.stopReason = null;
  if (options.newSession) {
    state.currentIteration = 0;
    state.sessionRoundCount = 0;
    state.consecutiveVerifyFail = 0;
    appendRunEvent({ type: 'session_reset', workflow: workflowName, reason: options.resetReason });
  }
  state.maxIterations = workflow.goal?.max_iterations || state.maxIterations || DEFAULT_LOOP_SAFETY.max_iterations || 10;
  state.maxConsecutiveVerifyFail = DEFAULT_LOOP_SAFETY.consecutive_verify_fail || 3;
  state.maxRoundsPerSession = DEFAULT_LOOP_SAFETY.max_rounds_per_session || 3;
  appendRunEvent({ type: 'workflow_selected', workflow: workflowName, targetRoot: state.targetRoot, newSession: Boolean(options.newSession) });
  saveLoopState(state);
  return workflow;
}

export function doctor() {
  const checks = [];
  const required = ['AGENTS.md', 'docs/ARCHITECTURE.md', 'docs/DECISIONS.md', 'docs/LOOP_ENGINEERING.md', 'docs/upgrade-plans/CURRENT.md', 'harness/context-budget.yaml', '.cursor/hooks.json'];
  for (const file of required) checks.push({ file, ok: existsSync(join(ROOT, file)) });
  const wfErrors = validateWorkflows();
  try {
    loadProjectCapabilities(ROOT);
    checks.push({ file: CAPABILITIES_RELATIVE_PATH.replace(/\\/g, '/'), ok: true });
  } catch (error) {
    checks.push({ file: CAPABILITIES_RELATIVE_PATH.replace(/\\/g, '/'), ok: false, error: error.message });
  }
  return { checks, wfErrors, healthy: checks.every((check) => check.ok) && wfErrors.length === 0 };
}
