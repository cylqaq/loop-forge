import { existsSync } from 'node:fs';
import { join } from 'node:path';

export const name = 'required-docs';

const REQUIRED = [
  'AGENTS.md',
  'docs/ARCHITECTURE.md',
  'docs/DECISIONS.md',
  'docs/LOOP_ENGINEERING.md',
  'docs/upgrade-plans/CURRENT.md',
];

/** @param {string} root */
export function run(root) {
  const missing = REQUIRED.filter((f) => !existsSync(join(root, f)));
  if (missing.length) {
    return { ok: false, message: `Missing docs: ${missing.join(', ')}` };
  }
  return { ok: true };
}
