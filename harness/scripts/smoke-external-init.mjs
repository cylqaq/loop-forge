#!/usr/bin/env node
/**
 * Smoke: external init outside mother repo projects/
 */
import { execSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const TARGET = join(ROOT, '..', 'loop-forge-r5-smoke-external');

console.log('=== smoke: external-init ===');

if (existsSync(TARGET)) {
  rmSync(TARGET, { recursive: true, force: true });
}

execSync(
  `node harness/scripts/loop.mjs init --external "${TARGET}" smoke-external --git`,
  { cwd: ROOT, stdio: 'inherit' }
);

execSync('npm run verify', { cwd: TARGET, stdio: 'inherit' });

const origin = join(TARGET, '.loop-forge-origin.yaml');
if (!existsSync(origin)) throw new Error('missing .loop-forge-origin.yaml');

rmSync(TARGET, { recursive: true, force: true });
console.log('\n✓ smoke:external-init passed');
