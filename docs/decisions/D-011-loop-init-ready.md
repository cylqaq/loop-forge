# D-011 · loop init 一键就绪

> status: binding



- **日期**：2026-07-10 · Round 3
- **问题**：子项目 init 后仍需手动 install/doctor？
- **决策**：`pnpm loop init` 默认 post-hook 执行 `npm install` + `doctor`；`--skip-install` 跳过。
- **理由**：降低孵化摩擦；验证仍由 doctor/verify 客观判定。
- **影响**：`harness/scripts/loop.mjs`、`smoke-init.mjs`
- **锚点**：`projects/_template/README.md`

