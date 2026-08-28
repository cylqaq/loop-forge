# D-025 · 控制层与披露层使用不同命名空间

> status: binding

- **日期**：2026-08-27 · Round 9
- **问题**：原有“L0–L5 五层契约”实际包含六层，且与渐进披露的 L0–L3 复用同一编号，导致人和 Agent 难以判断上下文。
- **决策**：控制契约统一命名为 `C0–C5`（INDEX、Skill、Workflow、Manifest、执行文档、架构）；渐进披露统一命名为 `D0–D3`（入口、门户、目录、长文）。旧文档中的 L 编号仅作历史语境，不新增使用。
- **理由**：控制面与阅读面是正交关系；命名分离使 contract test、架构评审与项目扩展更清晰。
- **影响**：`ARCHITECTURE.md`、`layer-sync-contract.md`、读序和模板文档；不改变目录、CLI 或兼容路径。
- **锚点**：`docs/ARCHITECTURE.md` §4–5、`docs/harness/layer-sync-contract.md`
