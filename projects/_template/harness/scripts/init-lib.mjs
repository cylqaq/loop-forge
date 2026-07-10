/**
 * Project scaffold/init — 架构 §7 子项目孵化模型
 */
import {
  readFileSync,
  writeFileSync,
  existsSync,
  mkdirSync,
  cpSync,
  readdirSync,
} from 'node:fs';
import { join, resolve, relative, isAbsolute } from 'node:path';
import { execSync } from 'node:child_process';

export function parseInitArgs(args, root) {
  const external = args.includes('--external');
  const skipInstall = args.includes('--skip-install');
  const initGit = args.includes('--git');
  const positional = args.filter((a) => !a.startsWith('--'));

  let dest;
  let id;

  if (external) {
    if (positional.length < 1) {
      throw new Error('Usage: loop init --external <path> [id] [--git] [--skip-install]');
    }
    dest = resolve(positional[0]);
    id = positional[1] || dest.split(/[/\\]/).filter(Boolean).pop() || 'my-project';
  } else {
    const target = positional[0] || 'projects/my-project';
    dest = isAbsolute(target) ? resolve(target) : join(root, target);
    id = positional[1] || target.split(/[/\\]/).filter(Boolean).pop() || 'my-project';
  }

  return { dest, id, external, skipInstall, initGit };
}

export function validateInitPath(dest, root, external) {
  const rootNorm = resolve(root);
  const destNorm = resolve(dest);

  if (destNorm === rootNorm) {
    throw new Error('Cannot init into mother repo root');
  }

  if (external) {
    const projectsDir = join(rootNorm, 'projects');
    const rel = relative(projectsDir, destNorm);
    if (rel && !rel.startsWith('..') && !isAbsolute(rel)) {
      throw new Error(
        'External path must be outside loop-forge/projects/. Internal: loop init projects/<id> <id>'
      );
    }
  }

  if (existsSync(join(destNorm, 'project.yaml'))) {
    throw new Error(`Target already scaffolded (project.yaml exists): ${destNorm}`);
  }

  if (existsSync(destNorm)) {
    const entries = readdirSync(destNorm).filter((e) => e !== '.git');
    if (entries.length > 0) {
      throw new Error(`Target directory not empty: ${destNorm}`);
    }
  }
}

export function applyProjectMetadata(dest, id) {
  const projYaml = join(dest, 'project.yaml');
  if (!existsSync(projYaml)) return;

  let y = readFileSync(projYaml, 'utf8');
  y = y.replace(/^id:.*$/m, `id: ${id}`);
  const name = id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
  y = y.replace(/^name:.*$/m, `name: ${name}`);
  if (/^scaffolded_from:/m.test(y)) {
    y = y.replace(/^scaffolded_from:.*$/m, 'scaffolded_from: loop-forge');
  }
  writeFileSync(projYaml, y);

  const pkgPath = join(dest, 'package.json');
  if (existsSync(pkgPath)) {
    let pkg = readFileSync(pkgPath, 'utf8');
    pkg = pkg.replace('"{{project-id}}"', `"${id}"`);
    writeFileSync(pkgPath, pkg);
  }
}

export function writeOriginMarker(dest, root, id, external) {
  const marker = join(dest, '.loop-forge-origin.yaml');
  const content = `# Loop Forge 孵化标记
mother_repo: ${root.replace(/\\/g, '/')}
project_id: ${id}
external: ${external}
scaffolded_at: ${new Date().toISOString()}
template_path: projects/_template
`;
  writeFileSync(marker, content);
}

export function runInit({ dest, id, root, template, skipInstall, initGit, external }) {
  validateInitPath(dest, root, external);

  if (!existsSync(dest)) {
    mkdirSync(dest, { recursive: true });
  }

  cpSync(template, dest, { recursive: true });
  applyProjectMetadata(dest, id);
  writeOriginMarker(dest, root, id, external);

  if (initGit) {
    execSync('git init', { cwd: dest, stdio: 'pipe' });
    console.log('✓ git init');
  }

  console.log(`Scaffolded to ${dest}`);
  console.log(`  id: ${id}`);
  console.log(`  external: ${external}`);

  if (!skipInstall) {
    console.log('\n=== Post-init: npm install ===');
    execSync('npm install', { cwd: dest, stdio: 'inherit' });
    console.log('\n=== Post-init: doctor ===');
    execSync('node harness/scripts/loop.mjs doctor', { cwd: dest, stdio: 'inherit' });
    console.log('\n=== Post-init OK ===');
  } else {
    console.log('Skipped install (--skip-install)');
  }

  return { dest, id, external };
}
