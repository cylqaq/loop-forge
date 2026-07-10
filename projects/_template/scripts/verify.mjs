#!/usr/bin/env node
import { execSync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const REQUIRED = ['AGENTS.md', 'INDEX.yaml', 'project.yaml', 'harness/workflows/round-cycle.yaml'];

console.log('=== Sub-project Verify ===\n');
let failed = false;

for (const f of REQUIRED) {
  const ok = existsSync(join(ROOT, f));
  console.log(`${ok ? '✓' : '✗'} ${f}`);
  if (!ok) failed = true;
}

try {
  execSync('node harness/scripts/loop.mjs doctor', { cwd: ROOT, stdio: 'inherit' });
} catch {
  failed = true;
}

if (failed) {
  console.error('\n=== Verify FAILED ===');
  process.exit(1);
}
console.log('\n=== Verify OK ===');
