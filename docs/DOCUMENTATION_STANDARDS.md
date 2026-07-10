# 文档规范

## 分类

| 类型 | 路径模式 | 更新策略 |
|------|---------|---------|
| 架构 | `docs/ARCHITECTURE.md` | 长期；小步修订 |
| 决策 | `docs/DECISIONS.md` | **仅追加** D-NNN |
| 迭代 | `docs/upgrade-plans/CURRENT.md` | 每轮压缩重写活跃区 |
| Loop 范式 | `docs/LOOP_ENGINEERING.md` | 随范式演进更新 |
| 执行细则 | `docs/harness/execution/` | 与 L2/L3 同步 |

## 决策记录模板

```markdown
## D-NNN · 标题
- **日期**：YYYY-MM-DD · Round N
- **问题**：…
- **决策**：…
- **理由**：…
- **影响**：…
- **锚点**：文件路径
```

## 迭代计划模板（CURRENT.md）

```markdown
## 上轮摘要
…

## 下轮占位 · Round N+1
### 目标 / 拟措施 / 验收标准 / 风险
```

## 必须更新文档的场景

1. 新增/修改验证脚本
2. 新增 Skills、Hooks、MCP
3. 修改 workflow/manifest
4. 变更 Loop 终止条件或安全栓

## 质量检查

- [ ] 与 `layer-sync-contract.md` 一致
- [ ] 无重复长条款（细则在 docs，AGENTS.md 只做入口）
- [ ] 验收标准含可执行命令
