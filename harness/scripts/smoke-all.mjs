#!/usr/bin/env node
/**
 * Zero-LLM smoke tests for Loop Forge harness
 */
import { execSync } from 'node:child_process';
import { mkdtempSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { tmpdir } from 'node:os';
import { fileURLToPath } from 'node:url';
import {
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

console.log('=== smoke: state machine ===');
const runtimeDir = mkdtempSync(join(tmpdir(), 'loop-forge-state-'));
try {
  execSync('node harness/scripts/smoke-state-machine.mjs', {
    cwd: ROOT,
    stdio: 'inherit',
    env: { ...process.env, LOOP_STATE_DIR: runtimeDir },
  });
} finally {
  rmSync(runtimeDir, { recursive: true, force: true });
}

console.log('=== smoke: project capabilities ===');
execSync('node harness/scripts/smoke-project-capabilities.mjs', { cwd: ROOT, stdio: 'inherit' });

console.log('=== smoke: CLI ===');
execSync('node harness/scripts/loop.mjs doctor', { cwd: ROOT, stdio: 'pipe' });
execSync('node harness/scripts/loop.mjs workflow validate', { cwd: ROOT, stdio: 'pipe' });

console.log('=== smoke: init (full) ===');
execSync('node harness/scripts/smoke-init.mjs', { cwd: ROOT, stdio: 'inherit' });

console.log('=== smoke: ci-fix ===');
execSync('node harness/scripts/smoke-ci-fix.mjs', { cwd: ROOT, stdio: 'inherit' });

console.log('=== smoke: sync-template ===');
execSync('node harness/scripts/smoke-sync-template.mjs', { cwd: ROOT, stdio: 'inherit' });

console.log('=== smoke: scaffold-project ===');
execSync('node harness/scripts/smoke-scaffold-project.mjs', { cwd: ROOT, stdio: 'inherit' });

console.log('=== smoke: external-init ===');
execSync('node harness/scripts/smoke-external-init.mjs', { cwd: ROOT, stdio: 'inherit' });

console.log('=== smoke: adopt ===');
execSync('node harness/scripts/smoke-adopt.mjs', { cwd: ROOT, stdio: 'inherit' });

console.log('=== smoke: pr-draft ===');
execSync('node harness/scripts/smoke-pr-draft.mjs --dry-run', { cwd: ROOT, stdio: 'inherit' });

console.log('=== smoke: cloud-loop ===');
execSync('node harness/scripts/smoke-cloud-loop.mjs', { cwd: ROOT, stdio: 'inherit' });

console.log('\n✓ smoke:all passed');
