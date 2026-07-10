#!/usr/bin/env node
/**
 * Loop Forge verify gate — 终止条件权威来源（禁止模型自评）
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const REQUIRED = [
  'AGENTS.md',
  'docs/ARCHITECTURE.md',
  'docs/DECISIONS.md',
  'docs/LOOP_ENGINEERING.md',
  'docs/upgrade-plans/CURRENT.md',
  'harness/workflows/round-cycle.yaml',
  'harness/manifests/round-start.yaml',
  '.cursor/hooks.json',
];

console.log('=== Loop Forge Verify ===\n');

let failed = false;

console.log('1. Structure check...');
for (const f of REQUIRED) {
  const ok = existsSync(join(ROOT, f));
  console.log(`   ${ok ? '✓' : '✗'} ${f}`);
  if (!ok) failed = true;
}

console.log('\n2. Loop doctor...');
try {
  execSync('node harness/scripts/loop.mjs doctor', { cwd: ROOT, stdio: 'inherit' });
} catch {
  failed = true;
}

console.log('\n3. Smoke tests...');
try {
  execSync('node harness/scripts/smoke-all.mjs', { cwd: ROOT, stdio: 'inherit' });
} catch {
  failed = true;
}

console.log('\n4. Rule review...');
try {
  execSync('node harness/review/run-review.mjs', { cwd: ROOT, stdio: 'inherit' });
} catch {
  failed = true;
}

if (failed) {
  console.error('\n=== Verify FAILED ===');
  process.exit(1);
}
console.log('\n=== Verify OK ===');
