# D-015 · 双模式 init（内部 / 外部）

> status: binding



- **日期**：2026-07-10 · Round 5
- **问题**：子项目是否必须落在母版 `projects/` 下？
- **决策**：`loop init` 支持 `--external <abs-path>`；外部路径禁止在 `projects/` 内；写入 `.loop-forge-origin.yaml` 追溯母版。
- **理由**：独立 Git 仓库与母版解耦；架构 §7 双模式孵化。
- **影响**：`harness/scripts/init-lib.mjs`、`smoke-external-init.mjs`、`docs/ops/external-project-lifecycle.md`
- **锚点**：`docs/ARCHITECTURE.md` §7

