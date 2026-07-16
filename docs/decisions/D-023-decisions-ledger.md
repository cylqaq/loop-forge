# D-023 · 决策热账本 + 冷 ADR（Decision Ledger）

> status: binding

- **日期**：2026-07-16 · Round 8
- **问题**：`docs/DECISIONS.md` 仅追加会无限膨胀；子项目已出现大文件编码损坏；Agent 默认整文件读入导致上下文雪球。
- **决策**：决策记忆拆为热冷两层——`docs/DECISIONS.md` 为热账本（活跃约束索引，硬顶 ≤8KB，Agent 默认只读）；`docs/decisions/D-NNN-*.md` 为冷 ADR（完整条目，仅追加正文，按需加载）。超越旧决策须新 D 并更新热表状态，禁止静默改写冷文件历史正文。
- **理由**：对齐 D-006（单窗口压缩）与 D-007（渐进披露）；热路径控体积解决编码/上下文问题；冷路径保留审计完整性；入口路径不变，不破坏 verify/adopt/AGENTS 触点。
- **影响**：`context-budget.yaml` `decisions.*`；review 规则 `decisions-ledger`；模板与文档读序；Adjustment 追加协议改为「冷文件 + 热表一行」。
- **锚点**：`docs/DECISIONS.md`、`docs/decisions/`、`harness/review/rules/decisions-ledger.mjs`、`harness/context-budget.yaml`
