# MCP 集成指南

> Loop Engineering **要素四：Connectors**。让 Loop 接入 Issue、CI、Slack、数据库等真实世界。

## 原则

1. **最小权限** — 每个连接器仅授必要 scope
2. **写操作须审批** — push/merge/发外部通知默认需人工确认
3. **模板分发** — 母版提供 `mcp.json.template`；子项目复制为 `mcp.json` 并填密钥

## 配置位置

```
.cursor/mcp.json.template   # 母版模板（无密钥）
.cursor/mcp.json            # 本地实例（gitignore，含 env）
```

## 推荐连接器（按自主阶段）

| 阶段 | 连接器 | 权限 |
|------|--------|------|
| 1 只读 | GitHub Issues/PR 读 | read |
| 2 草稿 | 文件系统 + CI 日志读 | read |
| 3 半自动 | GitHub PR 创建（draft） | read + write:pull_requests |
| 4 全自动 | + Slack 通知 | 按团队策略 |

## MCP 架构（JSON-RPC）

- **tools/list** — 可用工具
- **tools/call** — 执行调用
- **resources/list** — 可读资源（可选）

传输：stdio（本地）/ Streamable HTTP（远程）

## Loop 中的 MCP 用法

| 场景 | 模式 |
|------|------|
| 每日 Triage | 读 CI + Issues → 写 `state/DAILY_TRIAGE.md` |
| CI 修复 Loop | CI 失败 Hook → 读日志 → spawn 修复子代理 |
| 文档同步 | 检测 API 变更 → 更新 OpenAPI/README |

## 8 步交互编排（写操作）

1. 意图解析 → 2. 对象召回 → 3. 状态查询 → 4. 差分规划  
5. 确认交互 → 6. 执行写入 → 7. 执行回读 → 8. 结果回执

**读优先、写后必回读。**

## 安全清单

- [ ] Token 在 `.env` 或系统密钥管理，不入库
- [ ] `mcp.json` 已加入 `.gitignore`（若含密钥）
- [ ] 高风险 Tool 在 workflow 中标注 `requires_approval: true`
