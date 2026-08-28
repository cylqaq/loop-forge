# Phase 01 · Context（上下文）

## 目标

按渐进披露加载**与本任务相关**的文档与代码，避免上下文雪球。

## 读序

1. `AGENTS.md`（已注入可跳过）
2. `docs/harness/README.md`（跨域时）
3. `pnpm loop manifest <task>` 输出的 BEFORE 列表
4. C0 INDEX（≤6KB）— 子项目 `INDEX.yaml`

## Navigator 模式

复杂任务先激活 `@navigator` Skill：
- 只读 INDEX 三件套
- 输出 `context-plan.md`（≤200 行）
- 主 Skill 仅按 plan 加载

## 预算

见 `harness/context-budget.yaml`：
- `hard_total_cap_kb` 超限 → 熔断，强制 navigator

## 输出

- context-plan 或 manifest 确认清单
- 标注不读的文件及原因
