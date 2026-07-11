/**
 * Adopt existing repo into Loop Engineering — overlay harness, preserve business code
 * 架构 §7 扩展 · D-019
 */
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  cpSync,
  readdirSync,
  statSync,
} from 'node:fs';
import { join, resolve, relative, isAbsolute } from 'node:path';
import { execSync } from 'node:child_process';

const OVERLAY_DIRS = [
  'harness/workflows',
  'harness/manifests',
  'harness/templates',
  'docs/harness',
  '.cursor/skills/subagents',
];

const OVERLAY_FILES = [
  'harness/scripts/loop.mjs',
  'harness/scripts/loop-lib.mjs',
  'harness/context-budget.yaml',
  'scripts/verify-loop.mjs',
  'scripts/before-start.mjs',
];

const COPY_IF_MISSING = ['INDEX.yaml', 'project.yaml', '.cursor/mcp.json.template'];

const NEVER_OVERWRITE = new Set([
  'AGENTS.md',
  'README.md',
  'package.json',
  'pnpm-lock.yaml',
  'docs/ARCHITECTURE.md',
  'docs/DECISIONS.md',
]);

export function parseAdoptArgs(args, root) {
  const force = args.includes('--force');
  const skipInstall = args.includes('--skip-install');
  const positional = args.filter((a) => !a.startsWith('--'));

  if (positional.length < 1) {
    throw new Error('Usage: loop adopt --external <path> [id] [--force] [--skip-install]');
  }

  const dest = resolve(positional[0]);
  const id = positional[1] || dest.split(/[/\\]/).filter(Boolean).pop() || 'my-project';

  return { dest, id, force, skipInstall };
}

export function validateAdoptPath(dest, root, force) {
  const rootNorm = resolve(root);
  const destNorm = resolve(dest);

  if (!existsSync(destNorm)) {
    throw new Error(`Target path does not exist: ${destNorm}`);
  }

  const projectsDir = join(rootNorm, 'projects');
  const rel = relative(projectsDir, destNorm);
  if (rel && !rel.startsWith('..') && !isAbsolute(rel)) {
    throw new Error('Adopt path must be outside loop-forge/projects/. Use loop init for internal.');
  }

  const entries = readdirSync(destNorm).filter((e) => e !== '.git');
  if (entries.length === 0) {
    throw new Error(`Target is empty — use loop init instead: ${destNorm}`);
  }

  const origin = join(destNorm, '.loop-forge-origin.yaml');
  if (existsSync(origin) && !force) {
    throw new Error(`Already adopted (.loop-forge-origin.yaml exists). Use --force to re-overlay.`);
  }
}

function shouldPreserveDest(destRoot, destPath) {
  const rel = relative(destRoot, destPath).replace(/\\/g, '/');
  if (NEVER_OVERWRITE.has(rel)) return true;
  const base = rel.split('/').pop();
  return NEVER_OVERWRITE.has(base);
}

function copyDir(src, dest, destRoot, force) {
  if (!existsSync(src)) return;
  mkdirSync(dest, { recursive: true });
  for (const name of readdirSync(src)) {
    const s = join(src, name);
    const d = join(dest, name);
    if (statSync(s).isDirectory()) {
      copyDir(s, d, destRoot, force);
    } else if (!shouldPreserveDest(destRoot, d) && (force || !existsSync(d))) {
      mkdirSync(join(d, '..'), { recursive: true });
      cpSync(s, d);
    }
  }
}

function copyFile(src, dest, destRoot, force) {
  if (!existsSync(src)) return;
  if (shouldPreserveDest(destRoot, dest)) return;
  if (!force && existsSync(dest)) return;
  mkdirSync(join(dest, '..'), { recursive: true });
  cpSync(src, dest);
}

function applyProjectYaml(dest, id) {
  const path = join(dest, 'project.yaml');
  if (!existsSync(path)) {
    writeFileSync(
      path,
      `id: ${id}\nname: ${id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}\nscaffolded_from: loop-forge\nadopted: true\nversion: 0.1.0\n`
    );
    return;
  }
  let y = readFileSync(path, 'utf8');
  if (!/^adopted:/m.test(y)) y += '\nadopted: true\n';
  if (!/^id:/m.test(y)) y = `id: ${id}\n${y}`;
  writeFileSync(path, y);
}

function mergePackageJson(dest) {
  const path = join(dest, 'package.json');
  if (!existsSync(path)) return;

  const pkg = JSON.parse(readFileSync(path, 'utf8'));
  pkg.scripts = pkg.scripts || {};
  if (!pkg.scripts.loop) pkg.scripts.loop = 'node harness/scripts/loop.mjs';
  if (!pkg.scripts.doctor) pkg.scripts.doctor = 'node harness/scripts/loop.mjs doctor';
  if (!pkg.scripts['verify:loop']) pkg.scripts['verify:loop'] = 'node scripts/verify-loop.mjs';

  const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };
  if (!deps.yaml) {
    if (pkg.devDependencies) pkg.devDependencies.yaml = '^2.8.0';
    else {
      pkg.devDependencies = pkg.devDependencies || {};
      pkg.devDependencies.yaml = '^2.8.0';
    }
  }

  writeFileSync(path, `${JSON.stringify(pkg, null, 2)}\n`);
}

function migrateLoopState(dest) {
  const legacy = join(dest, 'scripts/loop-state.json');
  const stateDir = join(dest, 'state');
  const target = join(stateDir, 'loop-state.json');
  mkdirSync(stateDir, { recursive: true });

  const template = join(dest, 'harness/templates/loop-state.json.template');
  let state;
  if (existsSync(target)) {
    state = JSON.parse(readFileSync(target, 'utf8'));
  } else if (existsSync(legacy)) {
    const legacyState = JSON.parse(readFileSync(legacy, 'utf8'));
    state = existsSync(template)
      ? JSON.parse(readFileSync(template, 'utf8'))
      : { handoff: { workflow: 'round-cycle', stepIndex: 0, activeSkill: null } };
    state.history = [...(legacyState.history || []), ...(state.history || [])];
    state.goal = legacyState.goal || state.goal || '';
    state.currentIteration = legacyState.currentIteration ?? state.currentIteration ?? 0;
  } else if (existsSync(template)) {
    state = JSON.parse(readFileSync(template, 'utf8'));
  } else {
    state = {
      currentRound: 1,
      currentIteration: 0,
      maxIterations: 10,
      status: 'idle',
      goal: '',
      consecutiveVerifyFail: 0,
      history: [],
      handoff: { workflow: 'round-cycle', stepIndex: 0, activeSkill: null },
    };
  }

  if (!state.handoff) {
    state.handoff = { workflow: 'round-cycle', stepIndex: 0, activeSkill: null };
  }
  state.lastUpdated = new Date().toISOString();
  writeFileSync(target, JSON.stringify(state, null, 2));

  if (!existsSync(join(stateDir, '.gitkeep'))) {
    writeFileSync(join(stateDir, '.gitkeep'), '');
  }
}

export function writeAdoptMarker(dest, root, id) {
  const marker = join(dest, '.loop-forge-origin.yaml');
  const content = `# Loop Forge 孵化标记（adopt 模式）
mother_repo: ${root.replace(/\\/g, '/')}
project_id: ${id}
external: true
adopted: true
scaffolded_at: ${new Date().toISOString()}
template_path: projects/_template
mode: adopt
`;
  writeFileSync(marker, content);
}

export function runAdopt({ dest, id, root, template, skipInstall, force }) {
  validateAdoptPath(dest, root, force);

  console.log(`Adopting ${dest} as Loop Engineering sub-project (${id})`);

  for (const dir of OVERLAY_DIRS) {
    copyDir(join(template, dir), join(dest, dir), dest, force);
    console.log(`  ✓ ${dir}/`);
  }

  for (const file of OVERLAY_FILES) {
    copyFile(join(template, file), join(dest, file), dest, force);
    console.log(`  ✓ ${file}`);
  }

  for (const file of COPY_IF_MISSING) {
    const target = join(dest, file);
    if (!existsSync(target)) {
      copyFile(join(template, file), target, dest, true);
      console.log(`  + ${file} (new)`);
    }
  }

  applyProjectYaml(dest, id);
  mergePackageJson(dest);
  migrateLoopState(dest);
  writeAdoptMarker(dest, root, id);

  console.log('\n=== Post-adopt ===');
  if (!skipInstall) {
    const pkg = join(dest, 'package.json');
    if (existsSync(pkg)) {
      const pm = existsSync(join(dest, 'pnpm-lock.yaml')) ? 'pnpm install' : 'npm install';
      console.log(`Running ${pm}...`);
      execSync(pm, { cwd: dest, stdio: 'inherit' });
    }
    execSync('node harness/scripts/loop.mjs doctor', { cwd: dest, stdio: 'inherit' });
    console.log('\n=== Post-adopt OK ===');
  } else {
    console.log('Skipped install (--skip-install)');
  }

  console.log(`
Next steps (in sub-project):
  1. Edit AGENTS.md domain rules + docs/upgrade-plans/CURRENT.md
  2. Merge verify: append verify:loop to your verify script
  3. Copy .cursor/mcp.json.template → .cursor/mcp.json if needed
  4. pnpm loop next  — start round-cycle
`);

  return { dest, id, adopted: true };
}
