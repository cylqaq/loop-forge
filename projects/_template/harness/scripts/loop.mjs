#!/usr/bin/env node
/** Leaf-project CLI — no init, adopt, or template sync authority. */
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

    default:
      console.log(`Loop CLI (sub-project)

Commands:
  doctor              Health check
  next                Get next handoff (single skill)
  handoff complete    Advance an active step; implementer/reviewer require session evidence
  workflow validate   L2↔L3 alignment
  workflow list       List workflows
  workflow use <name> Switch idle workflow; budget reset needs --new-session --reason <text>
  manifest <name>     Show manifest
  review              Run via the package script (npm/pnpm run review)

Mother-only: init, adopt, sync-template
`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
