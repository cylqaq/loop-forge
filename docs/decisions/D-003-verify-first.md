# D-003 · 验证优先，禁止模型自评

> status: binding



- **日期**：2026-07-10 · Round 1
- **问题**：如何判断 Loop 迭代完成？
- **决策**：终止条件 = `pnpm verify` / 子项目自定义 verify 退出码 0；禁止 Agent 口头声明「已完成」。
- **理由**：Loop Engineering 核心原则「验证仍是你的责任」；机械化验收优于 Agent 自评。
- **影响**：`scripts/verify.mjs`、`hooks.json` beforeCommit。
- **锚点**：`AGENTS.md` NEVER 清单

