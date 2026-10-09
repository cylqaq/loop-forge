# D-027 · 裸仓库 adopt 引导

> status: binding

- **日期**：2026-10-09 · Round 11
- **问题**：只有 README 的已有 Git 仓库运行 `loop adopt` 时，Harness 已复制，但无 `package.json`，doctor 因缺少 `yaml` 失败；原有 overlay 也未补齐子项目文档入口。
- **决策**：adopt 在目标缺少 `package.json` 时生成最小可执行包清单；仅在文件不存在时补齐 AGENTS、文档入口、架构、决策账本、CURRENT、gitignore、verify 脚本和本地技能。已有业务文档与包清单继续保留并按需合并脚本。
- **理由**：使已有空白仓库也能完成自包含孵化，同时维护“不覆盖已有业务”的契约。
- **影响**：新增裸仓库 smoke；`--skip-install` 仍只跳过安装与 doctor，运行前须安装依赖。
- **锚点**：`harness/scripts/adopt-lib.mjs`、`harness/scripts/smoke-adopt.mjs`。
