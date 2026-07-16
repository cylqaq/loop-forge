# D-022 · 母版进入等待期（v0.7.0 可用即停）

> status: binding



- **日期**：2026-07-11 · Round 7 收尾
- **问题**：试验子项目（如外部 adopt 仓库）已可独立演进；母版是否继续绑定业务验证占位？
- **决策**：Round 7 完成后母版标记**等待期**；`CURRENT.md` 下轮占位改为「触发条件 + 重启模板」，不预设 Round 8 任务；具体业务迭代只在子项目；母版仅在学到新通用技能/架构时重启 Round。
- **理由**：母版职责是范式与 Harness 沉淀，非业务试验场；避免 CURRENT 被外部项目任务污染；复利来自稳定可用的模板而非持续 churn。
- **影响**：README/HANDOFF 区分等待期与活跃 Round；linkscope 等试验引用从占位文档移除（历史 D-019 决策保留）。
- **锚点**：`docs/upgrade-plans/CURRENT.md`、`docs/HANDOFF.md`

