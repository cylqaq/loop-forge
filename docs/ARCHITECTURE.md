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
| **Memory** | 跨会话记忆 | `AGENTS.md`、决策热账本 `DECISIONS.md` + 冷 ADR `docs/decisions/`、`loop-state.json`、`CURRENT.md` |

## 3. 双 Harness 架构

| Harness | 路径 | 职责 |
|---------|------|------|
| **Context / Knowledge Harness** | `docs/**` | 人类/Agent 读序、边界、决策、领域知识 |
| **执行 Harness** | `harness/**` | workflow、manifest、CLI、状态、sandbox 边界 |
| **Evaluation Harness**（执行 Harness 子系统） | `harness/review/`、`smoke-*` | deterministic gate、行为回归、轨迹/状态断言 |

**原则**：Agent 不靠对话记忆，靠 `pnpm loop manifest` 列出读序；执行是否完成由 gate、回执与状态迁移决定，不由模型自评决定。

### 3.1 项目能力画像

叶子项目必须以 `harness/project-capabilities.yaml` 声明包管理器与可用 gate。它只允许选择 `npm` 或 `pnpm`，并声明 `verify`、`review` 与可选 `smoke_all`；执行器据此生成固定的 `run <script>` 命令。Workflow/manifest 仍只能引用 allowlisted gate，画像**不能**声明任意可执行文件、参数或 shell 片段。

这样，母版能安全适配不同项目的验证能力，而不会把 `pnpm`、`smoke:all` 或 review runner 的存在当作全局事实。

## 4. 六层控制契约（C0–C5）

详见 `docs/harness/layer-sync-contract.md`。

| 层 | 管什么 | 真相源 |
|----|--------|--------|
| C0 INDEX | 导航页（≤6KB） | `projects/*/INDEX.yaml` |
| C1 Skill | 角色/能力语义 | `skills/roles/*/SKILL.md` |
| C2 Workflow | 多 Agent 顺序与 gate | `harness/workflows/*.yaml` |
| C3 Manifest | 上下文、读写、验证声明 | `harness/manifests/*.yaml` |
| C4 执行文档 | 阶段细则 | `docs/harness/execution/` |
| C5 架构 | 状态机、预算、事件模型 | 本文 + `context-budget.yaml` |

## 5. 渐进披露（D0→D3）

| 层级 | 内容 |
|------|------|
| D0 | `AGENTS.md` — 禁止项、地图、命令 |
| D1 | `docs/README.md` + `docs/harness/README.md` |
| D2 | 各子目录 `README.md` |
| D3 | PRD、契约、ADR、长文专论 |

**冲突处理**：安全优先 → 禁止项优先 → 目录就近优先。

## 6. 验证优先（终止条件）

- 禁止模型自评「已完成」
- 终止条件 = `pnpm verify` 退出码 0
- `/goal` 模式：独立检查者验证条件（Reviewer 子代理）

验证层级：

1. 结构 smoke（`smoke:all`）
2. workflow/manifest 对齐（`loop workflow validate`）
3. 状态机行为回归（失败不推进、预算、Reviewer 回执、恢复）
4. 项目级 verify（子项目自定义）

## 7. 子项目孵化模型

### 7.1 双模式路径

| 模式 | CLI | 路径 | Git |
|------|-----|------|-----|
| **内部** | `loop init projects/<id> <id>` | 母版 `projects/`（gitignore） | 可选 `--git` |
| **外部** | `loop init --external <path> <id> --git` | 母版外任意空目录 | 推荐 `--git` |
| **外部 adopt** | `loop adopt --external <path> <id>` | 母版外**已有业务**仓库 | 保留业务代码 |

### 7.2 孵化步骤

1. `pnpm loop sync-template`（可选，拉齐模板）
2. `pnpm loop init [--external] ...`
3. 子项目覆盖 `AGENTS.md`、领域 Skills
4. 配置 MCP（`mcp.json.template`）
5. **后续迭代只在子项目**；母版仅回流通用 harness

### 7.3 追溯标记

每个子项目含 `.loop-forge-origin.yaml`（mother_repo / project_id / external）。

详见 `docs/ops/external-project-lifecycle.md`、`docs/harness/execution/phases/05-scaffold.md`。

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

**Round 5 落地（阶段 2→3）**

| 能力 | 实现 |
|------|------|
| 阶段 1 只读 | `@daily-triage` + MCP GitHub read |
| 阶段 2 草稿 | `ci-fix` workflow |
| 阶段 3 半自动 | `@pr-draft` + `docs/ops/mcp-pr-draft-flow.md` |
| 外部孵化 | `loop init --external` + `scaffold-project` v2 |
| L4 蓝图 | `docs/ops/cursor-sdk.md`（Round 7 dry-run + manual dispatch） |
| 决策账本 | 热 `DECISIONS.md` + 冷 `docs/decisions/`（Round 8 / D-023） |

## 10. 关键边界

- 母版 `harness/` 脚本不得依赖具体业务 DB/API
- `state/` 运行时文件不入库（模板用 `.template`）；`run-events.jsonl` 为追加事实、`loop-state.json` 为当前投影、`CURRENT.md` 为人类摘要
- 决策热冷分层（D-023）：Agent 默认只读 `DECISIONS.md` 热账本（≤8KB）；完整条目在 `docs/decisions/D-NNN-*.md`（仅追加正文）；不可静默删改历史 D 编号
- 单窗口计划：仅 `upgrade-plans/CURRENT.md` 为活跃迭代文档
