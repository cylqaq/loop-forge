# Loop Forge 项目规则

## 核心

- 本项目是 **Loop Engineering 母版**；业务在子项目
- 外循环五阶段：Intent → Context → Action → Observation → Adjustment
- 终止条件 = `pnpm verify` 退出码 0

## 代码与文档

- 改 harness/skills/docs 任一层 → 跑 `pnpm loop workflow validate`
- 决策：新建冷 ADR `docs/decisions/D-NNN-*.md`，并在热账本 `docs/DECISIONS.md` 追加一行（禁止静默覆盖）
- `AGENTS.md` 薄入口，细则在 `docs/`

## 禁止

- 模型自评「已完成」
- 跳过 verify
- 在母版根目录堆具体业务 apps
- 修改 git config / force push
