# Agent 路由表

按编辑路径选择 Skill / 文档。减少 Agent 选错角色。

| 路径模式 | 先读 | 推荐 Skill |
|----------|------|-----------|
| `harness/**` | `layer-sync-contract.md` | `@loop-orchestrator` |
| `harness/workflows/**` | `ARCHITECTURE.md` §五层 | `@loop-orchestrator` |
| `harness/manifests/**` | 对应 workflow | `@navigator` |
| `.cursor/skills/**` | `LOOP_ENGINEERING.md` §Skills | `@skill-author` |
| `.cursor/skills/skill-author/**` | `references/patterns.md` | `@skill-author` |
| `.cursor/hooks.json` | `LOOP_ENGINEERING.md` §Automations | `@loop-core` |
| `docs/**` | `DOCUMENTATION_STANDARDS.md` | `@navigator` |
| `docs/DECISIONS.md` | 热账本协议（D-023） | `@loop-orchestrator` |
| `docs/decisions/**` | 对应冷 ADR + 热表一行 | `@loop-orchestrator` |
| `docs/upgrade-plans/**` | `CURRENT.md` | `@loop-orchestrator` |
| `projects/_template/**` | `ops/root-project-protection.md` | `@project-scaffold` |
| `harness/scripts/init-lib.mjs` | `external-project-lifecycle.md` | `@project-scaffold` |
| `docs/ops/mcp-pr-draft-flow.md` | `ARCHITECTURE.md` §9 | `@pr-draft` |
| `docs/ops/cursor-sdk.md` | `LOOP_ENGINEERING.md` L4 | `@loop-orchestrator` |
| `projects/*/`（非模板） | 子项目 `AGENTS.md` | `@domain-web-app` 或子项目 Skill |
| `scripts/verify.mjs` | `ARCHITECTURE.md` §验证 | `@tester` |
| `state/**` | 冷 ADR [D-008](../decisions/D-008-state-not-committed.md) | `@loop-orchestrator` |

## 冲突时

1. 子项目 `AGENTS.md` 就近优先（在子项目内）
2. 母版根 `AGENTS.md`（在母版内）
3. `docs/harness/README.md`
