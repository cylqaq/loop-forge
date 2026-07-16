# D-002 · 母版与子项目分离

> status: binding



- **日期**：2026-07-10 · Round 1
- **问题**：如何避免母版被具体业务污染？
- **决策**：根仓库为母版；具体业务在 `projects/{id}/` 或复制到外部路径；子项目自包含 harness/skills/docs 副本。
- **理由**：母版与子项目职责分离是 Loop 模板可复用的前提；分层 AGENTS.md 降低上下文噪音。
- **影响**：母版不含业务 apps/；`projects/_template/` 为孵化起点。
- **锚点**：`docs/ops/root-project-protection.md`

