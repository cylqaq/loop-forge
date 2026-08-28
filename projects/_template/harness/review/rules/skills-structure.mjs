import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

export const name = 'skills-structure';

/** @param {string} root */
export function run(root) {
  const skillsRoot = join(root, '.cursor/skills');
  if (!existsSync(skillsRoot)) {
    return { ok: false, message: '.cursor/skills not found' };
  }

  const errors = [];

  function collect(dir) {
    for (const ent of readdirSync(dir)) {
      const p = join(dir, ent);
      if (!statSync(p).isDirectory()) continue;
      const skillMd = join(p, 'SKILL.md');
      if (existsSync(skillMd)) {
        const raw = readFileSync(skillMd, 'utf8');
        if (!raw.startsWith('---')) {
          errors.push(`${skillMd}: missing frontmatter`);
        } else {
          const end = raw.indexOf('---', 3);
          const fm = raw.slice(3, end);
          if (!/^name:\s*.+/m.test(fm)) errors.push(`${skillMd}: missing name`);
          if (!/^description:\s*.+/m.test(fm)) errors.push(`${skillMd}: missing description`);
          const nameMatch = fm.match(/^name:\s*(.+)$/m);
          if (nameMatch && nameMatch[1].trim() !== ent) {
            errors.push(`${skillMd}: name != folder "${ent}"`);
          }
        }
      }
      collect(p);
    }
  }

  collect(skillsRoot);
  if (errors.length) return { ok: false, message: errors.join('; ') };
  return { ok: true };
}
