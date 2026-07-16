# D-020 · 子项目 CLI 与母版分离

> status: binding



- **日期**：2026-07-10 · Round 6
- **问题**：子项目 `loop init/sync-template/review` 误调用导致失败？
- **决策**：同步到子项目的 `loop.mjs` 仅保留 doctor/next/handoff/workflow/manifest；母版专属命令显式报错。
- **理由**：子项目自洽；避免 Agent 在错误仓库执行 init。
- **影响**：`projects/_template/harness/scripts/loop.mjs` 独立维护；`sync-manifest.yaml` **不同步** loop.mjs
- **锚点**：D-019

