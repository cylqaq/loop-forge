# 新会话 Handoff

## 30 秒接力

1. 读 [`upgrade-plans/CURRENT.md`](./upgrade-plans/CURRENT.md)
2. 跑 `pnpm loop doctor`
3. 执行 CURRENT 的「下轮占位」

## 推荐开场 Prompt

```
我在 Loop Forge 母版项目（e:\my-project\loop-forge）。
请按 AGENTS.md 三件套顺序阅读，然后执行 CURRENT.md 的下轮占位。
约束：每步后跑 pnpm verify；禁止模型自评完成；一轮结束更新 CURRENT + DECISIONS。
```

## 从子项目接力

子项目内读**子项目** `AGENTS.md` + `docs/upgrade-plans/CURRENT.md`，不要回母版改业务。

## 状态文件

| 文件 | 用途 |
|------|------|
| `state/loop-state.json` | 运行时迭代计数（本地，gitignore） |
| `docs/upgrade-plans/CURRENT.md` | 权威轮次摘要 |
| `docs/DECISIONS.md` | 长期 WHY |

## 停止条件

- `pnpm verify` exit 0
- 或 `loop-state.status` = `blocked`（需人工）
- 或达 `max_iterations`（见 context-budget.yaml）
