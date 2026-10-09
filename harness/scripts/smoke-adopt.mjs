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
const BARE_TARGET = join(ROOT, '..', 'loop-forge-r6-smoke-adopt-bare');

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
  'harness/review/run-review.mjs',
  'scripts/verify-loop.mjs',
  'REVIEW_PROMPT.md',
  'project.yaml',
];
for (const f of required) {
  if (!existsSync(join(TARGET, f))) throw new Error(`adopt missing: ${f}`);
}

const origin = readFileSync(join(TARGET, '.loop-forge-origin.yaml'), 'utf8');
if (!origin.includes('mode: adopt')) throw new Error('origin marker missing mode: adopt');

const pkg = JSON.parse(readFileSync(join(TARGET, 'package.json'), 'utf8'));
if (!pkg.scripts?.review) throw new Error('adopt should add review script');

if (existsSync(BARE_TARGET)) rmSync(BARE_TARGET, { recursive: true, force: true });
mkdirSync(BARE_TARGET, { recursive: true });
writeFileSync(join(BARE_TARGET, 'README.md'), '# bare repository\n');
execSync(
  `node harness/scripts/loop.mjs adopt --external "${BARE_TARGET}" smoke-adopt-bare --skip-install`,
  { cwd: ROOT, stdio: 'inherit' }
);
for (const f of ['package.json', 'AGENTS.md', '.gitignore', 'docs/README.md', 'docs/ARCHITECTURE.md', 'docs/DECISIONS.md', 'docs/upgrade-plans/CURRENT.md']) {
  if (!existsSync(join(BARE_TARGET, f))) throw new Error(`bare adopt missing: ${f}`);
}
const barePkg = JSON.parse(readFileSync(join(BARE_TARGET, 'package.json'), 'utf8'));
if (!barePkg.dependencies?.yaml || !barePkg.scripts?.verify || !barePkg.scripts?.review) {
  throw new Error('bare adopt package scripts/dependencies incomplete');
}
if (!readFileSync(join(BARE_TARGET, 'project.yaml'), 'utf8').includes('id: smoke-adopt-bare')) {
  throw new Error('bare adopt did not personalize project id');
}
const profile = readFileSync(join(BARE_TARGET, 'harness/project-capabilities.yaml'), 'utf8');
if (!profile.includes('package_manager: npm') || !profile.includes('smoke_all: false')) {
  throw new Error('bare adopt capability profile does not match installed scripts');
}

rmSync(TARGET, { recursive: true, force: true });
rmSync(BARE_TARGET, { recursive: true, force: true });
console.log('\n✓ smoke:adopt passed');
