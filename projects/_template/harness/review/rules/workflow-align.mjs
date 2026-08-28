import { validateWorkflows } from '../../scripts/loop-lib.mjs';

export const name = 'workflow-align';

/** @param {string} root */
export function run(_root) {
  const errors = validateWorkflows();
  if (errors.length) {
    return { ok: false, message: errors.join('; ') };
  }
  return { ok: true };
}
