# D-005 · Maker-Checker 子代理分离

> status: binding



- **日期**：2026-07-10 · Round 1
- **问题**：如何避免 Agent 自评宽容？
- **决策**：Implementer 与 Reviewer 必须不同 Skill/会话；Reviewer 使用 `REVIEW_PROMPT.md` 对抗性清单。
- **理由**：Loop Engineering `/goal` 独立检查模型原理。
- **影响**：`.cursor/skills/subagents/reviewer/`、`REVIEW_PROMPT.md`
- **锚点**：`docs/LOOP_ENGINEERING.md` §子代理

