import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const name = 'current-has-next';

/** @param {string} root */
export function run(root) {
  const path = join(root, 'docs/upgrade-plans/CURRENT.md');
  const content = readFileSync(path, 'utf8');
  if (!content.includes('下轮占位')) {
    return { ok: false, message: 'CURRENT.md missing 下轮占位 section' };
  }
  if (!content.includes('验收标准')) {
    return { ok: false, message: 'CURRENT.md missing 验收标准 in next round' };
  }
  return { ok: true };
}
