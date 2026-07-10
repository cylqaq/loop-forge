import { loadWorkflows } from '../../scripts/loop-lib.mjs';

export const name = 'workflow-goal';

/** @param {string} root */
export function run(_root) {
  const required = ['ci-fix', 'scaffold-project'];
  const workflows = loadWorkflows();
  const errors = [];

  for (const name of required) {
    const wf = workflows.find((w) => w.name === name);
    if (!wf) {
      errors.push(`missing workflow: ${name}`);
      continue;
    }
    if (!wf.goal?.success_condition) {
      errors.push(`${name}: missing goal.success_condition`);
    }
    if (!wf.goal?.checker) {
      errors.push(`${name}: missing goal.checker`);
    }
  }

  if (errors.length) return { ok: false, message: errors.join('; ') };
  return { ok: true };
}
