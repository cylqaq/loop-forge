#!/usr/bin/env node
/**
 * Git worktree helpers for parallel Loop experiments
 */
import { execSync } from 'node:child_process';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const [, , cmd, name] = process.argv;

function run(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8' }).trim();
}

switch (cmd) {
  case 'create': {
    if (!name) {
      console.error('Usage: pnpm worktree create <name>');
      process.exit(1);
    }
    const branch = `loop/${name}`;
    const path = join(ROOT, '..', `loop-forge-${name}`);
    run(`git worktree add "${path}" -b ${branch}`);
    console.log(`Worktree: ${path} (branch ${branch})`);
    break;
  }
  case 'list': {
    console.log(run('git worktree list'));
    break;
  }
  case 'remove': {
    if (!name) {
      console.error('Usage: pnpm worktree remove <name>');
      process.exit(1);
    }
    const path = join(ROOT, '..', `loop-forge-${name}`);
    run(`git worktree remove "${path}"`);
    console.log(`Removed worktree: ${path}`);
    break;
  }
  default:
    console.log(`Usage:
  pnpm worktree create <name>
  pnpm worktree list
  pnpm worktree remove <name>`);
}
