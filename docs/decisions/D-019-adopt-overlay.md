# D-019 · adopt 现有仓库（overlay 模式）

> status: binding



- **日期**：2026-07-10 · Round 6
- **问题**：`loop init` 要求空目录，无法改造已有业务仓库（如 linkscope-2）？
- **决策**：新增 `pnpm loop adopt --external <path> [id]`：从 `_template` overlay harness/skills/docs-harness，**不覆盖** AGENTS.md、package.json、业务 docs；写入 `.loop-forge-origin.yaml`（`mode: adopt`）。
- **理由**：Loop Engineering 改造对象是架构体系；业务代码由子项目 self-loop 迭代。
- **影响**：`harness/scripts/adopt-lib.mjs`、`smoke-adopt.mjs`、子项目 `verify-loop.mjs`、模板 `loop.mjs` 精简
- **锚点**：`docs/ops/external-project-lifecycle.md` §adopt、`docs/ARCHITECTURE.md` §7

