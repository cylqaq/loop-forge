---
name: pr-draft
description: >-
  Stage-3 semi-automatic PR flow after verify passes. Creates draft PR via GitHub
  MCP/gh with mandatory human approval before push. Use for draft PR, stage 3,
  mcp write, pull request, or after ci-fix workflow succeeds.
disable-model-invocation: true
---

# PR Draft（阶段 3 · 半自动）

> 架构 §9 阶段 3 · `docs/ops/mcp-pr-draft-flow.md`

## 前置（全部满足才继续）

- [ ] `pnpm verify` exit 0
- [ ] Reviewer 独立会话 APPROVED（Maker-Checker）
- [ ] 用户**显式批准** push/开 PR
- [ ] 不在母版根堆业务

## 8 步编排

1. 读 CURRENT + `git diff --stat`
2. MCP/gh 读 remote 与 open PRs
3. 确认 CI 状态
4. 输出差分摘要（≤20 行）
5. **等待用户「批准开 Draft PR」**
6. `git push` + `gh pr create --draft`
7. 回读 PR URL + checks
8. 写 CURRENT 上轮摘要 + PR 链接

## NEVER

- 自动 merge
- force push
- verify 未通过时开 PR
- 跳过 Step 5 确认

## 相关

- 阶段 1：`@daily-triage`
- 阶段 2：`ci-fix` workflow + implementer
