# 文档门户

约 1 屏索引。复杂任务进 [`harness/README.md`](./harness/README.md)。

## 快速跳转

| 我要… | 去读 |
|-------|------|
| 理解项目 | [`ARCHITECTURE.md`](./ARCHITECTURE.md) |
| Loop 怎么用 | [`LOOP_ENGINEERING.md`](./LOOP_ENGINEERING.md) |
| 当前做到哪了 | [`upgrade-plans/CURRENT.md`](./upgrade-plans/CURRENT.md) |
| 历史决策 WHY | [`DECISIONS.md`](./DECISIONS.md) 热账本 + [`decisions/`](./decisions/) 冷 ADR |
| 新会话接力 | [`HANDOFF.md`](./HANDOFF.md) |
| MCP 怎么接 | [`MCP_INTEGRATION.md`](./MCP_INTEGRATION.md) |
| 文档怎么写 | [`DOCUMENTATION_STANDARDS.md`](./DOCUMENTATION_STANDARDS.md) |
## 默认读序（Agent）

1. 根 [`AGENTS.md`](../AGENTS.md)
2. **本文**
3. [`harness/README.md`](./harness/README.md)（跨域/复杂任务）
4. [`upgrade-plans/CURRENT.md`](./upgrade-plans/CURRENT.md)
5. 任务相关 L3 长文

## 目录地图

```
docs/
├── ARCHITECTURE.md          # 长期：架构与边界
├── DECISIONS.md             # 热：活跃约束索引（≤8KB，D-023）
├── decisions/               # 冷：D-NNN-*.md 完整 ADR（仅追加）
├── LOOP_ENGINEERING.md      # Loop 范式落地
├── DOCUMENTATION_STANDARDS.md
├── HANDOFF.md
├── MCP_INTEGRATION.md
├── harness/                 # 文档 Harness
├── upgrade-plans/           # CURRENT 单窗口
├── ops/                     # 运维与母版保护
└── sources/                 # 外部参考
```

## Skill 链（母版级）

**round-cycle**：navigator → implementer → tester → reviewer → orchestrator

详见 [`../skills/README.md`](../skills/README.md)。
