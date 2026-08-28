# Phase 03 · Observation（观察）

## 目标

获取**客观信号** — 禁止模型自评。

## 验证命令（母版默认）

```bash
pnpm verify
pnpm smoke:all
pnpm loop workflow validate   # 若改了 harness
```

## 观察信号类型

| 模式 | 信号 |
|------|------|
| 测试驱动 | 测试 pass/fail |
| 编译器驱动 | typecheck/编译错误 |
| Review 驱动 | Reviewer 子代理 APPROVED/REJECTED |
| 产品迭代 | 截图/验收清单 |

## Maker-Checker

Implementer 完成后，**独立会话**激活 Reviewer：
- 跑 `pnpm verify`
- 对照 `REVIEW_PROMPT.md`
- 输出 APPROVED 或具体 REJECTED 理由
- APPROVED 后：`pnpm loop handoff complete --reviewer-session <独立会话ID> --reviewed-revision <sha或working-tree>`

执行器只会运行 allowlist gate（`verify`、`review`）；manifest 中项目专属命令是适配层声明，不能作为任意 Shell 指令执行。

## 输出

- 验证命令退出码
- 失败日志摘要（写入 run-events + loop-state projection）
- 绑定 runId、Maker/Reviewer session、审查 revision 的回执
