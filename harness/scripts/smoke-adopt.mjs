#!/usr/bin/env node
/**
 * Smoke: adopt overlay on minimal existing project fixture
 */
import { execSync } from 'node:child_process';
import { existsSync, mkdirSync, writeFileSync, rmSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const TARGET = join(ROOT, '..', 'loop-forge-r6-smoke-adopt');

console.log('=== smoke:adopt ===');

if (existsSync(TARGET)) rmSync(TARGET, { recursive: true, force: true });
mkdirSync(TARGET, { recursive: true });
writeFileSync(
  join(TARGET, 'README.md'),
  '# fixture\n\nPre-existing business repo stub.\n'
);
writeFileSync(join(TARGET, 'package.json'), '{"name":"fixture","version":"0.0.0","private":true}\n');

execSync(
  `node harness/scripts/loop.mjs adopt --external "${TARGET}" smoke-adopt --skip-install`,
  { cwd: ROOT, stdio: 'inherit' }
);

const required = [
  '.loop-forge-origin.yaml',
  'harness/workflows/round-cycle.yaml',
  'harness/scripts/loop.mjs',
  'scripts/verify-loop.mjs',
  'project.yaml',
];
for (const f of required) {
  if (!existsSync(join(TARGET, f))) throw new Error(`adopt missing: ${f}`);
}

const origin = readFileSync(join(TARGET, '.loop-forge-origin.yaml'), 'utf8');
if (!origin.includes('mode: adopt')) throw new Error('origin marker missing mode: adopt');

rmSync(TARGET, { recursive: true, force: true });
console.log('\n✓ smoke:adopt passed');
