import { existsSync, readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { join, relative } from 'node:path';

export const name = 'no-secrets';

const PATTERNS = [
  /AKIA[0-9A-Z]{16}/,
  /ghp_[a-zA-Z0-9]{36,}/,
  /github_pat_[a-zA-Z0-9_]+/,
  /sk-[a-zA-Z0-9]{20,}/,
];

function candidateFiles(root) {
  // Include tracked and non-ignored pending files: these are the only files a
  // normal commit can add, while local ignored .env files stay outside review.
  const output = execFileSync('git', ['ls-files', '-z', '--cached', '--others', '--exclude-standard'], { cwd: root });
  return output.toString('utf8').split('\0')
    .filter((file) => /\.(md|json|yaml|yml|mjs|js|ts|env)$/i.test(file) && existsSync(join(root, file)))
    .map((file) => join(root, file));
}

/** @param {string} root */
export function run(root) {
  const files = candidateFiles(root);
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
