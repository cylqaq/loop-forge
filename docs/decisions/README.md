# 决策冷档案（ADR）

> 每条决策一个文件：`D-NNN-slug.md`。  
> Agent **默认不读本目录**；先读热账本 [`../DECISIONS.md`](../DECISIONS.md)，再按需打开单条。

## 模板

```markdown
# D-NNN · 标题

> status: binding

- **日期**：YYYY-MM-DD · Round N
- **问题**：…
- **决策**：…
- **理由**：…
- **影响**：…
- **锚点**：…
```

`status`：`binding` | `superseded`（被超越时在热表注明 `superseded by D-XXX`，正文保留不改写）。
