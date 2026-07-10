#!/usr/bin/env node
/**
 * Zero-LLM smoke tests for Loop Forge harness
 */
import { execSync } from 'node:child_process';
import { existsSync, unlinkSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  loadLoopState,
  saveLoopState,
  getNextHandoff,
  completeHandoff,
  validateWorkflows,
  doctor,
} from './loop-lib.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

console.log('=== smoke: structure ===');
const d = doctor();
assert(d.checks.every((c) => c.ok), 'doctor checks failed');

console.log('=== smoke: workflow validate ===');
assert(validateWorkflows().length === 0, 'workflow validation failed');

console.log('=== smoke: handoff cycle ===');
const statePath = join(ROOT, 'state/loop-state.json');
const hadState = existsSync(statePath);
const backup = hadState ? loadLoopState() : null;

const state = loadLoopState();
state.handoff = { workflow: 'round-cycle', stepIndex: 0, activeSkill: null };
state.status = 'running';
saveLoopState(state);

const h1 = getNextHandoff(loadLoopState());
assert(h1.skill === 'loop-orchestrator', 'first step should be loop-orchestrator');
assert(!h1.done, 'workflow should not be done');

completeHandoff(loadLoopState());
const h2 = getNextHandoff(loadLoopState());
assert(h2.skill === 'navigator', 'second step should be navigator');

if (backup) {
  saveLoopState(backup);
} else {
  try { unlinkSync(statePath); } catch { /* ok */ }
}

console.log('=== smoke: CLI ===');
execSync('node harness/scripts/loop.mjs doctor', { cwd: ROOT, stdio: 'pipe' });
execSync('node harness/scripts/loop.mjs workflow validate', { cwd: ROOT, stdio: 'pipe' });

console.log('=== smoke: init (full) ===');
execSync('node harness/scripts/smoke-init.mjs', { cwd: ROOT, stdio: 'inherit' });

console.log('=== smoke: ci-fix ===');
execSync('node harness/scripts/smoke-ci-fix.mjs', { cwd: ROOT, stdio: 'inherit' });

console.log('=== smoke: sync-template ===');
execSync('node harness/scripts/smoke-sync-template.mjs', { cwd: ROOT, stdio: 'inherit' });

console.log('\n✓ smoke:all passed');
