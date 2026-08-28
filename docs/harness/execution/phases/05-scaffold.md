# Phase 05 · Scaffold（子项目孵化）

> 架构 §7 · workflow `scaffold-project` · 自主阶段 2（草稿）

## 目标

从 `projects/_template` 孵化**自包含**子项目，支持：

| 模式 | 命令 | 路径约束 |
|------|------|---------|
| **内部** | `pnpm loop init projects/<id> <id>` | 母版 `projects/` 下 |
| **外部** | `pnpm loop init --external <abs-path> <id> [--git]` | **必须**在 `projects/` 外 |

## 五阶段映射

| Phase | 步骤 | Skill |
|-------|------|-------|
| 00 Intent | plan | project-scaffold |
| 02 Action | copy | implementer |
| 03 Observation | verify | tester |
| 03 Observation | review | reviewer |
| 04 Adjustment | adjust | loop-orchestrator |

## Intent 检查清单

- [ ] 项目 `id`（kebab-case）
- [ ] 内部 vs 外部路径（见 `external-project-lifecycle.md`）
- [ ] 是否 `--git` 初始化
- [ ] 领域铁律将写入子项目 `AGENTS.md`
- [ ] 验收命令：`npm run verify`（子项目根）

## Action 命令

```bash
# 内部（母版 projects/ 下，不入库母版 git）
pnpm loop init projects/my-app my-app

# 外部（独立目录，推荐 e:/my-project/）
pnpm loop init --external e:/my-project/my-app my-app --git

# 跳过 install（CI 用）
pnpm loop init --external ../standalone standalone --skip-install
```

## 产出物（必须存在）

| 文件 | 用途 |
|------|------|
| `.loop-forge-origin.yaml` | 母版追溯标记 |
| `project.yaml` | id/name 元数据 |
| `AGENTS.md` | 子项目 L0 铁律 |
| `harness/` | 执行 Harness 副本 |

## Observation

```bash
cd <target_root>
npm run verify
node harness/scripts/loop.mjs doctor
```

**禁止模型自评** — 以退出码为准。

若通过 workflow 接力孵化，先绑定目标根目录；执行器会在 copy/verify 步骤运行受控 gate，并在 verify 后检查必备产物：

```bash
pnpm loop workflow use scaffold-project --target-root <target_root>
```

## Adjustment

1. 子项目 `docs/upgrade-plans/CURRENT.md` 写下轮占位
2. 母版不回写业务代码；通用 harness 改进走 `pnpm loop sync-template` + PR

## NEVER

- 在母版根目录创建 `apps/`
- 外部 init 到 `projects/` 内（用内部 init）
- 删除 `.loop-forge-origin.yaml`
