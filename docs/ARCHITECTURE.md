# Loop Forge · 架构

> 长期真相源：分层边界、六大积木映射、Harness 双轨、子项目孵化模型。  
> 改编排/Skills/验证逻辑前必读。

## 1. 定位

Loop Forge 是 **Loop Engineering 范式母版**，不是某个具体业务应用。

```
┌─────────────────────────────────────────────────────────┐
│  Loop Forge（母版）                                      │
│  · 六大积木配置  · Harness CLI  · 文档标准  · Skills 库   │
└──────────────────────────┬──────────────────────────────┘
                           │ copy projects/_template
                           ▼
┌─────────────────────────────────────────────────────────┐
│  具体项目（子项目）                                       │
│  · 业务代码  · 领域 Skills  · 项目专属 MCP  · CI/CD      │
└─────────────────────────────────────────────────────────┘
```

## 2. Loop Engineering 核心循环

### 2.1 外循环（你设计的系统）

```
Intent → Context → Action → Observation → Adjustment → (repeat)
  ↑                                                        │
  └────────────────── 直到验证通过或达 maxIterations ──────┘
```

### 2.2 内循环（Agent 内置）

```
Perceive → Reason → Act → Observe → (repeat)
```

外循环通过 Harness + 状态文件 + 验证脚本驱动内循环。

### 2.3 六大积木映射

| 积木 | 职责 | 本仓库实现 |
|------|------|-----------|
| **Automations** | 何时触发、做什么 | `/loop`、`hooks.json`、`workflows/*.yaml` |
| **Worktrees** | 并行隔离 | `worktree.mjs`、`isolation: worktree` 子代理 |
| **Skills** | 项目知识外置 | `.cursor/skills/`、`skills/roles/` |
| **Connectors** | 接真实世界 | `mcp.json.template`、文档 `MCP_INTEGRATION.md` |
| **Sub-agents** | 分工制衡 | `subagents/*`、Task 工具、`REVIEW_PROMPT.md` |
| **Memory** | 跨会话记忆 | `AGENTS.md`、`DECISIONS.md`、`loop-state.json`、`CURRENT.md` |

## 3. 双 Harness 架构

| Harness | 路径 | 职责 |
|---------|------|------|
| **文档 Harness** | `docs/**` | 人类/Agent 读序、边界、产品域链 |
| **执行 Harness** | `harness/**` | workflow、manifest、CLI、review、smoke |

**原则**：Agent 不靠对话记忆，靠 `pnpm loop manifest` 列出读序。

## 4. 五层联动契约（L0–L5）

详见 `docs/harness/layer-sync-contract.md`。

| 层 | 管什么 | 真相源 |
|----|--------|--------|
| L0 INDEX | 导航页（≤6KB） | `projects/*/INDEX.yaml` |
| L1 Skill | 角色语义 | `skills/roles/*/SKILL.md` |
| L2 Workflow | 多 Agent 顺序 | `harness/workflows/*.yaml` |
| L3 Manifest | 读/写文件清单 | `harness/manifests/*.yaml` |
| L4 执行文档 | 阶段细则 | `docs/harness/execution/` |
| L5 架构 | 状态机、预算 | 本文 + `context-budget.yaml` |

## 5. 渐进披露（L0→L3）

| 层级 | 内容 |
|------|------|
| L0 | `AGENTS.md` — 禁止项、地图、命令 |
| L1 | `docs/README.md` + `docs/harness/README.md` |
| L2 | 各子目录 `README.md` |
| L3 | PRD、契约、ADR、长文专论 |

**冲突处理**：安全优先 → 禁止项优先 → 目录就近优先。

## 6. 验证优先（终止条件）

- 禁止模型自评「已完成」
- 终止条件 = `pnpm verify` 退出码 0
- `/goal` 模式：独立检查者验证条件（Reviewer 子代理）

验证层级：

1. 结构 smoke（`smoke:all`）
2. workflow/manifest 对齐（`loop workflow validate`）
3. 项目级 verify（子项目自定义）

## 7. 子项目孵化模型

1. 复制 `projects/_template/` → 目标路径
2. 执行 `pnpm loop init` 写入项目元数据
3. 在子项目 `AGENTS.md` 覆盖领域铁律
4. 添加领域 Skills 到 `.cursor/skills/`
5. 配置 MCP（从 `mcp.json.template`）
6. **后续迭代只在子项目进行**，母版仅回流通用改进

## 8. 五种 Loop 模式（可选用）

| 模式 | 观察信号 | 停止条件 |
|------|---------|---------|
| 测试驱动 | 测试 pass/fail | 目标测试全绿 |
| 编译器驱动 | 类型/编译错误 | typecheck 零错误 |
| Review 驱动 | Review 评论 | 评论处理完毕 |
| 运行时调试 | 日志/堆栈 | 问题可复现并修复 |
| 产品迭代 | 截图/验收 | 与 spec 对齐 |

在 `harness/workflows/` 中选择或组合。

## 9. 自主程度阶梯

| 阶段 | Loop 能做 | 人做 |
|------|----------|------|
| 1 只读 | 发现问题、写状态文件 | 审查 TODO，手动决策 |
| 2 草稿 | 起草修复、跑验证 | 审查 diff，手动 push |
| 3 半自动 | 开 Draft PR、通知 | 审查 PR，手动 merge |
| 4 全自动 | Maker+Checker，CI 后合并 | 异常介入、定期审计 |

**Round 3：阶段 1–2 成熟** — init 一键就绪 + L3 编排 smoke 全绿。

## 10. 关键边界

- 母版 `harness/` 脚本不得依赖具体业务 DB/API
- `state/` 运行时文件不入库（模板用 `.template`）
- 决策仅追加：`DECISIONS.md` 不可删改历史 D 编号
- 单窗口计划：仅 `upgrade-plans/CURRENT.md` 为活跃迭代文档
