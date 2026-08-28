#!/usr/bin/env node
/** Zero-LLM golden checks for capability-profile gate resolution. */
import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { loadProjectCapabilities, resolvePostflightGate } from './loop-lib.mjs';

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const fixtureRoot = mkdtempSync(join(tmpdir(), 'loop-forge-profile-'));
try {
  const profileDir = join(fixtureRoot, 'harness');
  mkdirSync(profileDir, { recursive: true });
  writeFileSync(join(profileDir, 'project-capabilities.yaml'), [
    'version: 1',
    'package_manager: npm',
    'gates:',
    '  verify: true',
    '  review: true',
    '  smoke_all: false',
    '',
  ].join('\n'));

  const profile = loadProjectCapabilities(fixtureRoot);
  assert(profile.packageManager === 'npm', 'profile should preserve the allowlisted npm package manager');
  assert(profile.gates.smokeAll === false, 'profile should preserve an unavailable optional smoke gate');
  const verify = resolvePostflightGate('project-verify', fixtureRoot);
  assert(verify.command === 'npm' && verify.args.join(' ') === 'run verify', 'project verify must resolve through the profile');
  const doctor = resolvePostflightGate('project-doctor', fixtureRoot);
  assert(doctor.command === 'node' && doctor.targetRoot, 'project doctor remains a fixed allowlisted node command');
} finally {
  rmSync(fixtureRoot, { recursive: true, force: true });
}

console.log('✓ capability profile gate resolution passed');
