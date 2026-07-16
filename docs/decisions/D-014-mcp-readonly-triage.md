# D-014 · MCP 只读 Triage 为阶段 1 默认 Loop

> status: binding



- **日期**：2026-07-10 · Round 4
- **问题**：Connectors 如何安全落地？
- **决策**：首个 MCP Loop 为只读 Triage（`@daily-triage`）；Token 在 `.env`；写操作阶段 3+ 须审批。
- **理由**：Loop Engineering 自主阶梯从阶段 1 开始；最小权限。
- **影响**：`docs/ops/mcp-github-triage.md`、`.cursor/automations.example.json`
- **锚点**：`docs/MCP_INTEGRATION.md`

