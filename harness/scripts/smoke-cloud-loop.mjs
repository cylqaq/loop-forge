#!/usr/bin/env node
/**
 * Smoke: cloud-loop dry-run (no API key / no @cursor/sdk required)
 */
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');

console.log('=== smoke:cloud-loop ===');
execSync('node scripts/cloud-loop.mjs --dry-run', { cwd: ROOT, stdio: 'inherit' });
console.log('\n✓ smoke:cloud-loop passed');
