#!/usr/bin/env node
/** Validates SKILL.md frontmatter in .cursor/skills */
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '../../../..');
const skillsRoot = join(root, '.cursor/skills');
let ok = true;

function check(dir) {
  for (const ent of readdirSync(dir)) {
    const p = join(dir, ent);
    if (!statSync(p).isDirectory()) continue;
    const md = join(p, 'SKILL.md');
    if (existsSync(md)) {
      const raw = readFileSync(md, 'utf8');
      if (!raw.includes('name:') || !raw.includes('description:')) {
        console.error(`✗ ${md}`);
        ok = false;
      } else {
        console.log(`✓ ${ent}`);
      }
    }
    check(p);
  }
}

check(skillsRoot);
process.exit(ok ? 0 : 1);
