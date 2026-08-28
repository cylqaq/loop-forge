# Loop Engineering 完全指南（Loop Forge 版）

> 本仓库对 [菜鸟教程 Loop Engineering](https://www.runoob.com/ai-agent/loop-engineering.html) 与 [完全指南](https://muximxc.github.io/loop-engineering-guide/) 的**落地实现**。  
> 理论不全复述于此 — 见 `docs/sources/REFERENCES.md`；本文聚焦**在本母版中如何用**。

## 1. 范式定义

**Loop Engineering** = 设计、运营、持续改进反馈循环，使 AI Agent 能自主完成：规划 → 执行 → 验证 → 修复 → 再循环，直到可验证的完成条件成立。

一句话：**从「提示 Agent 的人」变成「设计提示 Agent 的系统的人」。**

### 1.1 与相邻概念

| 概念 | 关系 |
|------|------|
| Prompt Engineering | Loop 内的单次指令；Loop 在其之上 |
| Context Engineering | 每轮 Context 阶段加载什么 |
| Harness Engineering | 单 Agent 运行环境；Loop = 定时/条件驱动的 Harness |
| Agentic Engineering | 更广；Loop Engineering 专注闭环模式 |

## 2. 外循环五阶段

```
┌─────────┐    ┌─────────┐    ┌─────────┐    ┌─────────────┐    ┌────────────┐
│ Intent  │───▶│ Context │───▶│ Action  │───▶│ Observation │───▶│ Adjustment │
│ 定义目标 │    │ 收集上下文│    │ 执行修改 │    │ 跑验证/观察  │    │ 更新计划    │
└─────────┘    └─────────┘    └─────────┘    └─────────────┘    └──────┬─────┘
       ▲                                                                  │
       └──────────────────── 未通过验证 ──────────────────────────────────┘
```

### 本仓库映射

| 阶段 | 命令/文件 |
|------|----------|
| Intent | `docs/upgrade-plans/CURRENT.md` 下轮占位 |
| Context | `pnpm loop manifest`、Harness 读序 |
| Action | Agent 编辑 + `pnpm loop handoff` |
| Observation | `pnpm verify`、`pnpm smoke:all` |
| Adjustment | 更新 CURRENT、DECISIONS、loop-state |

## 3. 六大积木详解

### 3.1 Automations（循环的心跳）

完整示例见 `docs/ops/cursor-automations.md`。

| 机制 | 配置 | 用途 |
|------|------|------|
| Cursor `/loop` | Chat | 定时/动态唤醒 Agent |
| Cursor `/goal` | Chat | 直到验证条件成立 |
| Hooks | `.cursor/hooks.json` | 生命周期门禁 |
| Workflows | `harness/workflows/*.yaml` | 可编排多步循环 |
| GitHub Actions | `.github/workflows/smoke.yml` | 云端 smoke |

**推荐首个 Loop（阶段 1 只读）**：

```
/loop 读取 docs/upgrade-plans/CURRENT.md 与 state/loop-state.json，
对照 pnpm loop doctor 输出，将发现写入 state/DAILY_TRIAGE.md。
不修改源码。不打开 PR。
```

### 3.2 Worktrees（并行隔离）

```bash
pnpm worktree create experiment-round-2
# 在独立目录运行 Loop，完成后 merge
pnpm worktree remove experiment-round-2
```

子代理 frontmatter 可加 `isolation: worktree`（见 subagents reviewer）。

### 3.3 Skills（项目知识编码）

- **渐进披露**：启动只加载 name/description；命中才读全文
- **母版级**：`skills/roles/` — 通用 Loop 角色
- **Cursor 级**：`.cursor/skills/` — IDE 自动发现
- **领域级**：子项目 `.cursor/skills/{domain}/`

### 3.4 Connectors（MCP）

- 模板：`.cursor/mcp.json.template`
- 指南：`docs/MCP_INTEGRATION.md`
- **最小权限**；写操作须人工审批（D-005 延伸）

### 3.5 Sub-agents（分工制衡）

| 角色 | 模型建议 | 权限 |
|------|---------|------|
| Explorer | 轻量 | 只读 |
| Implementer | 主力 | 读写 |
| Tester | 主力 | 读 + 跑测试 |
| Reviewer | 强推理 | 只读 + 跑 verify |

使用 Cursor `Task` 工具或 `pnpm loop next` 单 Skill 会话。

### 3.6 Memory（持久记忆）

| 类型 | 文件 | 用途 |
|------|------|------|
| 入口记忆 | `AGENTS.md` | 每会话自动注入 |
| 决策记忆 | `docs/DECISIONS.md` + `docs/decisions/` | 热索引 + 冷 ADR（D-023） |
| 轮次记忆 | `docs/upgrade-plans/CURRENT.md` | 单窗口摘要 |
| 运行事件 | `state/run-events.jsonl` | 追加的迁移、gate、回执事实 |
| 运行投影 | `state/loop-state.json` | 当前 cursor、预算与状态（不入库） |
| 接力记忆 | `docs/HANDOFF.md` | 新会话 onboarding |

**仓库记得，模型不记得** — 一切重要状态落盘。

## 4. 五种 Loop 模式

见 `docs/ARCHITECTURE.md` §9。workflow 文件：

- `round-cycle.yaml` — 产品迭代 / 多轮递进
- `ci-fix.yaml` — 测试驱动
- `scaffold-project.yaml` — 孵化子项目

## 5. Loop 安全栓（AI Loop Safety）

`harness/context-budget.yaml`：

```yaml
loop_safety:
  max_rounds_per_session: 3
  max_iterations: 10
  consecutive_verify_fail: 3    # → blocked
  empty_loop_guard_minutes: 30
  cost_ceiling_note: "子项目自行配置 Token 预算"
```

## 6. 故障模式与应对

| 模式 | 表现 | 应对 |
|------|------|------|
| 空转 Thrashing | 反复改无收敛 | 缩小目标、减小 diff、`verify` 降噪 |
| 过拟合测试 | 测试绿功能错 | 加 E2E/人工验收 |
| 上下文漂移 | 基于过期假设 | Intent 阶段重读 CURRENT |
| 不安全自主 | 未授权破坏操作 | 最小权限、阶段 1–2 起步 |

## 7. 多轮递进协议（本母版特色）

Loop Engineering 能力之一：**一轮做不完，用文档设计下轮**。

每轮结束：

1. `CURRENT.md` ← 上轮摘要（做了什么、验证结果、遗留）
2. `CURRENT.md` ← 下轮占位（目标、拟措施、验收、风险）
3. 决策账本 ← 新冷 ADR + 热表一行（D-023）
4. `run-events.jsonl` 追加迁移事实；`loop-state.json` 更新投影（完整 workflow 才 iteration++）

下轮开始：

```
继续 Loop Forge Round {N+1}。先读 CURRENT.md 下轮占位，执行后跑 pnpm verify。
```

## 8. 渐进采用路线

| 层级 | 内容 | 本仓库 Round |
|------|------|-------------|
| L1 基础循环 | `/loop` + 状态 + verify | Round 1 ✅ |
| L2 自动化 | Hooks + smoke CI | Round 1 ✅ |
| L3 编排 | workflow + manifest CLI | Round 1–3 ✅ |
| L4 SDK/云端 | `@cursor/sdk`、Automations API | Round 5 蓝图 · Round 6 实现 |

## 9. 三大风险（必读）

1. **验证仍是你的责任** — 子代理审查 ≠ 证明
2. **理解债** — Loop 越快，越要主动读产出
3. **认知投降** — 用 Loop 提升思考，而非逃避思考

## 10. 检查清单

- [ ] 目标够窄且有验收命令？
- [ ] 验证脚本写进 Intent？
- [ ] 状态会落盘（CURRENT + loop-state）？
- [ ] Implementer/Reviewer 分离？
- [ ] 并行用 worktree？
- [ ] 改 harness 层跑 `layer-sync-contract` 检查？

## 11. 开环 vs 闭环

| 模式 | 行为 | Loop Engineering |
|------|------|------------------|
| 开环 Open-Loop | 执行后不根据结果调整 | ❌ 传统单次 Prompt |
| 闭环 Closed-Loop | 观察 → 调整 → 再执行 | ✅ 本范式核心 |

## 12. 五种 Loop 模式（完整）

| 模式 | 观察信号 | 停止条件 | workflow |
|------|---------|---------|----------|
| 测试驱动 | 测试 pass/fail | 目标测试全绿 | `ci-fix.yaml` |
| 编译器驱动 | typecheck/编译错误 | 零错误 | `ci-fix.yaml` |
| Review 驱动 | Reviewer APPROVED/REJECTED | 无 REJECTED | round-cycle + reviewer |
| 运行时调试 | 日志/堆栈/HTTP | 可复现并修复 | 自定义 manifest |
| 产品迭代 | 截图/验收清单 | 与 spec 对齐 | round-cycle |

## 13. 自主程度四阶梯

| 阶段 | Loop 能做 | 人做 |
|------|----------|------|
| 1 只读 | 发现、分类、写状态/TODO | 审查，手动决策 |
| 2 草稿 | 起草修复、跑验证、写分支 | 审查 diff，手动 push |
| 3 半自动 | Draft PR、CI、通知 | 审查 PR，手动 merge |
| 4 全自动 | Maker+Checker，CI 后合并 | 异常介入、审计 |

**母版默认：阶段 1–2。**

## 14. 反模式

- Loop 过于复杂（>3 专业子代理无明确价值）
- 验证条件太弱（「看起来没问题」）
- 忽视 Token 成本（高频 + 强模型）
- 认知投降（停止理解产出）

## 15. 成本管理

- 探索用轻量模型，审查用强模型
- 从每天一次开始调频率
- 条件触发优于定时空转
- Skills 渐进披露减 token
