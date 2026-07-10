# GitHub MCP 只读 Triage Loop

> Loop Engineering 阶段 1 实战：**只读**发现 → 分类 → 写 `state/DAILY_TRIAGE.md`

## 前置条件

1. GitHub 个人账号 Token（**只读** scope）
2. Cursor 已启用 MCP
3. 母版 `.cursor/mcp.json` 从模板复制（**不入库**）

## 步骤 1 · 创建 Token

1. 打开 https://github.com/settings/tokens
2. **Fine-grained token**（推荐）或 Classic
3. 权限（只读）：
   - Repository: `loop-forge` → Metadata (read), Issues (read), Pull requests (read)
   - Actions: Read（若需读 CI）
4. 复制 Token → **勿提交 git**

## 步骤 2 · 本地配置

```powershell
cd e:\my-project\loop-forge
copy .cursor\mcp.json.template .cursor\mcp.json
copy .env.example .env
# 编辑 .env，填入 GITHUB_TOKEN=ghp_...
```

`.env` 已 gitignore。Cursor MCP 读取环境变量 `${GITHUB_TOKEN}`。

## 步骤 3 · 验证 MCP

在 Cursor Settings → MCP 确认 `github-readonly` 服务器已连接。

## 步骤 4 · 运行 Triage Loop

### Chat `/loop`（阶段 1 只读）

```
/loop 1d 使用 GitHub MCP 读取 cylqaq/loop-forge 最近 24h 的 open issues 与 failed CI runs。
分类为 Critical / This Week / Watched。写入 state/DAILY_TRIAGE.md。
禁止修改源码，禁止开 PR，禁止 push。
```

### 或使用 Skill

```
@daily-triage 运行今日 triage
```

## 输出格式（DAILY_TRIAGE.md）

```markdown
# Daily Triage · YYYY-MM-DD

## Critical（今日必处理）
- [ ] #NNN: ...

## This Week
- [ ] ...

## Watched
- #NNN: ...（观察中）

## CI
- run_id: ... — 失败原因摘要
```

## 安全

| 允许 | 禁止 |
|------|------|
| 读 Issues/PR/CI | push / merge / close issue |
| 写 DAILY_TRIAGE.md | 写源码 |
| 写 CURRENT 建议项 | 自动开 PR（阶段 3+） |

## 故障排查

| 问题 | 处理 |
|------|------|
| MCP 未连接 | 检查 `.cursor/mcp.json` 与 Token |
| 403 | Token scope 不足 |
| 空结果 | 确认 repo 名 `cylqaq/loop-forge` |

## 下一步（阶段 2）

verify 失败时切换 `ci-fix` workflow：

```bash
pnpm loop next   # 需在 loop-state 设 handoff.workflow=ci-fix
```

见 `harness/workflows/ci-fix.yaml`。
