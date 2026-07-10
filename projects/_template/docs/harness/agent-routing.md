# Agent 路由表

按编辑路径选择 Skill / 文档。减少 Agent 选错角色。

| 路径模式 | 先读 | 推荐 Skill |
|----------|------|-----------|
| `harness/**` | `layer-sync-contract.md` | `@loop-orchestrator` |
| `harness/workflows/**` | `ARCHITECTURE.md` §五层 | `@loop-orchestrator` |
| `harness/manifests/**` | 对应 workflow | `@navigator` |
| `.cursor/skills/**` | `LOOP_ENGINEERING.md` §Skills | `@loop-core` |
| `.cursor/hooks.json` | `LOOP_ENGINEERING.md` §Automations | `@loop-core` |
| `docs/**` | `DOCUMENTATION_STANDARDS.md` | `@navigator` |
| `docs/upgrade-plans/**` | `CURRENT.md` | `@loop-orchestrator` |
| `projects/_template/**` | `ops/root-project-protection.md` | `@project-scaffold` |
| `projects/*/`（非模板） | 子项目 `AGENTS.md` | 子项目 Skill |
| `scripts/verify.mjs` | `ARCHITECTURE.md` §验证 | `@tester` |
| `state/**` | `DECISIONS.md` D-008 | `@loop-orchestrator` |

## 冲突时

1. 子项目 `AGENTS.md` 就近优先（在子项目内）
2. 母版根 `AGENTS.md`（在母版内）
3. `docs/harness/README.md`
