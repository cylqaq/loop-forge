#!/usr/bin/env node
/** Zero-LLM regression tests for guarded transitions, receipts, budgets, and recovery. */
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';

if (!process.env.LOOP_STATE_DIR) {
  const runtimeDir = mkdtempSync(join(tmpdir(), 'loop-forge-state-'));
  try {
    execFileSync(process.execPath, [fileURLToPath(import.meta.url)], {
      stdio: 'inherit',
      env: { ...process.env, LOOP_STATE_DIR: runtimeDir },
    });
  } finally {
    rmSync(runtimeDir, { recursive: true, force: true });
  }
  process.exit(0);
}

const {
  LoopTransitionError,
  activateNextHandoff,
  completeHandoff,
  getNextHandoff,
  loadLoopState,
  ROOT,
  saveLoopState,
  selectWorkflow,
  validateWorkflows,
} = await import('./loop-lib.mjs');

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function rejects(fn, text) {
  try {
    fn();
  } catch (error) {
    assert(error instanceof LoopTransitionError, `expected LoopTransitionError: ${error.message}`);
    return;
  }
  throw new Error(`expected rejection: ${text}`);
}

assert(process.env.LOOP_STATE_DIR, 'smoke must use an isolated LOOP_STATE_DIR');
assert(validateWorkflows().length === 0, 'workflow validation failed');

console.log('=== smoke: CLI bootstrap ===');
const bootstrapDir = mkdtempSync(join(tmpdir(), 'loop-forge-bootstrap-'));
try {
  const output = execFileSync(process.execPath, [join(ROOT, 'harness/scripts/loop.mjs'), 'next'], {
    encoding: 'utf8',
    env: { ...process.env, LOOP_STATE_DIR: bootstrapDir },
  });
  assert(output.includes('loop-orchestrator'), 'first CLI next should activate default state');
} finally {
  rmSync(bootstrapDir, { recursive: true, force: true });
}

console.log('=== smoke: guarded happy path ===');
const state = loadLoopState();
selectWorkflow(state, 'round-cycle');
const gateCalls = [];
const runGate = (gate) => gateCalls.push(gate);

for (const expected of ['loop-orchestrator', 'navigator', 'implementer', 'tester', 'reviewer', 'loop-orchestrator']) {
  const handoff = activateNextHandoff(state);
  assert(handoff.skill === expected, `expected ${expected}, got ${handoff.skill}`);
  if (expected === 'implementer') {
    completeHandoff(state, { makerSession: 'maker-session', runGate });
  } else if (expected === 'reviewer') {
    rejects(() => completeHandoff(state, { reviewerSession: 'maker-session', runGate }), 'same maker/reviewer session');
    assert(state.handoff.stepIndex === 4, 'rejected reviewer must not advance cursor');
    completeHandoff(state, { reviewerSession: 'reviewer-session', reviewedRevision: 'test-revision', runGate });
  } else {
    completeHandoff(state, { runGate });
  }
}
assert(state.status === 'completed', 'completed chain should be completed');
assert(state.currentIteration === 1, 'iteration counts completed workflow, not handoffs');
assert(state.handoffCount === 6, 'handoff count should include all six steps');
assert(gateCalls.join(',') === 'verify,review', `gates should run once: ${gateCalls.join(',')}`);
const receiptPath = `${process.env.LOOP_STATE_DIR}/review-receipt.json`;
assert(existsSync(receiptPath), 'review receipt should exist');
const receipt = JSON.parse(readFileSync(receiptPath, 'utf8'));
assert(receipt.makerSession === 'maker-session' && receipt.reviewerSession === 'reviewer-session', 'receipt should bind distinct sessions');

console.log('=== smoke: failed gate blocks progression ===');
const failing = loadLoopState();
selectWorkflow(failing, 'round-cycle');
failing.run = { runId: 'failure-run', makerSession: 'maker-session' };
failing.handoff = { workflow: 'round-cycle', stepIndex: 3, activeSkill: 'tester' };
failing.status = 'running';
for (let attempt = 1; attempt <= 3; attempt += 1) {
  rejects(() => completeHandoff(failing, { runGate: () => { throw new Error('verify failed'); } }), 'failed verify');
  assert(failing.handoff.stepIndex === 3, 'failed gate must not advance cursor');
  assert(failing.consecutiveVerifyFail === attempt, 'failure counter should increment');
}
assert(failing.status === 'blocked' && failing.stopReason === 'consecutive_verify_fail', 'third failure must block');

console.log('=== smoke: budget rejection ===');
const budget = loadLoopState();
selectWorkflow(budget, 'round-cycle');
budget.currentIteration = budget.maxIterations;
rejects(() => getNextHandoff(budget), 'iteration budget');
selectWorkflow(budget, 'round-cycle');
rejects(() => getNextHandoff(budget), 'workflow selection must not reset iteration budget');
saveLoopState(budget);
execFileSync(process.execPath, [join(ROOT, 'harness/scripts/loop.mjs'), 'workflow', 'use', 'round-cycle'], { stdio: 'pipe', env: process.env });
assert(loadLoopState().currentIteration === budget.maxIterations, 'CLI workflow use must not reset iteration budget');
budget.currentIteration = 0;
budget.sessionRoundCount = budget.maxRoundsPerSession;
rejects(() => getNextHandoff(budget), 'round budget');
selectWorkflow(budget, 'round-cycle');
rejects(() => getNextHandoff(budget), 'workflow selection must not reset round budget');
selectWorkflow(budget, 'round-cycle', { newSession: true, resetReason: 'new interactive session' });
assert(getNextHandoff(budget).skill === 'loop-orchestrator', 'explicit session reset should start a new run');

console.log('=== smoke: scaffold goal and artifacts ===');
const targetRoot = mkdtempSync(join(tmpdir(), 'loop-forge-scaffold-target-'));
try {
  const scaffold = loadLoopState();
  selectWorkflow(scaffold, 'scaffold-project', { newSession: true, resetReason: 'scaffold fixture', targetRoot });
  const scaffoldGate = () => {};
  activateNextHandoff(scaffold); // plan
  completeHandoff(scaffold, { runGate: scaffoldGate });
  activateNextHandoff(scaffold); // copy
  completeHandoff(scaffold, { makerSession: 'scaffold-maker', runGate: scaffoldGate });
  activateNextHandoff(scaffold); // verify
  rejects(() => completeHandoff(scaffold, { runGate: scaffoldGate }), 'missing scaffold artifacts');
  assert(scaffold.handoff.stepIndex === 2, 'missing artifacts must not advance scaffold verify');
  mkdirSync(join(targetRoot, 'harness/workflows'), { recursive: true });
  writeFileSync(join(targetRoot, '.loop-forge-origin.yaml'), 'fixture\n');
  writeFileSync(join(targetRoot, 'AGENTS.md'), 'fixture\n');
  writeFileSync(join(targetRoot, 'project.yaml'), 'fixture\n');
  writeFileSync(join(targetRoot, 'harness/workflows/round-cycle.yaml'), 'fixture\n');
  writeFileSync(join(targetRoot, 'harness/project-capabilities.yaml'), 'version: 1\npackage_manager: npm\ngates:\n  verify: true\n  review: true\n  smoke_all: false\n');
  completeHandoff(scaffold, { runGate: scaffoldGate });
  activateNextHandoff(scaffold); // review
  completeHandoff(scaffold, { reviewerSession: 'scaffold-reviewer', runGate: scaffoldGate });
  activateNextHandoff(scaffold); // adjust
  completeHandoff(scaffold, { runGate: scaffoldGate });
  assert(scaffold.status === 'completed' && scaffold.completedGates.includes('project-verify'), 'scaffold must prove project verify gate before completion');
} finally {
  rmSync(targetRoot, { recursive: true, force: true });
}

console.log('✓ state-machine behavior passed');
