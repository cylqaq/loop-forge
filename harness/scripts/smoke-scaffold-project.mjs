#!/usr/bin/env node
/**
 * Smoke: scaffold-project workflow handoff chain
 */
import { loadWorkflows, getNextHandoff, validateWorkflows } from './loop-lib.mjs';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

console.log('=== smoke: scaffold-project ===');

assert(validateWorkflows().length === 0, 'workflow validation failed');

const wf = loadWorkflows().find((w) => w.name === 'scaffold-project');
assert(wf, 'scaffold-project workflow missing');
assert(wf.steps.length === 4, 'scaffold-project should have 4 steps');

const state = { handoff: { workflow: 'scaffold-project', stepIndex: 0, activeSkill: null } };
const skills = [];

while (true) {
  const h = getNextHandoff(state);
  if (h.done) break;
  skills.push(h.skill);
  assert(h.manifest, `step ${h.step.id} needs manifest`);
  state.handoff.stepIndex++;
}

assert(
  skills.join(',') === 'project-scaffold,implementer,tester,loop-orchestrator',
  `scaffold chain: ${skills.join(',')}`
);

console.log(`✓ chain: ${skills.join(' → ')}`);
console.log('\n✓ smoke:scaffold-project passed');
