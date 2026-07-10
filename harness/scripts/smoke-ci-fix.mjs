#!/usr/bin/env node
/**
 * Smoke: ci-fix workflow handoff chain + goal metadata
 */
import {
  loadWorkflows,
  getNextHandoff,
  validateWorkflows,
} from './loop-lib.mjs';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

console.log('=== smoke: ci-fix ===');

const errors = validateWorkflows();
assert(errors.length === 0, `workflow errors: ${errors.join('; ')}`);

const wf = loadWorkflows().find((w) => w.name === 'ci-fix');
assert(wf, 'ci-fix workflow not found');
assert(wf.goal?.success_condition, 'ci-fix missing goal.success_condition');
assert(wf.goal?.checker === 'reviewer', 'ci-fix checker should be reviewer');

const state = { handoff: { workflow: 'ci-fix', stepIndex: 0, activeSkill: null } };
const skills = [];

while (true) {
  const h = getNextHandoff(state);
  if (h.done) break;
  skills.push(h.skill);
  assert(h.manifest, `step ${h.step.id} should have manifest`);
  state.handoff.stepIndex++;
}

assert(
  skills.join(',') === 'explorer,implementer,tester',
  `ci-fix skill chain got: ${skills.join(',')}`
);

console.log(`✓ ci-fix chain: ${skills.join(' → ')}`);
console.log(`✓ goal: ${wf.goal.success_condition}`);
console.log('\n✓ smoke:ci-fix passed');
