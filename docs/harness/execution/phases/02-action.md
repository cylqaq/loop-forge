# Phase 02 · Action（行动）

## 目标

在**单 Skill 单会话**内完成实现或起草。

## 流程

1. `pnpm loop next` — 获取当前角色 handoff
2. 仅扮演该 Skill 角色
3. 最小可逆变更；尊重现有代码模式
4. `pnpm loop handoff complete --maker-session <session-id>` — 记录 Maker 身份并推进；验证 gate 由 Observation 执行

## 并行

- 多实验 → `pnpm worktree create <name>`
- 多角色 → 顺序 handoff，禁止同会话多角色

## 输出

- 代码/文档 diff
- handoff 产物路径（manifest `during_write`）

## 禁止

- 没有 Maker session 就 handoff complete
- 大范围推测性重写
