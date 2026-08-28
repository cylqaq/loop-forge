#!/usr/bin/env node
/**
 * Smoke: scaffold-project workflow handoff chain
 */
import { loadWorkflows, validateWorkflows } from './loop-lib.mjs';

function assert(cond, msg) {
  if (!cond) throw new Error(msg);
}

console.log('=== smoke: scaffold-project ===');

assert(validateWorkflows().length === 0, 'workflow validation failed');

const wf = loadWorkflows().find((w) => w.name === 'scaffold-project');
assert(wf, 'scaffold-project workflow missing');
assert(wf.steps.length === 5, 'scaffold-project should have 5 steps');
assert(wf.goal?.completion_gate === 'project-verify', 'scaffold-project should require project verify gate');
const verify = wf.steps.find((step) => step.id === 'verify');
assert(verify?.manifest === 'scaffold-close', 'scaffold-project verify step should use scaffold-close');

const skills = wf.steps.map((step) => step.skill);
for (const step of wf.steps) assert(step.manifest, `step ${step.id} needs manifest`);

assert(
  skills.join(',') === 'project-scaffold,implementer,tester,reviewer,loop-orchestrator',
  `scaffold chain: ${skills.join(',')}`
);

console.log(`✓ chain: ${skills.join(' → ')}`);
console.log('\n✓ smoke:scaffold-project passed');
