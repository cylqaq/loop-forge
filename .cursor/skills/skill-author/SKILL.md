---
name: skill-author
description: >-
  Authors and reviews Cursor Agent Skills (SKILL.md). Use when creating skills,
  writing skill descriptions, structuring references/scripts, or migrating rules
  to skills. Triggers on skill design, SKILL.md, agentskills.io, progressive disclosure.
---

# Skill Author（技能设计元技能）

遵循 [Agent Skills 开放标准](https://agentskills.io) 与 Cursor 2026 最佳实践。

## 设计原则

1. **一 Skill 一职责** — 单一可重复工作流
2. **渐进披露** — frontmatter 仅 name+description；正文 <500 行；细节放 `references/`
3. **描述即触发器** — 第三人称，含 WHAT + WHEN + 关键词
4. **Gather → Act → Verify** — 技能内强调验证命令

## 目录结构

```
skill-name/
├── SKILL.md           # 必需
├── references/        # 可选，按需加载
│   └── patterns.md
└── scripts/           # 可选，可执行
    └── validate.mjs
```

## Frontmatter 模板

```yaml
---
name: kebab-case-name    # 与文件夹名一致，≤64 字符
description: >-
  第三人称描述能力与触发场景。Use when ...
paths: apps/api/**       # 可选，文件域限定
---
```

## 描述写法（触发器）

```yaml
# ✅ 好
description: Runs pnpm verify and fixes type errors in monorepo apps. Use when verifying Loop iterations, fixing typecheck failures, or before handoff complete.

# ❌ 差
description: Helps with code stuff.
```

## 自由度分级

| 级别 | 适用 | 形式 |
|------|------|------|
| 高 | 代码审查、架构 | 原则 + checklist |
| 中 | 报告、文档 | 模板 + 示例 |
| 低 | 迁移、发布 | 固定脚本 + 命令 |

## 创作流程

1. **Discovery** — 目的、存储位置（`.cursor/skills/` vs `~/.cursor/skills/`）、触发词
2. **Design** — name、description、章节大纲
3. **Implementation** — SKILL.md + references/scripts
4. **Verification** — `pnpm loop review` 中 skills-structure 规则；用真实任务触发

## Loop Forge 约定

- 母版通用 Skill → `.cursor/skills/` + `skills/roles/` 镜像
- 领域 Skill → 子项目 `.cursor/skills/domain-*/`
- 与 workflow 对齐：在 manifest `skills:` 列表登记

## 反模式

- Windows 反斜杠路径
- 过多并列选项（应给默认 + 逃逸口）
- 时间敏感信息（「2025 年前用旧 API」）
- 混用术语（endpoint/route/path 择一）

## 参考

- 详细模式库： [references/patterns.md](references/patterns.md)
- Cursor 官方：https://cursor.com/docs/skills
- 验证：运行 `node harness/review/rules/skills-structure.mjs`（经 `pnpm loop review`）
