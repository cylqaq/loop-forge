# Skill 设计模式库

## Template Pattern

输出格式固定：

```markdown
## 报告结构
# [标题]
## 摘要
## 发现
## 建议
```

## Workflow Pattern

```markdown
## 步骤
- [ ] 1. 读 CURRENT.md
- [ ] 2. 实现
- [ ] 3. pnpm verify
```

## Conditional Pattern

```markdown
**改 harness？** → 读 layer-sync-contract.md
**改 Skill？** → 跑 skills-structure review
```

## Feedback Loop Pattern

```markdown
1. 修改
2. 立即 `pnpm verify`
3. 失败则缩小 diff 重试
4. 通过才 handoff complete
```

## Maker-Checker Pattern

实现 Skill 与 reviewer Skill **不同会话**；reviewer 跑 verify + REVIEW_PROMPT.md。

## paths 域限定（Cursor 2026）

```yaml
paths: harness/**, .cursor/skills/**
```

仅在编辑匹配文件时自动 surfaced。

## disable-model-invocation

破坏性/计费敏感流程设为 `disable-model-invocation: true`，仅 `/skill-name` 手动触发。
