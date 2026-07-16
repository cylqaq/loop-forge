# Loop Forge · Agent 接力指南

> 任何新对话/新 Agent 接手本项目，**第一步先读这份**。  
> Cursor 会自动把根目录 `AGENTS.md` 注入上下文。

## 是什么

Loop Forge 是 **Loop Engineering 母版模板仓库**：

- 固化六大积木（Automations / Worktrees / Skills / Connectors / Sub-agents / Memory）
- 提供可执行 Harness（`pnpm loop`）与文档 Harness（`docs/harness/`）
- 从 `projects/_template/` 孵化任意具体项目

**母版 vs 子项目**：母版只做范式迭代；具体业务在复制出的子项目中进行（见 `docs/ops/root-project-protection.md`）。

## 必读三件套（按顺序）

1. **`docs/ARCHITECTURE.md`** — 分层架构、六大积木映射、边界。**改 Harness/Skills 前必读**。
2. **`docs/DECISIONS.md`** — 决策热账本（活跃约束索引，默认只读）。完整 ADR 在 `docs/decisions/D-NNN-*.md`（冷路径，仅追加）。新决策不得静默推翻旧条目。
3. **`docs/upgrade-plans/CURRENT.md`** — 单窗口迭代（上轮摘要 + 下轮占位）。**每轮开始前先读**。

## Loop 五阶段纪律

每个外循环迭代必须走完五阶段（Intent → Context → Action → Observation → Adjustment）：

| 阶段 | 本仓库动作 |
|------|-----------|
| **Intent** | 读 `CURRENT.md`，明确本轮目标与验收标准 |
| **Context** | 按 `docs/harness/README.md` 渐进披露读文档 |
| **Action** | 实现 + `pnpm loop handoff` 单 Skill 会话 |
| **Observation** | 运行 `pnpm verify` / `pnpm smoke:all`（**禁止模型自评**） |
| **Adjustment** | 更新 `CURRENT.md`、决策账本（热表 + 冷 ADR），规划下轮 |

## 工作纪律

- 每轮收尾必做：
  1. 精简 `docs/upgrade-plans/CURRENT.md` 为上轮摘要 + 下轮占位
  2. 可复用原则：新建 `docs/decisions/D-NNN-*.md` 并在 `docs/DECISIONS.md` 热表追加一行
  3. 必要时小幅修订 `docs/ARCHITECTURE.md`
  4. 删除死代码与过期占位
- 改 Skill / workflow / manifest / 文档任意一层 → 对照 `docs/harness/layer-sync-contract.md`
- 一 Skill 一会话：先 `pnpm loop next`，完成后 `pnpm loop handoff complete`

## 命令速查

```bash
pnpm verify              # 完整验证门禁
pnpm loop doctor         # Loop 健康检查（文档/hooks/状态）
pnpm loop next           # 获取当前 handoff（单角色激活）
pnpm loop handoff complete  # 完成 handoff + postflight
pnpm loop workflow validate # L2↔L3 对齐
pnpm loop workflow list     # 列出 workflow
pnpm loop workflow use ci-fix  # 切换 handoff 工作流
pnpm loop sync-template     # 母版 harness → _template
pnpm smoke:ci-fix           # ci-fix 链 smoke校验
pnpm smoke:all           # 零 LLM 机械 smoke
pnpm worktree create <name>  # 并行实验隔离
```

## 边界（NEVER）

- **不跳过验证**：循环终止条件 = `pnpm verify` 通过，禁止模型自评完成
- **不丢失状态**：迭代进度写入 `state/loop-state.json` 与 `CURRENT.md`
- **不并行改同一文件**：并行实验用 `git worktree`
- **不污染母版**：具体业务在 `projects/` 子项目，不在根目录堆业务代码
- **不修改 git config** / 不擅自 `push --force`
- **不把 `state/loop-state.json` 当长期真相**：运行时状态；轮次摘要在 `CURRENT.md`

## 目录速览

```
.cursor/           # Cursor 六大积木配置
  skills/          # 动态技能（含 subagents）
  rules/           # 静态规则
  hooks.json       # 生命周期门禁
  mcp.json.template
docs/              # 文档 Harness（L1-L3）
  DECISIONS.md     # 决策热账本（≤8KB）
  decisions/       # 冷 ADR（D-NNN-*.md）
  harness/         # 上下文地图 + 五层联动契约
  upgrade-plans/   # CURRENT.md 单窗口迭代
harness/           # 执行 Harness（可运行）
  scripts/         # loop.mjs CLI
  workflows/       # L2 编排
  manifests/       # L3 读/写清单
  review/          # 零 LLM 规则（含 decisions-ledger）
  context-budget.yaml
skills/            # 可版本化 Skills（母版级）
projects/
  _template/       # 自包含子项目模板
scripts/           # verify / before-start
state/             # 运行时状态（gitignore）
```

## 子代理分工（Maker-Checker）

| 角色 | Skill 路径 | 职责 |
|------|-----------|------|
| Explorer | `.cursor/skills/subagents/explorer/` | 只读探索、结构报告 |
| Implementer | `.cursor/skills/subagents/implementer/` | 实现修改 |
| Reviewer | `.cursor/skills/subagents/reviewer/` | 对抗性审查（见 `REVIEW_PROMPT.md`） |
| Tester | `.cursor/skills/subagents/tester/` | 运行验证、报告失败 |

**检查者与实现者必须分离** — 做工作的模型不得独自判定「完成」。

## 新会话接力

读 `docs/HANDOFF.md` + `docs/upgrade-plans/CURRENT.md`，然后：

```
继续 Loop Forge。先读 AGENTS.md 三件套，再读 CURRENT.md。
若 CURRENT 为等待期：答疑与小修复即可；若下轮占位已激活：执行该 Round 目标。
```
