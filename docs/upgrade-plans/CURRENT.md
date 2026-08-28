# CURRENT · Round 10 完成 · Capability-aware Harness 基线

> **状态：等待新知识。** 当前没有活跃实施目标；不因例行检查自行开启新 Round。

## 上轮摘要

Round 10 以三个真实叶子项目验证了 Round 9 的执行 Harness：

- `app-demo`：pnpm，`verify`、`review`、`smoke:all` 完整可用；狗狗币盲盒 D-066 已完成代码门禁。
- `knowledge-base`：npm，`verify` 与 `review` 可用，不伪造 smoke；D-068 继续保持受控发布边界。
- `stormeye-ai`：pnpm，`verify` 与 `review` 可用，不伪造 smoke；Round 27 的业务状态保持不变。

由此新增 D-026：`harness/project-capabilities.yaml` 仅声明 `npm`/`pnpm` 与 allowlisted gate，执行器只派生固定的 `run verify` / `run review`，不给 YAML 任意 shell 权限。模板与三个叶子项目均已采用可执行的 Observation → Review → Adjustment、绑定 runId 的审查回执、profile-aware gate 与 zero-LLM review。

## 下轮占位（静默等待）

仅在出现新的、可复核的跨项目能力差异或失败轨迹时，才新建 Round；届时先以真实项目 profile 与验证证据定义窄目标，不直接假设所有项目具有相同的命令或 smoke 能力。

验收标准：任何新 Round 须以 `pnpm verify`、`pnpm smoke:all` 与独立 Reviewer 的批准回执收口。
