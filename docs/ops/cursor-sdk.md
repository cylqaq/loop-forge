# Cursor SDK · L4 Loop 层

> 架构渐进采用 L4 · Loop Engineering §8  
> **状态：占位 + 集成蓝图**（Round 5 不引入运行时依赖）

## 1. L4 在栈中的位置

```
L1 基础循环     /loop + verify + state          ✅
L2 自动化       Hooks + GitHub Actions          ✅
L3 编排         workflow + manifest + CLI       ✅
L4 SDK/云端     @cursor/sdk + Automations API   ✅ dry-run + manual dispatch
```

L4 不是替代 L1–L3，而是把 **Harness 编排** 推到 IDE 外：CI、定时任务、多仓库。

## 2. @cursor/sdk 能力映射（六大积木）

| 积木 | SDK 映射 | 母版现状 |
|------|---------|---------|
| Automations | `Agent.create` + 定时触发 | `.cursor/automations.example.json` |
| Worktrees | SDK cloud agent + branch | `worktree.mjs` |
| Skills | 加载 `.cursor/skills/` | 已版本化 |
| Connectors | MCP 配置注入 Agent | `mcp.json.template` |
| Sub-agents | `Task` / 多 Agent 会话 | handoff CLI |
| Memory | CURRENT + loop-state | 文件真相源 |

## 3. 目标架构（云端 Loop）

```
┌─────────────────────────────────────────┐
│  GitHub Actions / Cron                   │
│  └─ cursor-sdk Agent                     │
│       ├─ prompt: CURRENT 下轮占位        │
│       ├─ skills: [.cursor/skills/]       │
│       ├─ mcp: [github-readonly]          │
│       └─ terminate: pnpm verify exit 0   │
└─────────────────────────────────────────┘
          │
          ▼
   PR comment / DAILY_TRIAGE.md / CURRENT 更新
```

## 4. 最小 L4 集成示例（占位代码）

> **不纳入 verify** — 需用户安装 `@cursor/sdk` 后启用

```typescript
// scripts/cloud-loop.example.ts — 占位，Round 6+ 实现
import { Agent } from '@cursor/sdk';

const agent = await Agent.create({
  instructions: 'Read docs/upgrade-plans/CURRENT.md next section only.',
  skills: ['loop-orchestrator'],
  workingDirectory: process.cwd(),
});

const run = await agent.prompt({
  message: 'Execute one item from CURRENT 下轮占位, then run pnpm verify.',
});

// Terminate when verify passes (external script checks exit code)
```

## 5. 与 Harness CLI 的分工

| 场景 | 工具 |
|------|------|
| 本地开发、handoff | `pnpm loop next` |
| Chat 定时 | Cursor `/loop` |
| CI 无人值守 | `@cursor/sdk`（L4） |
| 机械门禁 | `pnpm verify`（始终） |

**验证优先不变** — SDK Agent 不得自评完成。

## 6. 环境变量（L4 预留）

```bash
# .env.example 扩展（用户自行配置）
CURSOR_API_KEY=
CURSOR_AGENT_MODEL=
LOOP_CLOUD_ENABLED=false
```

## 7. Round 7 实施清单

- [x] 添加 `@cursor/sdk` 为 optionalDependency
- [x] `scripts/cloud-loop.mjs` 读取 CURRENT 驱动单次迭代（dry-run 默认）
- [x] GitHub Action `loop-cloud.yml`（manual dispatch）
- [x] 成本预算：`context-budget.yaml` 增加 `cloud_loop.*`
- [ ] 文档：SDK Agent + Maker-Checker 分离（见 `docs/LOOP_ENGINEERING.md` §8）

## 8. 安全

- API Key 仅 CI secret / 本地 `.env`
- 云端 Agent 默认 **只读 MCP**
- 写操作走 `mcp-pr-draft-flow.md` 阶段 3 门禁

## 9. 参考

- [Cursor SDK Skill](https://docs.cursor.com)（见用户环境 `@cursor/sdk`）
- 母版：`docs/LOOP_ENGINEERING.md` §8
- Automations：`.cursor/automations.example.json`
