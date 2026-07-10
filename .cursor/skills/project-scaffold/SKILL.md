---
name: project-scaffold
description: 从 projects/_template 孵化子项目。涉及新建具体项目、复制模板、init 时加载。
---

# Project Scaffold Skill

## 流程

1. 读 `docs/ops/root-project-protection.md`
2. 确认目标路径（不在母版根堆业务）
3. `pnpm loop init <path>` 或手动复制 `projects/_template`
4. 子项目内覆盖 `AGENTS.md`、配置 `mcp.json`
5. 个人 GitHub：`docs/ops/github-setup.md`

## 子项目须自包含

- `AGENTS.md`、`harness/`、`skills/`、`docs/` 副本或 symlink 说明

## 验收

子项目 `pnpm verify` 通过（若已配置）
