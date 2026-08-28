#!/usr/bin/env node
/**
 * Loop Forge CLI — Loop Engineering 执行 Harness 入口
 */
import {
  ROOT,
  doctor,
  validateWorkflows,
  loadManifest,
  loadLoopState,
  activateNextHandoff,
  completeHandoff,
  loadWorkflows,
  selectWorkflow,
} from './loop-lib.mjs';
import { parseInitArgs, runInit } from './init-lib.mjs';
import { parseAdoptArgs, runAdopt } from './adopt-lib.mjs';
import { join } from 'node:path';

const [, , cmd, ...args] = process.argv;

function print(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

function option(args, name) {
  const index = args.indexOf(name);
  return index >= 0 ? args[index + 1] : undefined;
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
      const handoff = activateNextHandoff(state);
      print(handoff);
      break;
    }

    case 'handoff': {
      if (args[0] !== 'complete') {
        console.error('Usage: pnpm loop handoff complete [--maker-session <id>] [--reviewer-session <id>] [--reviewed-revision <id>]');
        process.exit(1);
      }
      const state = completeHandoff(loadLoopState(), {
        makerSession: option(args, '--maker-session'),
        reviewerSession: option(args, '--reviewer-session'),
        reviewedRevision: option(args, '--reviewed-revision'),
      });
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
      } else if (args[0] === 'list') {
        for (const wf of loadWorkflows()) {
          console.log(`- ${wf.name}: ${wf.description || ''} (${wf.steps?.length || 0} steps)`);
        }
      } else if (args[0] === 'use' && args[1]) {
        const wf = loadWorkflows().find((w) => w.name === args[1]);
        if (!wf) {
          console.error(`Workflow not found: ${args[1]}`);
          process.exit(1);
        }
        const state = loadLoopState();
        selectWorkflow(state, args[1], {
          newSession: args.includes('--new-session'),
          resetReason: option(args, '--reason'),
          targetRoot: option(args, '--target-root'),
        });
        console.log(`Active workflow: ${args[1]} (${wf.steps.length} steps)`);
      } else {
        console.error('Usage: pnpm loop workflow validate|list|use <name> [--target-root <path>] [--new-session --reason <text>]');
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
      const template = join(ROOT, 'projects/_template');
      const { existsSync } = await import('node:fs');
      if (!existsSync(template)) {
        console.error('Template not found');
        process.exit(1);
      }
      const p = parseInitArgs(process.argv.slice(3), ROOT);
      runInit({
        dest: p.dest,
        id: p.id,
        root: ROOT,
        template,
        skipInstall: p.skipInstall,
        initGit: p.initGit,
        external: p.external,
      });
      break;
    }

    case 'adopt': {
      const template = join(ROOT, 'projects/_template');
      const { existsSync } = await import('node:fs');
      if (!existsSync(template)) {
        console.error('Template not found');
        process.exit(1);
      }
      if (!process.argv.includes('--external')) {
        console.error('Usage: pnpm loop adopt --external <path> [id] [--force] [--skip-install]');
        process.exit(1);
      }
      const p = parseAdoptArgs(process.argv.slice(3), ROOT);
      runAdopt({
        dest: p.dest,
        id: p.id,
        root: ROOT,
        template,
        skipInstall: p.skipInstall,
        force: p.force,
      });
      break;
    }

    case 'review': {
      const { execSync } = await import('node:child_process');
      execSync('node harness/review/run-review.mjs', { cwd: ROOT, stdio: 'inherit' });
      break;
    }

    case 'sync-template': {
      const { execSync } = await import('node:child_process');
      execSync('node harness/scripts/sync-template.mjs', { cwd: ROOT, stdio: 'inherit' });
      break;
    }

    default:
      console.log(`Loop Forge CLI

Commands:
  doctor              Health check
  next                Get next handoff (single skill)
  handoff complete    Advance an active step; implementer/reviewer require session evidence
  workflow validate   L2↔L3 alignment
  workflow list       List workflows
  workflow use <name> Switch idle workflow; budget reset needs --new-session --reason <text>
  manifest <name>     Show manifest
  init [path] [id]              Internal scaffold (projects/)
  init --external <path> [id]   External scaffold (outside projects/)
                                  Flags: --git --skip-install
  adopt --external <path> [id]  Overlay harness on existing repo
                                  Flags: --force --skip-install
  review              Zero-LLM rule review
  sync-template       Sync harness → projects/_template
`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
