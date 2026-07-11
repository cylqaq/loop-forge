#!/usr/bin/env node
/**
 * Loop CLI — 子项目执行 Harness 入口（无 init/sync-template/review/adopt）
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
  loadWorkflows,
} from './loop-lib.mjs';

const [, , cmd, ...args] = process.argv;

const MOTHER_ONLY = new Set(['init', 'adopt', 'sync-template', 'review']);

function print(obj) {
  console.log(JSON.stringify(obj, null, 2));
}

function rejectMotherOnly(name) {
  console.error(`${name} is mother-repo only. Run from loop-forge root.`);
  process.exit(1);
}

async function main() {
  if (MOTHER_ONLY.has(cmd)) rejectMotherOnly(cmd);

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
        state.handoff = { workflow: args[1], stepIndex: 0, activeSkill: null };
        state.status = 'running';
        saveLoopState(state);
        console.log(`Active workflow: ${args[1]} (${wf.steps.length} steps)`);
      } else {
        console.error('Usage: pnpm loop workflow validate|list|use <name>');
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
  handoff complete    Advance workflow step
  workflow validate   L2↔L3 alignment
  workflow list       List workflows
  workflow use <name> Switch active handoff workflow
  manifest <name>     Show manifest

Mother-only (run from loop-forge): init, adopt, sync-template, review
`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
