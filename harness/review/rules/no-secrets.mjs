import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

export const name = 'no-secrets';

const PATTERNS = [
  /AKIA[0-9A-Z]{16}/,
  /ghp_[a-zA-Z0-9]{36,}/,
  /github_pat_[a-zA-Z0-9_]+/,
  /sk-[a-zA-Z0-9]{20,}/,
];

const SKIP = new Set(['node_modules', '.git', 'package-lock.json']);

function walk(dir, root, files = []) {
  for (const ent of readdirSync(dir)) {
    if (SKIP.has(ent)) continue;
    const p = join(dir, ent);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, root, files);
    else if (/\.(md|json|yaml|yml|mjs|js|ts|env)$/i.test(ent)) files.push(p);
  }
  return files;
}

/** @param {string} root */
export function run(root) {
  const files = walk(root, root);
  for (const f of files) {
    if (f.includes('no-secrets.mjs')) continue;
    const content = readFileSync(f, 'utf8');
    for (const pat of PATTERNS) {
      if (pat.test(content)) {
        return { ok: false, message: `Possible secret in ${relative(root, f)}` };
      }
    }
  }
  return { ok: true };
}
