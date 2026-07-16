# D-017 · 阶段 3 PR Draft 半自动 + 人工 merge

> status: binding



- **日期**：2026-07-10 · Round 5
- **问题**：verify 通过后如何安全进入 MCP 写操作？
- **决策**：`@pr-draft` Skill（`disable-model-invocation: true`）+ 8 步编排；须 Reviewer APPROVED + 用户显式批准 push；禁止自动 merge。
- **理由**：架构 §9 阶段 2→3 过渡；Maker-Checker 与最小写权限。
- **影响**：`.cursor/skills/pr-draft/`、`docs/ops/mcp-pr-draft-flow.md`
- **锚点**：`docs/ARCHITECTURE.md` §9

