# D-004 · 双 Harness（文档 + 执行）

> status: binding



- **日期**：2026-07-10 · Round 1
- **问题**：文档与可执行编排如何协同？
- **决策**：`docs/harness/` 管读序与地图；`harness/` 管 workflow/manifest/CLI/smoke。
- **理由**：文档 Harness 管语义与读序，执行 Harness 管可运行编排；分离后各层可独立演进。
- **影响**：五层联动契约；改一层查全表。
- **锚点**：`docs/harness/layer-sync-contract.md`

