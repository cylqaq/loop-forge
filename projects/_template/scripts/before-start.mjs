#!/usr/bin/env node
/** Agent 启动前：关键文档存在性门禁 */
import { existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const docs = [
  'AGENTS.md',
  'docs/ARCHITECTURE.md',
  'docs/DECISIONS.md',
  'docs/upgrade-plans/CURRENT.md',
];

for (const d of docs) {
  if (!existsSync(join(ROOT, d))) {
    console.error(`Missing required doc: ${d}`);
    process.exit(1);
  }
}
console.log('before-start: OK');
