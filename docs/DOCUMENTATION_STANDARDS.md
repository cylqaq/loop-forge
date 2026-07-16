# 文档规范

## 分类

| 类型 | 路径模式 | 更新策略 |
|------|---------|---------|
| 架构 | `docs/ARCHITECTURE.md` | 长期；小步修订 |
| 决策热账本 | `docs/DECISIONS.md` | 活跃约束索引（≤8KB）；状态行可更新 |
| 决策冷 ADR | `docs/decisions/D-NNN-*.md` | **仅追加**正文；超越须新 D |
| 迭代 | `docs/upgrade-plans/CURRENT.md` | 每轮压缩重写活跃区 |
| Loop 范式 | `docs/LOOP_ENGINEERING.md` | 随范式演进更新 |
| 执行细则 | `docs/harness/execution/` | 与 L2/L3 同步 |

## 决策记录模板（冷 ADR）

路径：`docs/decisions/D-NNN-slug.md`，并在热账本 `docs/DECISIONS.md` 追加一行。

```markdown
# D-NNN · 标题

> status: binding

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
5. 新增/超越决策（冷 ADR + 热账本一行）

## 质量检查

- [ ] 与 `layer-sync-contract.md` 一致
- [ ] 无重复长条款（细则在 docs，AGENTS.md 只做入口）
- [ ] 验收标准含可执行命令
- [ ] 热账本 `DECISIONS.md` ≤8KB；无 `## D-NNN ·` 全文标题
- [ ] 每条冷 ADR 在热表有一行；`pnpm loop review` 含 `decisions-ledger`

## 文档封版

每轮合并 `main` 并打版本标签前：

1. `CURRENT.md` 压缩为上轮摘要 + 等待期/下轮占位
2. README「当前状态」与 `package.json` version、git tag 一致
3. `pnpm verify` exit 0
4. 本文件与 `ARCHITECTURE.md` 边界无过期表述
