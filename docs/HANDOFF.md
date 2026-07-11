# 新会话 Handoff

## 30 秒接力

1. 读 [`upgrade-plans/CURRENT.md`](./upgrade-plans/CURRENT.md)
2. 跑 `pnpm loop doctor`
3. 若 CURRENT 为**等待期**：仅维护/答疑，不主动开新 Round；若有新占位则执行

## 推荐开场 Prompt（等待期）

```
我在 Loop Forge 母版项目（e:\my-project\loop-forge）。
请按 AGENTS.md 三件套顺序阅读 CURRENT.md。
当前为等待期：除非 CURRENT 下轮占位已更新为活跃 Round，否则只做答疑与小修复，改完须 pnpm verify。
```

## 推荐开场 Prompt（活跃 Round）

```
我在 Loop Forge 母版项目（e:\my-project\loop-forge）。
请按 AGENTS.md 三件套顺序阅读，然后执行 CURRENT.md 的下轮占位。
约束：每步后跑 pnpm verify；禁止模型自评完成；一轮结束更新 CURRENT + DECISIONS。
```

## 从子项目接力

子项目内读**子项目** `AGENTS.md` + `docs/upgrade-plans/CURRENT.md`，不要回母版改业务。

```
我在 <子项目名> 子项目（e:\my-project\<id>）。
先读 AGENTS.md 三件套，再读 CURRENT.md 下轮占位。
约束：pnpm verify 通过才算完成；Implementer/Reviewer 分离。
```

## 外部孵化 vs 现有项目 adopt

| 场景 | 命令 | 目录要求 |
|------|------|---------|
| 空目录新项目 | `pnpm loop init --external <path> <id> --git` | 空（仅 .git 可） |
| **已有业务仓库** | `pnpm loop adopt --external <path> <id>` | 非空，保留业务代码 |

```powershell
cd e:\my-project\loop-forge
pnpm loop sync-template
pnpm loop init --external e:\my-project\my-app my-app --git
# 或已有仓库：
pnpm loop adopt --external e:\my-project\my-app my-app
```

## Smoke 子命令

```bash
pnpm smoke:all          # 全链
pnpm smoke:external     # external init
pnpm smoke:adopt        # adopt overlay
pnpm smoke:pr-draft     # 阶段 3 资产 dry-run
pnpm smoke:scaffold     # scaffold-project v2
pnpm smoke:cloud-loop   # L4 SDK dry-run
```

## 五层联动

改 Skill / workflow / manifest / 文档任意一层 → 对照 [`harness/layer-sync-contract.md`](./harness/layer-sync-contract.md) 检查表。

## 状态文件

| 文件 | 用途 |
|------|------|
| `state/loop-state.json` | 运行时迭代计数（本地，gitignore） |
| `docs/upgrade-plans/CURRENT.md` | 权威轮次摘要 |
| `docs/DECISIONS.md` | 长期 WHY |
| `.loop-forge-origin.yaml` | 子项目追溯母版 |

## 停止条件

- `pnpm verify` exit 0
- 或 `loop-state.status` = `blocked`（需人工）
- 或达 `max_iterations`（见 context-budget.yaml）
