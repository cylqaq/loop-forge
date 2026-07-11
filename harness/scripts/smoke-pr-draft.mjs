#!/usr/bin/env node
/**
 * Smoke: pr-draft stage-3 assets (dry-run, no MCP/gh)
 */
import { existsSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '../..');
const dryRun = process.argv.includes('--dry-run') || !process.argv.includes('--live');

console.log(`=== smoke:pr-draft (${dryRun ? 'dry-run' : 'live'}) ===`);

const checks = [
  ['.cursor/skills/pr-draft/SKILL.md', 'pr-draft skill'],
  ['skills/roles/pr-draft/SKILL.md', 'pr-draft role mirror'],
  ['docs/ops/mcp-pr-draft-flow.md', 'pr-draft flow doc'],
  ['.cursor/automations.example.json', 'automations example'],
];

for (const [rel, label] of checks) {
  const path = join(ROOT, rel);
  if (!existsSync(path)) throw new Error(`missing ${label}: ${rel}`);
  console.log(`✓ ${rel}`);
}

const auto = JSON.parse(readFileSync(join(ROOT, '.cursor/automations.example.json'), 'utf8'));
const hasPrDraft = JSON.stringify(auto).includes('pr-draft');
if (!hasPrDraft) throw new Error('automations.example.json missing pr-draft entry');

const skill = readFileSync(join(ROOT, '.cursor/skills/pr-draft/SKILL.md'), 'utf8');
if (!skill.includes('disable-model-invocation: true')) {
  throw new Error('pr-draft skill must set disable-model-invocation: true');
}

if (dryRun) {
  console.log('✓ dry-run: skill + docs + automation example OK (no gh/MCP write)');
} else {
  console.log('⚠ live mode: gh/MCP not invoked in smoke — use manual @pr-draft session');
}

console.log('\n✓ smoke:pr-draft passed');
