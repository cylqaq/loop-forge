# Loop Forge · 决策记录

> **仅追加**。每条决策标 D-NNN、日期、轮次。推翻旧决策须显式追加「超越 D-XXX」条目并保留历史。

---

## D-001 · Loop Engineering 作为核心架构

- **日期**：2026-07-10 · Round 1
- **问题**：如何统一沉淀 AI 协作智慧并孵化具体项目？
- **决策**：以 Loop Engineering 六大积木 + 五阶段外循环为母版核心架构；Harness Engineering 与 Context Engineering 作为下层支撑。
- **理由**：业界 2026 范式转移 — 从「提示 Agent」到「设计提示 Agent 的系统」。
- **影响**：所有目录与文档按六大积木组织；验证优先为铁律。
- **锚点**：`docs/ARCHITECTURE.md`、`docs/LOOP_ENGINEERING.md`

## D-002 · 母版与子项目分离

- **日期**：2026-07-10 · Round 1
- **问题**：如何避免母版被具体业务污染？
- **决策**：根仓库为母版；具体业务在 `projects/{id}/` 或复制到外部路径；子项目自包含 harness/skills/docs 副本。
- **理由**：母版与子项目职责分离是 Loop 模板可复用的前提；分层 AGENTS.md 降低上下文噪音。
- **影响**：母版不含业务 apps/；`projects/_template/` 为孵化起点。
- **锚点**：`docs/ops/root-project-protection.md`

## D-003 · 验证优先，禁止模型自评

- **日期**：2026-07-10 · Round 1
- **问题**：如何判断 Loop 迭代完成？
- **决策**：终止条件 = `pnpm verify` / 子项目自定义 verify 退出码 0；禁止 Agent 口头声明「已完成」。
- **理由**：Loop Engineering 核心原则「验证仍是你的责任」；机械化验收优于 Agent 自评。
- **影响**：`scripts/verify.mjs`、`hooks.json` beforeCommit。
- **锚点**：`AGENTS.md` NEVER 清单

## D-004 · 双 Harness（文档 + 执行）

- **日期**：2026-07-10 · Round 1
- **问题**：文档与可执行编排如何协同？
- **决策**：`docs/harness/` 管读序与地图；`harness/` 管 workflow/manifest/CLI/smoke。
- **理由**：文档 Harness 管语义与读序，执行 Harness 管可运行编排；分离后各层可独立演进。
- **影响**：五层联动契约；改一层查全表。
- **锚点**：`docs/harness/layer-sync-contract.md`

## D-005 · Maker-Checker 子代理分离

- **日期**：2026-07-10 · Round 1
- **问题**：如何避免 Agent 自评宽容？
- **决策**：Implementer 与 Reviewer 必须不同 Skill/会话；Reviewer 使用 `REVIEW_PROMPT.md` 对抗性清单。
- **理由**：Loop Engineering `/goal` 独立检查模型原理。
- **影响**：`.cursor/skills/subagents/reviewer/`、`REVIEW_PROMPT.md`
- **锚点**：`docs/LOOP_ENGINEERING.md` §子代理

## D-006 · 单窗口 CURRENT.md 迭代

- **日期**：2026-07-10 · Round 1
- **问题**：多份迭代计划文档易腐烂？
- **决策**：仅 `docs/upgrade-plans/CURRENT.md` 为活跃窗口；每轮收尾压缩为上轮摘要 + 下轮占位。
- **理由**：单活跃窗口避免多份计划文档腐烂；每轮强制压缩摘要形成外循环 Adjustment。
- **影响**：HANDOFF 与 loop-state 辅助，但以 CURRENT 为权威摘要。
- **锚点**：`docs/upgrade-plans/README.md`

## D-007 · 渐进披露 L0→L3

- **日期**：2026-07-10 · Round 1
- **问题**：Agent 上下文雪球？
- **决策**：默认只读 L0–L1；复杂任务才进 Harness L2–L3；navigator 模式读 INDEX ≤6KB。
- **理由**：渐进披露 + 上下文预算防止 Agent 上下文雪球；navigator 模式仅读 INDEX 导航。
- **影响**：`docs/harness/README.md`、`harness/context-budget.yaml`
- **锚点**：`harness/context-budget.yaml`

## D-008 · 状态文件不入库

- **日期**：2026-07-10 · Round 1
- **问题**：loop-state.json 是否版本控制？
- **决策**：`state/loop-state.json` gitignore；模板用 `harness/templates/loop-state.json.template`；轮次摘要写入 `CURRENT.md`。
- **理由**：运行时状态易冲突；轮次摘要以 CURRENT.md 为权威，模板用 `.template` 分发。
- **影响**：`.gitignore`、`harness/templates/`
- **锚点**：`state/.gitkeep`

## D-009 · Git 分支模型 main + develop + round/

- **日期**：2026-07-10 · Round 2
- **问题**：如何管理母版多轮迭代与稳定发布？
- **决策**：`main` 稳定、`develop` 集成、`round/N-*` 单轮特性分支。
- **理由**：对齐 Loop 多轮递进；稳定与实验分离。
- **影响**：`docs/ops/branch-strategy.md`；默认从 develop 开发。
- **锚点**：`docs/ops/branch-strategy.md`

## D-010 · 零 LLM 规则评审

- **日期**：2026-07-10 · Round 2
- **问题**：Reviewer 除跑 verify 外如何机械门禁？
- **决策**：`harness/review/rules/` + `pnpm loop review`，纳入 `pnpm verify`。
- **理由**：可重复、无 Token 消耗、可 CI 集成。
- **影响**：`harness/review/run-review.mjs`
- **锚点**：`harness/review/rules/README.md`

## D-011 · loop init 一键就绪

- **日期**：2026-07-10 · Round 3
- **问题**：子项目 init 后仍需手动 install/doctor？
- **决策**：`pnpm loop init` 默认 post-hook 执行 `npm install` + `doctor`；`--skip-install` 跳过。
- **理由**：降低孵化摩擦；验证仍由 doctor/verify 客观判定。
- **影响**：`harness/scripts/loop.mjs`、`smoke-init.mjs`
- **锚点**：`projects/_template/README.md`

## D-012 · skill-author 元技能

- **日期**：2026-07-10 · Round 3
- **问题**：如何标准化创建领域 Skill？
- **决策**：母版内置 `@skill-author` 元技能，遵循 agentskills.io + 渐进披露；`skills-structure` review 规则校验 frontmatter。
- **理由**：Skill 设计本身应是可复用 Loop 能力；description 即触发器。
- **影响**：`.cursor/skills/skill-author/`、`domain-web-app` 示例
- **锚点**：`.cursor/skills/skill-author/SKILL.md`

