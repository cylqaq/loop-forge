#!/usr/bin/env node
/**
 * Loop Harness 结构验证 — 子项目终止条件之一（与业务 verify 组合）
 */
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const REQUIRED = [
  'AGENTS.md',
  'INDEX.yaml',
  'project.yaml',
  '.loop-forge-origin.yaml',
  'harness/workflows/round-cycle.yaml',
  'harness/manifests/round-start.yaml',
  'docs/upgrade-plans/CURRENT.md',
];

console.log('=== Loop Harness Verify ===\n');
let failed = false;

for (const f of REQUIRED) {
  const ok = existsSync(join(ROOT, f));
  console.log(`${ok ? '✓' : '✗'} ${f}`);
  if (!ok) failed = true;
}

try {
  execSync('node harness/scripts/loop.mjs doctor', { cwd: ROOT, stdio: 'inherit' });
  execSync('node harness/scripts/loop.mjs workflow validate', { cwd: ROOT, stdio: 'inherit' });
} catch {
  failed = true;
}

if (failed) {
  console.error('\n=== Loop Harness Verify FAILED ===');
  process.exit(1);
}
console.log('\n=== Loop Harness Verify OK ===');
