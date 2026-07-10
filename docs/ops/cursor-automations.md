# Cursor Automations 与 /loop

> Loop Engineering **要素一：Automations** 在 Cursor 中的落地方式。

## 1. Chat `/loop`（本地 Agent 循环）

### 阶段 1 · 只读 Triage（推荐首个 Loop）

```
/loop 1d 读取 docs/upgrade-plans/CURRENT.md，运行 pnpm loop doctor，
将发现写入 state/DAILY_TRIAGE.md。禁止修改源码，禁止开 PR。
```

### 阶段 2 · 验证修复（/goal 语义）

```
/goal 运行 pnpm verify 直到退出码 0。每次失败后最小修复，最多 10 轮。
禁止修改 git config。每轮更新 state/loop-state.json。
```

### 阶段 3 · Round 接力

```
/loop 4h 读 CURRENT.md 下轮占位，执行一项拟措施，跑 pnpm verify，
更新 CURRENT 上轮摘要。单轮只做占位中一项。
```

## 2. Hooks（已配置）

`.cursor/hooks.json`：

- `beforeAgentStart` → `scripts/before-start.mjs`
- `beforeCommit` → `scripts/verify.mjs`

## 3. GitHub Actions（云端）

`.github/workflows/smoke.yml` — push/PR 时跑 `npm run verify`。

## 4. Cursor Automations（cursor.com）

可在 Cursor 设置中创建定时 Automation：

| 名称 | 调度 | Prompt 摘要 |
|------|------|------------|
| daily-triage | 工作日 9:00 | 只读 Triage → DAILY_TRIAGE.md |
| weekly-doctor | 周一 9:00 | `pnpm loop doctor` + 报告 |

**Token 提示**：从低频开始（每天一次），观察成本后再加快。

## 5. 与 Harness CLI 的关系

| 工具 | 层级 |
|------|------|
| `pnpm loop next/handoff` | 可执行 Harness（步骤编排） |
| `/loop` | Cursor 自动化唤醒 |
| `hooks.json` | 编辑/提交门禁 |

三者互补，不互相替代。
