# Phase 04 · Adjustment（调整）

## 目标

根据 Observation 更新计划，驱动下一轮外循环或结束。

## 验证通过

1. 压缩 `CURRENT.md` → 上轮摘要
2. 写下轮占位（或标记 Round 完成）
3. `DECISIONS.md` 追加 D-NNN（若有新原则）
4. `loop-state` → `status: completed`，`currentRound++`

## 验证失败

1. 记录 `lastError` 到 loop-state
2. `consecutive_verify_fail++`
3. 达阈值 → `status: blocked`，需人工
4. 否则：缩小目标，回到 Phase 00

## 多轮递进

一轮做不完 → **文档设计下轮**，不强行单轮堆叠：

```
CURRENT 下轮占位：明确遗留项 + 验收 + 风险
```

## 输出

- 更新后的 CURRENT.md
- 可选：DAILY_TRIAGE / BACKLOG 条目
