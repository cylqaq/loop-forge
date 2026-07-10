#!/usr/bin/env node
/**
 * Smoke: sync-template manifest paths exist
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';
import { execSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const manifest = parseYaml(
  readFileSync(join(ROOT, 'harness/templates/sync-manifest.yaml'), 'utf8')
);

console.log('=== smoke: sync-template ===');

for (const rel of manifest.files || []) {
  if (!existsSync(join(ROOT, rel))) throw new Error(`missing: ${rel}`);
}
for (const dir of manifest.dirs || []) {
  if (!existsSync(join(ROOT, dir))) throw new Error(`missing dir: ${dir}`);
}

execSync('node harness/scripts/sync-template.mjs', { cwd: ROOT, stdio: 'inherit' });
console.log('\n✓ smoke:sync-template passed');
