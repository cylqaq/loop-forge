---
name: loop-core
description: Loop Engineering 母版核心知识。涉及 Automations、验证优先、五阶段外循环、六大积木时加载。
---

# Loop Core Skill

## 六大积木

1. **Automations** — `/loop`、`hooks.json`、`workflows/`
2. **Worktrees** — `pnpm worktree create`
3. **Skills** — `.cursor/skills/`、`skills/roles/`
4. **Connectors** — `mcp.json.template`
5. **Sub-agents** — `subagents/`、Maker-Checker
6. **Memory** — `AGENTS.md`、`DECISIONS.md`、`CURRENT.md`、`loop-state.json`

## 五阶段

Intent → Context → Action → Observation → Adjustment

详见 `docs/harness/execution/phases/`

## 铁律

- 禁止模型自评；`pnpm verify` 为终止条件
- 一 Skill 一会话：`pnpm loop next` → work → `pnpm loop handoff complete`
- 并行用 worktree

## 命令

```bash
pnpm verify
pnpm loop doctor
pnpm loop next
pnpm smoke:all
```
