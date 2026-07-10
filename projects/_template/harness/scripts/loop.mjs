#!/usr/bin/env node
/**
 * Loop Forge CLI — Loop Engineering 执行 Harness 入口
 * Usage: pnpm loop [doctor|next|handoff|workflow|manifest|init]
 */
import {
  ROOT,
  doctor,
  validateWorkflows,
  loadManifest,
  loadLoopState,
  saveLoopState,
  getNextHandoff,
  completeHandoff,
} from './loop-lib.mjs';
import { writeFileSync, existsSync, mkdirSync, cpSync } from 'node:fs';
import { join } from 'node:path';

const [, , cmd, ...args] = process.argv;

function print(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

async function main() {
  switch (cmd) {
    case 'doctor': {
      const r = doctor();
      console.log('=== Loop Doctor ===');
      for (const c of r.checks) {
        console.log(`${c.ok ? '✓' : '✗'} ${c.file}`);
      }
      if (r.wfErrors.length) {
        console.log('\nWorkflow errors:');
        r.wfErrors.forEach((e) => console.log(`  ✗ ${e}`));
      }
      process.exit(r.healthy ? 0 : 1);
    }

    case 'next': {
      const state = loadLoopState();
      if (state.status === 'blocked') {
        console.error('Loop blocked. Manual intervention required.');
        process.exit(2);
      }
      const handoff = getNextHandoff(state);
      state.handoff.activeSkill = handoff.skill || null;
      saveLoopState(state);
      print(handoff);
      break;
    }

    case 'handoff': {
      if (args[0] !== 'complete') {
        console.error('Usage: pnpm loop handoff complete');
        process.exit(1);
      }
      const state = completeHandoff(loadLoopState());
      print({ ok: true, state });
      break;
    }

    case 'workflow': {
      if (args[0] === 'validate') {
        const errors = validateWorkflows();
        if (errors.length) {
          errors.forEach((e) => console.error(e));
          process.exit(1);
        }
        console.log('workflow validate: OK');
      } else {
        console.error('Usage: pnpm loop workflow validate');
        process.exit(1);
      }
      break;
    }

    case 'manifest': {
      const name = args[0];
      if (!name) {
        console.error('Usage: pnpm loop manifest <name>');
        process.exit(1);
      }
      print(loadManifest(name));
      break;
    }

    case 'init': {
      const target = args[0] || 'projects/my-project';
      const template = join(ROOT, 'projects/_template');
      const dest = target.startsWith('/') || /^[A-Za-z]:/.test(target)
        ? target
        : join(ROOT, target);
      if (!existsSync(template)) {
        console.error('Template not found');
        process.exit(1);
      }
      mkdirSync(dest, { recursive: true });
      cpSync(template, dest, { recursive: true });
      console.log(`Scaffolded to ${dest}`);
      console.log('Next: cd into project, edit project.yaml & AGENTS.md, run pnpm install && pnpm loop doctor');
      break;
    }

    case 'review': {
      const { execSync } = await import('node:child_process');
      execSync('node harness/review/run-review.mjs', { cwd: ROOT, stdio: 'inherit' });
      break;
    }

    default:
      console.log(`Loop Forge CLI

Commands:
  doctor              Health check
  next                Get next handoff (single skill)
  handoff complete    Advance workflow step
  workflow validate   L2↔L3 alignment
  manifest <name>     Show manifest
  init [path]         Copy _template to path
  review              Zero-LLM rule review
`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
