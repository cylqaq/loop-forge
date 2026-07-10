# Loop Forge

**Loop Engineering 母版模板** — 把与 AI 交互沉淀的智慧（技能、MCP、边界、Harness、文档地图）固化为可复用体系，并据此孵化任意具体项目。

> 核心理念（Addy Osmani / Boris Cherny / Peter Steinberger）：  
> **你不该再手动提示 Agent，而该设计让 Agent 自己提示自己的 Loop。**

## 这是什么

| 角色 | 说明 |
|------|------|
| **母版仓库** | 维护 Loop Engineering 范式、通用 Skills、Harness 编排、文档标准 |
| **项目孵化器** | 从 `projects/_template/` 复制出自包含子项目，在子项目中做具体业务 |
| **智慧集合** | 验证优先、双 Harness、渐进披露、五层契约等工程实践已内化进架构 |

## 技术演进栈

```
Prompt Engineering  →  怎么问 AI
Context Engineering →  给 AI 什么信息
Harness Engineering →  如何组织 AI 的能力
Loop Engineering    →  如何让 AI 持续创造结果（本项目核心）
```

## Agent 入口（按顺序）

1. [`AGENTS.md`](./AGENTS.md) — L0 铁律、边界、命令速查
2. [`docs/README.md`](./docs/README.md) — 约 1 屏文档门户
3. [`docs/harness/README.md`](./docs/harness/README.md) — 复杂任务上下文地图
4. [`docs/upgrade-plans/CURRENT.md`](./docs/upgrade-plans/CURRENT.md) — **当前轮次**（上轮摘要 + 下轮占位）

## Loop 六大积木（本仓库实现）

| 积木 | 本仓库位置 |
|------|-----------|
| **Automations** | Cursor `/loop`、`.cursor/hooks.json`、`harness/workflows/` |
| **Worktrees** | `pnpm worktree`、`harness/scripts/worktree.mjs` |
| **Skills** | `.cursor/skills/`、`skills/` |
| **Connectors (MCP)** | `.cursor/mcp.json.template` |
| **Sub-agents** | `.cursor/skills/subagents/`、`REVIEW_PROMPT.md` |
| **Memory (State)** | `AGENTS.md`、`docs/DECISIONS.md`、`state/loop-state.json` |

## 快速命令

```bash
pnpm verify          # 验证门禁（类型/结构/smoke）
pnpm loop doctor     # 检查 Loop 健康度
pnpm loop next       # 获取下一轮 handoff 指令
pnpm smoke:all       # 零 LLM 机械校验
```

## 从母版创建具体项目

```bash
# 复制自包含模板到目标路径
cp -r projects/_template /path/to/my-new-project
cd /path/to/my-new-project
pnpm loop init
```

详见 [`docs/LOOP_ENGINEERING.md`](./docs/LOOP_ENGINEERING.md) 与 [`projects/_template/README.md`](./projects/_template/README.md)。

## 参考来源

- [菜鸟教程 · Loop Engineering](https://www.runoob.com/ai-agent/loop-engineering.html)
- [Loop Engineering 完全指南](https://muximxc.github.io/loop-engineering-guide/)
## 当前状态

**Round 2 完成** — 见 [`docs/upgrade-plans/CURRENT.md`](./docs/upgrade-plans/CURRENT.md)

- 仓库：https://github.com/cylqaq/loop-forge
- 分支：`main`（稳定）· `develop`（日常迭代）· `round/*`（单轮特性）
