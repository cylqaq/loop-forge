#!/usr/bin/env node
/**
 * Smoke: loop init → install → verify → cleanup
 */
import { execSync } from 'node:child_process';
import { existsSync, rmSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const TARGET = join(ROOT, 'projects', 'smoke-test-init');

console.log('=== smoke: init ===');

if (existsSync(TARGET)) {
  rmSync(TARGET, { recursive: true, force: true });
}

execSync('node harness/scripts/loop.mjs init projects/smoke-test-init smoke-test-init', {
  cwd: ROOT,
  stdio: 'inherit',
});

execSync('npm run verify', { cwd: TARGET, stdio: 'inherit' });

rmSync(TARGET, { recursive: true, force: true });
console.log('\n✓ smoke:init passed');
