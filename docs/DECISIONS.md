# Loop Forge · 决策账本（热路径）

> **Agent 默认只读本文件**（硬顶 ≤8KB，见 `context-budget.yaml` `decisions`）。  
> 完整 ADR 在 [`docs/decisions/`](./decisions/)（冷路径，按需打开单条）。  
> **冷文件正文仅追加**；超越须新 D 并更新本表状态，禁止静默改写历史。

## 追加协议

1. 新建 `docs/decisions/D-NNN-slug.md`（完整问题/决策/理由/影响/锚点）
2. 在下表「活跃约束」追加一行（一行摘要 + 链接）
3. 若超越旧决策：旧行移入「已超越」，注明 `superseded by D-NNN`

## 活跃约束（binding）

| ID | 摘要 | 冷文件 |
|----|------|--------|
| D-001 | Loop Engineering 作为核心架构 | [D-001](./decisions/D-001-loop-engineering-core.md) |
| D-002 | 母版与子项目分离 | [D-002](./decisions/D-002-master-vs-subproject.md) |
| D-003 | 验证优先，禁止模型自评 | [D-003](./decisions/D-003-verify-first.md) |
| D-004 | 双 Harness（文档 + 执行） | [D-004](./decisions/D-004-dual-harness.md) |
| D-005 | Maker-Checker 子代理分离 | [D-005](./decisions/D-005-maker-checker.md) |
| D-006 | 单窗口 CURRENT.md 迭代 | [D-006](./decisions/D-006-single-window-current.md) |
| D-007 | 渐进披露 L0→L3 | [D-007](./decisions/D-007-progressive-disclosure.md) |
| D-008 | 状态文件不入库 | [D-008](./decisions/D-008-state-not-committed.md) |
| D-009 | Git 分支模型 main + develop + round/ | [D-009](./decisions/D-009-git-branch-model.md) |
| D-010 | 零 LLM 规则评审 | [D-010](./decisions/D-010-zero-llm-review.md) |
| D-011 | loop init 一键就绪 | [D-011](./decisions/D-011-loop-init-ready.md) |
| D-012 | skill-author 元技能 | [D-012](./decisions/D-012-skill-author.md) |
| D-013 | sync-template 母版同步 | [D-013](./decisions/D-013-sync-template.md) |
| D-014 | MCP 只读 Triage 为阶段 1 默认 | [D-014](./decisions/D-014-mcp-readonly-triage.md) |
| D-015 | 双模式 init（内部 / 外部） | [D-015](./decisions/D-015-dual-mode-init.md) |
| D-016 | scaffold-project workflow v2 | [D-016](./decisions/D-016-scaffold-v2.md) |
| D-017 | 阶段 3 PR Draft 半自动 + 人工 merge | [D-017](./decisions/D-017-pr-draft-stage3.md) |
| D-018 | L4 Cursor SDK 蓝图占位 | [D-018](./decisions/D-018-cursor-sdk-blueprint.md) |
| D-019 | adopt 现有仓库（overlay） | [D-019](./decisions/D-019-adopt-overlay.md) |
| D-020 | 子项目 CLI 与母版分离 | [D-020](./decisions/D-020-subproject-cli-split.md) |
| D-021 | L4 cloud-loop dry-run 默认 | [D-021](./decisions/D-021-cloud-loop-dry-run.md) |
| D-022 | 母版进入等待期（v0.7.0） | [D-022](./decisions/D-022-waiting-period.md) |
| D-023 | 决策热账本 + 冷 ADR（Decision Ledger） | [D-023](./decisions/D-023-decisions-ledger.md) |
| D-024 | 可执行状态迁移、allowlist gate 与 Maker-Checker 回执 | [D-024](./decisions/D-024-executable-harness-transitions.md) |
| D-025 | 控制契约 C0–C5 与披露层 D0–D3 分离 | [D-025](./decisions/D-025-control-and-disclosure-namespaces.md) |
| D-026 | 项目 capability profile 受限适配验证 gate | [D-026](./decisions/D-026-project-capability-profile.md) |

## 已超越 / 历史索引

> 正文不默认加载。当前无 superseded 条目。

| ID | 状态 | 被超越于 | 冷文件 |
|----|------|----------|--------|
| — | — | — | — |
