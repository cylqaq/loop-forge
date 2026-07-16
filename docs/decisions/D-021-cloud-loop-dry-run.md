# D-021 · L4 cloud-loop dry-run 默认

> status: binding



- **日期**：2026-07-11 · Round 7
- **问题**：L4 SDK 如何在 verify 链中落地而不强制 API Key？
- **决策**：`scripts/cloud-loop.mjs` dry-run 为默认（读 CURRENT + exit 0）；live 需 `LOOP_CLOUD_ENABLED=true` + `CURSOR_API_KEY`；`@cursor/sdk` 为 optionalDependency。
- **理由**：验证优先不变；CI 可 manual dispatch dry-run；live 由用户显式启用。
- **影响**：`loop-cloud.yml`、`smoke-cloud-loop.mjs`、`context-budget.yaml` cloud_loop
- **锚点**：`docs/ops/cursor-sdk.md` §7

