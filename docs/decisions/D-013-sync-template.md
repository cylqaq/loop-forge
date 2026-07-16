# D-013 · sync-template 母版同步

> status: binding



- **日期**：2026-07-10 · Round 4
- **问题**：母版 harness 演进后子模板如何跟上？
- **决策**：`pnpm loop sync-template` 按 `harness/templates/sync-manifest.yaml` 同步到 `projects/_template/`。
- **理由**：单一真相源在母版；manifest 可版本化、可 smoke。
- **影响**：`sync-template.mjs`、`smoke-sync-template.mjs`
- **锚点**：`harness/templates/sync-manifest.yaml`

