# D-008 · 状态文件不入库

> status: binding



- **日期**：2026-07-10 · Round 1
- **问题**：loop-state.json 是否版本控制？
- **决策**：`state/loop-state.json` gitignore；模板用 `harness/templates/loop-state.json.template`；轮次摘要写入 `CURRENT.md`。
- **理由**：运行时状态易冲突；轮次摘要以 CURRENT.md 为权威，模板用 `.template` 分发。
- **影响**：`.gitignore`、`harness/templates/`
- **锚点**：`state/.gitkeep`

