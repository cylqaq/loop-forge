# D-026 · 项目 Capability Profile 受限适配验证 Gate

> status: binding

- **日期**：2026-08-28 · Round 10
- **问题**：真实叶子项目的能力并不一致：`app-demo` 使用 pnpm 且提供 smoke；`knowledge-base` 使用 npm；`stormeye-ai` 使用 pnpm 但没有 `smoke:all`。把 `pnpm`、review 或 smoke 硬编码到母版会造成错误的通过假象或无法执行。
- **决策**：每个项目以 `harness/project-capabilities.yaml` 声明 `package_manager`（仅 `npm` / `pnpm`）以及 `verify`、`review`、可选 `smoke_all`。执行器仅由该声明派生固定的 `run verify` / `run review` 命令；manifest 只能引用既有 allowlisted gate。
- **理由**：将跨项目差异显式化，并保留 D-024 的可执行迁移与最小权限边界。profile 不能指定可执行文件、参数、环境变量或 shell，因此不会把 YAML 变成任意命令入口。
- **影响**：模板、adopt overlay、doctor 与 verify 都要求 profile；项目必须提供 review runner，缺少 smoke 时标记为 false 而不是伪造脚本。决策冷文件仍按需加载，单条上限调整为 8KB 以容纳可复核的领域 ADR；以 golden smoke 验证 npm profile 的 gate 解析。
- **锚点**：`harness/project-capabilities.yaml`、`harness/scripts/loop-lib.mjs`、`harness/scripts/smoke-project-capabilities.mjs`
