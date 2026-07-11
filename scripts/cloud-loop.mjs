#!/usr/bin/env node
/**
 * L4 Cloud Loop — 读取 CURRENT 下轮占位，驱动单次 SDK 迭代（或 dry-run）
 * 见 docs/ops/cursor-sdk.md
 */
import { readFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const CURRENT = join(ROOT, 'docs/upgrade-plans/CURRENT.md');

const dryRun =
  process.argv.includes('--dry-run') ||
  process.env.LOOP_CLOUD_ENABLED !== 'true' ||
  !process.env.CURSOR_API_KEY;

function extractNextSection(md) {
  const start = md.indexOf('## 下轮占位');
  if (start < 0) return '(no 下轮占位 section found)';
  const rest = md.slice(start);
  const end = rest.indexOf('\n---', 10);
  return end > 0 ? rest.slice(0, end).trim() : rest.trim();
}

function runVerify() {
  execSync('pnpm verify', { cwd: ROOT, stdio: 'inherit' });
}

async function runLive() {
  let Agent;
  try {
    ({ Agent } = await import('@cursor/sdk'));
  } catch {
    console.error('Missing @cursor/sdk. Install: pnpm add -D @cursor/sdk');
    process.exit(1);
  }

  const section = extractNextSection(readFileSync(CURRENT, 'utf8'));
  const prompt = `Read docs/upgrade-plans/CURRENT.md and execute ONE item from 下轮占位.
Constraints: minimal diff; run pnpm verify; do not self-declare done without verify exit 0.
Current placeholder:
${section}`;

  console.log('=== cloud-loop LIVE ===');
  console.log('Model:', process.env.CURSOR_AGENT_MODEL || 'composer-2.5-fast');

  const result = await Agent.prompt(prompt, {
    apiKey: process.env.CURSOR_API_KEY,
    model: { id: process.env.CURSOR_AGENT_MODEL || 'composer-2.5-fast' },
    local: { cwd: ROOT },
  });

  console.log('Agent status:', result.status);
  if (result.result) console.log(String(result.result).slice(0, 2000));

  console.log('\n=== post-agent verify ===');
  runVerify();
}

async function main() {
  if (!existsSync(CURRENT)) {
    console.error('Missing CURRENT.md');
    process.exit(1);
  }

  const section = extractNextSection(readFileSync(CURRENT, 'utf8'));
  console.log('=== cloud-loop ===');
  console.log('Mode:', dryRun ? 'dry-run' : 'live');
  console.log('\n--- CURRENT 下轮占位 ---\n');
  console.log(section);
  console.log('\n--- end ---\n');

  if (dryRun) {
    console.log('Dry-run OK. Set LOOP_CLOUD_ENABLED=true + CURSOR_API_KEY for live SDK run.');
    process.exit(0);
  }

  await runLive();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
