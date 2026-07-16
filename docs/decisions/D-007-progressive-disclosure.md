# D-007 · 渐进披露 L0→L3

> status: binding



- **日期**：2026-07-10 · Round 1
- **问题**：Agent 上下文雪球？
- **决策**：默认只读 L0–L1；复杂任务才进 Harness L2–L3；navigator 模式读 INDEX ≤6KB。
- **理由**：渐进披露 + 上下文预算防止 Agent 上下文雪球；navigator 模式仅读 INDEX 导航。
- **影响**：`docs/harness/README.md`、`harness/context-budget.yaml`
- **锚点**：`harness/context-budget.yaml`

