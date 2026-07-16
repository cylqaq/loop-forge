# D-016 · scaffold-project workflow v2（四步）

> status: binding



- **日期**：2026-07-10 · Round 5
- **问题**：单 manifest 无法表达 plan/exec/close 三阶段语义？
- **决策**：workflow 四步 plan→copy→verify→adjust；manifest 拆为 `scaffold-plan` / `scaffold-exec` / `scaffold-close`；原 `scaffold.yaml` 标记 DEPRECATED 保留兼容。
- **理由**：五层契约 L2/L3 解耦；每步 skill/manifest 可独立演进与 smoke。
- **影响**：`harness/workflows/scaffold-project.yaml`、`smoke-scaffold-project.mjs`、`docs/harness/execution/phases/05-scaffold.md`
- **锚点**：`docs/harness/layer-sync-contract.md`

