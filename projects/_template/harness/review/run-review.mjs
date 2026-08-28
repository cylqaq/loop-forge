#!/usr/bin/env node
import { readdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const rulesDir = join(dirname(fileURLToPath(import.meta.url)), 'rules');

async function main() {
  const files = readdirSync(rulesDir).filter((f) => f.endsWith('.mjs') && f !== 'README.md');
  let failed = false;

  console.log('=== Loop Review (zero-LLM) ===\n');

  for (const file of files) {
    const mod = await import(pathToFileURL(join(rulesDir, file)).href);
    const name = mod.name || file;
    const result = mod.run(ROOT);
    if (result.ok) {
      console.log(`✓ ${name}`);
    } else {
      console.log(`✗ ${name}: ${result.message}`);
      failed = true;
    }
  }

  if (failed) process.exit(1);
  console.log('\n=== Review OK ===');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
