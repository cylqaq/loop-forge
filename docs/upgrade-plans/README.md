# 迭代计划

## 流程

每轮 Loop 遵循：

1. **开始**：读 `CURRENT.md` 下轮占位 → Intent
2. **执行**：按占位实现 → Action
3. **验证**：`pnpm verify` + `pnpm smoke:all` → Observation
4. **收尾**：
   - 压缩 `CURRENT.md` 为上轮摘要 + **新**下轮占位
   - 新原则 → `docs/decisions/D-NNN-*.md` + 热账本一行
   - 更新 `state/loop-state.json`（本地）

## 单窗口原则

- 仅 **`CURRENT.md`** 为活跃迭代文档
- **等待期**：下轮占位保留结构（触发条件 + 验收标准），但不预设具体 Round 任务
- 历史轮次摘要保留在 CURRENT 底部「历史」区（最近 3–6 轮）
- 更长历史见 git log

## 命名

- 轮次：**Round N**（与 loop-state.currentRound 对齐）
- 决策：**D-NNN**（全局递增，不重置）
