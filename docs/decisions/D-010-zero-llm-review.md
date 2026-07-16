# D-010 · 零 LLM 规则评审

> status: binding



- **日期**：2026-07-10 · Round 2
- **问题**：Reviewer 除跑 verify 外如何机械门禁？
- **决策**：`harness/review/rules/` + `pnpm loop review`，纳入 `pnpm verify`。
- **理由**：可重复、无 Token 消耗、可 CI 集成。
- **影响**：`harness/review/run-review.mjs`
- **锚点**：`harness/review/rules/README.md`

