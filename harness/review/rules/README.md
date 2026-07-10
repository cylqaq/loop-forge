# Review 规则（零 LLM）

机械规则评审，供 `pnpm loop review` 与 Reviewer 子代理对照。

## 规则列表

| 规则 | 文件 | 检查内容 |
|------|------|---------|
| required-docs | `required-docs.mjs` | 关键文档存在 |
| no-secrets | `no-secrets.mjs` |  staged 文件无密钥模式 |
| workflow-align | `workflow-align.mjs` | L2↔L3 对齐 |
| current-has-next | `current-has-next.mjs` | CURRENT 含下轮占位与验收 |
| skills-structure | `skills-structure.mjs` | SKILL.md frontmatter 规范 |

## 用法

```bash
pnpm loop review
```

退出码 0 = 全部通过。

## 扩展

新增规则：在 `harness/review/rules/` 添加 `*.mjs`，导出 `name` 与 `run(root)`，在 `run-review.mjs` 注册。
