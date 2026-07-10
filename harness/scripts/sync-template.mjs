#!/usr/bin/env node
/**
 * Sync mother harness → projects/_template
 */
import { readFileSync, copyFileSync, mkdirSync, existsSync, readdirSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse as parseYaml } from 'yaml';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const TEMPLATE = join(ROOT, 'projects/_template');
const manifest = parseYaml(
  readFileSync(join(ROOT, 'harness/templates/sync-manifest.yaml'), 'utf8')
);

function copyDir(src, dest) {
  mkdirSync(dest, { recursive: true });
  for (const ent of readdirSync(src)) {
    const s = join(src, ent);
    const d = join(dest, ent);
    if (statSync(s).isDirectory()) copyDir(s, d);
    else copyFileSync(s, d);
  }
}

console.log('=== sync-template ===\n');

for (const rel of manifest.files || []) {
  const src = join(ROOT, rel);
  const dest = join(TEMPLATE, rel);
  if (!existsSync(src)) {
    console.error(`✗ missing source: ${rel}`);
    process.exit(1);
  }
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
  console.log(`✓ ${rel}`);
}

for (const dir of manifest.dirs || []) {
  const src = join(ROOT, dir);
  const dest = join(TEMPLATE, dir);
  if (!existsSync(src)) {
    console.error(`✗ missing dir: ${dir}`);
    process.exit(1);
  }
  copyDir(src, dest);
  console.log(`✓ ${dir}/`);
}

console.log('\n=== sync-template OK ===');
