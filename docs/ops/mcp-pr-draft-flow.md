# MCP PR Draft 流程（阶段 3 · 半自动）

> 架构 §9 自主阶梯 **阶段 3**：Loop 可开 Draft PR，**人审 merge**  
> Connectors 写操作 + Maker-Checker + 8 步编排

## 1. 阶段定位

| 阶段 | MCP 能力 | 人责 |
|------|---------|------|
| 1 只读 | Issues/CI 读 | 全审 |
| 2 草稿 | 本地改 + verify | 审 diff + push |
| **3 半自动** | **开 Draft PR** | **审 PR + merge** |
| 4 全自动 | CI 后 merge | 异常介入 |

**Round 5 落地阶段 3 文档与 Skill；不默认开启写 Token。**

## 2. 前置条件

1. GitHub Token 扩展 scope（仍最小化）：
   - `pull_requests: write`（仅 Draft）
   - **禁止** `contents: write` 除非团队明确授权
2. `.cursor/mcp.json` 增加 `github-draft` 服务器（见模板）
3. 子项目已 `git init` 且有 remote

## 3. 8 步 MCP 编排（写操作）

| 步 | 名称 | 动作 | 门禁 |
|----|------|------|------|
| 1 | 意图解析 | 读 CURRENT + diff | — |
| 2 | 对象召回 | 定位 repo/branch | MCP read |
| 3 | 状态查询 | CI/PR 状态 | MCP read |
| 4 | 差分规划 | 列出将推送的 commits | 人可读摘要 |
| 5 | **确认交互** | **显式用户批准** | **blocked 直到批准** |
| 6 | 执行写入 | push branch + 开 Draft PR | MCP write |
| 7 | 执行回读 | 读 PR URL、CI 状态 | MCP read |
| 8 | 结果回执 | 写 CURRENT + DAILY_TRIAGE | 文件 |

**读优先 · 写后必回读**（`docs/MCP_INTEGRATION.md`）

## 4. Maker-Checker 分工

| 角色 | 职责 |
|------|------|
| **Implementer** | 本地修改 + verify |
| **Reviewer** | 对抗审查 + `REVIEW_PROMPT.md` |
| **pr-draft** | 仅在 verify 通过后执行 MCP push/PR |

**Implementer 不得独自开 PR。**

## 5. 操作序列（PowerShell 示例）

```powershell
# 1. 本地闭环（阶段 2）
pnpm verify
git checkout -b feat/round-5-item
git add -A && git commit -m "feat: ..."

# 2. 激活 pr-draft Skill（阶段 3）
# @pr-draft — 展示 diff 摘要，请求确认

# 3. 用户批准后 Skill 执行：
git push -u origin feat/round-5-item
gh pr create --draft --title "..." --body "..."

# 4. 人审 merge（禁止 Agent 自动 merge）
```

## 6. `/goal` 与 workflow 集成

```bash
pnpm loop workflow use ci-fix
# verify 通过后
pnpm loop workflow use scaffold-project  # 或自定义 pr-draft workflow
```

Automations 示例见 `.cursor/automations.example.json` → `ci-fix-goal`

## 7. NEVER（阶段 3 边界）

- 不自动 merge PR
- 不 force push
- 不在未跑 verify 时开 PR
- 不把 Token 提交 git
- 不向母版 `main` 直接 push 业务代码

## 8. 升级到阶段 4 的前置

- [ ] Draft PR 流程稳定 30 天
- [ ] Reviewer 拒绝率 < 20%
- [ ] CI 全绿率 > 95%
- [ ] 团队书面批准 auto-merge 策略

## 9. 故障排查

| 现象 | 处理 |
|------|------|
| MCP 403 on PR create | Token scope 不足 |
| PR 已存在 | 回读 PR 状态，勿重复创建 |
| verify 失败 | 回到 ci-fix workflow |

## 10. 相关 Skill

- `@pr-draft` — 阶段 3 专用
- `@daily-triage` — 阶段 1 只读（前置）
