---
name: project-scaffold
description: >-
  Scaffolds self-contained sub-projects from projects/_template via loop init
  or init --external. Use when creating projects, external repos, spawn, or
  scaffold-project workflow plan step.
---

# Project Scaffold Skill

> 架构 §7 · Phase 05 · workflow `scaffold-project` step `plan`

## BEFORE（必读）

1. `docs/ops/root-project-protection.md`
2. `docs/ops/external-project-lifecycle.md`
3. `docs/harness/execution/phases/05-scaffold.md`
4. `docs/ARCHITECTURE.md` §7

## 决策表

| 条件 | 命令 |
|------|------|
| 母版内试验 | `pnpm loop init projects/<id> <id>` |
| 独立仓库/生产（空目录） | `pnpm loop init --external <abs-path> <id> --git` |
| **已有业务仓库** | `pnpm loop adopt --external <abs-path> <id>` |
| CI 快速复制 | 加 `--skip-install` |

## Intent 产出

写入 `state/scaffold-plan.yaml`（本地，gitignore）：

```yaml
project_id: my-app
mode: external   # internal | external
target_path: e:/my-project/my-app
init_git: true
acceptance: npm run verify exit 0
```

## DURING

**本会话只规划** — 复制由 implementer 在下一步执行。

## AFTER

handoff → `@implementer` 执行 init。

## 验收

- `.loop-forge-origin.yaml` 存在
- 子项目 `npm run verify` exit 0

## NEVER

- 母版根目录创建 `apps/`
- `--external` 指向 `projects/` 内
