---
name: daily-triage
description: >-
  Runs read-only GitHub triage via MCP: open issues, failed CI, categorizes into
  DAILY_TRIAGE.md. Use for daily triage, GitHub MCP setup, stage-1 automations,
  or /loop triage prompts. Never modifies source code or opens PRs.
disable-model-invocation: true
---

# Daily Triage（只读 Triage Loop）

Loop Engineering **阶段 1**：Automations + MCP Connectors。

## 前置

1. 已配置 `.cursor/mcp.json`（从 template）+ `GITHUB_TOKEN`
2. 读 `docs/ops/mcp-github-triage.md`

## 流程

1. **Intent** — 只读；输出 `state/DAILY_TRIAGE.md`
2. **Context** — MCP 读 `cylqaq/loop-forge` Issues + 近期 CI
3. **Action** — 分类 Critical / This Week / Watched
4. **Observation** — 确认文件已写入，**不**跑 verify（无代码变更）
5. **Adjustment** — 可选：在 CURRENT 下轮占位追加建议项

## 禁止（NEVER）

- 修改 `apps/`、`harness/` 等源码
- push / merge / close issue
- 创建 PR

## 输出模板

见 `docs/ops/mcp-github-triage.md` §输出格式

## 与 ci-fix 关系

Triage 发现 verify/CI 失败 → 人工决定是否启动 `ci-fix` workflow（阶段 2）。

```bash
pnpm loop workflow list
# handoff.workflow 设为 ci-fix 后 pnpm loop next
```
