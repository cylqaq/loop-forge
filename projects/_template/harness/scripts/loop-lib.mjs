/**
 * Loop Forge harness library — workflow/manifest/state
 */
import { readFileSync, writeFileSync, existsSync, readdirSync } from 'node:fs';
import { join, dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const __dirname = dirname(fileURLToPath(import.meta.url));
export const ROOT = resolve(__dirname, '../..');
export const HARNESS = join(ROOT, 'harness');

export function readYaml(path) {
  return parseYaml(readFileSync(path, 'utf8'));
}

export function loadWorkflows() {
  const dir = join(HARNESS, 'workflows');
  return readdirSync(dir)
    .filter((f) => f.endsWith('.yaml'))
    .map((f) => ({ file: f, ...readYaml(join(dir, f)) }));
}

export function loadManifest(name) {
  const path = join(HARNESS, 'manifests', `${name}.yaml`);
  if (!existsSync(path)) throw new Error(`Manifest not found: ${name}`);
  return readYaml(path);
}

export function validateWorkflows() {
  const errors = [];
  const workflows = loadWorkflows();
  for (const wf of workflows) {
    for (const step of wf.steps || []) {
      if (step.manifest) {
        const manifestPath = join(HARNESS, 'manifests', `${step.manifest}.yaml`);
        if (!existsSync(manifestPath)) {
          errors.push(`[${wf.name}] step ${step.id}: missing manifest ${step.manifest}`);
        } else {
          const m = readYaml(manifestPath);
          if (step.skill && m.skills && !m.skills.includes(step.skill)) {
            errors.push(
              `[${wf.name}] step ${step.id}: skill ${step.skill} not in manifest ${step.manifest} skills`
            );
          }
        }
      }
    }
  }
  return errors;
}

export function loadLoopState() {
  const path = join(ROOT, 'state/loop-state.json');
  if (!existsSync(path)) {
    return {
      currentRound: 1,
      currentIteration: 0,
      maxIterations: 10,
      status: 'idle',
      goal: '',
      consecutiveVerifyFail: 0,
      history: [],
      handoff: { workflow: 'round-cycle', stepIndex: 0, activeSkill: null },
      lastUpdated: new Date().toISOString(),
    };
  }
  return JSON.parse(readFileSync(path, 'utf8'));
}

export function saveLoopState(state) {
  state.lastUpdated = new Date().toISOString();
  writeFileSync(join(ROOT, 'state/loop-state.json'), JSON.stringify(state, null, 2));
}

export function getNextHandoff(state) {
  const wfName = state.handoff?.workflow || 'round-cycle';
  const wf = loadWorkflows().find((w) => w.name === wfName);
  if (!wf) throw new Error(`Workflow not found: ${wfName}`);

  const idx = state.handoff?.stepIndex ?? 0;
  const step = wf.steps[idx];
  if (!step) {
    return { done: true, message: 'Workflow complete. Run Adjustment (Phase 04).' };
  }

  const manifest = step.manifest ? loadManifest(step.manifest) : null;
  return {
    done: false,
    workflow: wfName,
    stepIndex: idx,
    step,
    skill: step.skill,
    manifest,
    phase: step.phase,
    instruction: `Activate @${step.skill}. ${step.description || ''}`,
  };
}

export function completeHandoff(state) {
  const wfName = state.handoff?.workflow || 'round-cycle';
  const wf = loadWorkflows().find((w) => w.name === wfName);
  const idx = state.handoff?.stepIndex ?? 0;
  const nextIdx = idx + 1;

  state.handoff.stepIndex = nextIdx;
  state.handoff.activeSkill = null;
  state.currentIteration = (state.currentIteration || 0) + 1;

  if (nextIdx >= (wf?.steps?.length || 0)) {
    state.status = 'completed';
    state.handoff.stepIndex = 0;
  }

  state.history.push({
    iteration: state.currentIteration,
    step: wf?.steps?.[idx]?.id,
    timestamp: new Date().toISOString(),
    result: 'handoff_complete',
  });

  saveLoopState(state);
  return state;
}

export function doctor() {
  const checks = [];
  const required = [
    'AGENTS.md',
    'docs/ARCHITECTURE.md',
    'docs/DECISIONS.md',
    'docs/LOOP_ENGINEERING.md',
    'docs/upgrade-plans/CURRENT.md',
    'harness/context-budget.yaml',
    '.cursor/hooks.json',
  ];

  for (const f of required) {
    const ok = existsSync(join(ROOT, f));
    checks.push({ file: f, ok });
  }

  const wfErrors = validateWorkflows();
  return { checks, wfErrors, healthy: checks.every((c) => c.ok) && wfErrors.length === 0 };
}
