#!/usr/bin/env node
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
for (const d of ['AGENTS.md', 'docs/upgrade-plans/CURRENT.md']) {
  if (!existsSync(join(ROOT, d))) {
    console.error(`Missing: ${d}`);
    process.exit(1);
  }
}
console.log('before-start: OK');
