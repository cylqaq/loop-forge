# Phase 00 · Intent（意图）

## 目标

定义本轮**窄目标**、约束、**可验证的停止条件**。

## 输入

- `docs/upgrade-plans/CURRENT.md` 下轮占位
- 外部信号（Issue、CI 报告）— 可选，经 MCP

## 动作

1. 将宽泛目标改写成窄目标（含文件/测试范围）
2. 在 CURRENT 或 handoff 中写明验证命令
3. 设定 `max_iterations`（默认见 `context-budget.yaml`）

## 输出

- 更新后的 Intent 段落（写入 handoff 或 CURRENT）
- 明确的 `success_condition` 字符串

## 禁止

- 不得使用「优化」「改进」等无边界措辞作为唯一目标
- 不得省略验证命令

## 示例

```
目标：修复 harness/scripts/loop.mjs 的 workflow validate 对缺失 manifest 的报错。
成功条件：pnpm loop workflow validate 退出码 0。
```
