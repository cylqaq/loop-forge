# D-024 · 可执行 Harness 状态迁移与审查回执

> status: binding

- **日期**：2026-08-27 · Round 9
- **问题**：workflow、manifest、预算与 Maker-Checker 曾主要是文档协议；`handoff complete` 可无条件推进，无法证明验证、审查或预算约束实际发生。
- **决策**：执行 Harness 以受约束状态迁移运行。每一步必须先激活；allowlist postflight gate 通过后才能推进；连续验证失败会 block；`currentIteration` 仅统计完整 workflow；Reviewer 必须以不同于 Maker 的 session 写入绑定 `runId`/revision 的 APPROVED 回执，Adjustment 才可推进。
- **理由**：将“停止条件不可由模型自评”的 D-003 与 Maker-Checker D-005 落到执行器；保留固定五阶段的低复杂度默认，而非过早引入通用图运行时。
- **影响**：`state/run-events.jsonl` 是追加运行事实，`loop-state.json` 是当前投影，`CURRENT.md` 是人类摘要；manifest postflight 只允许执行器预定义 gate，项目外部命令仅描述、由适配层运行。回执是流程证据，不是身份安全边界。
- **锚点**：`harness/scripts/loop-lib.mjs`、`harness/scripts/smoke-state-machine.mjs`、`harness/manifests/round-{observe,review,adjust}.yaml`

## 追加记录 · 2026-08-27

- `scaffold-project` 以 `--target-root` 绑定目标项目；`project-doctor`、`project-verify` 为 allowlist gate，且 origin/AGENTS/project/workflow 工件必须存在。带 `goal.success_condition` 的 workflow 必须声明并实际完成 `completion_gate` 后才能 completed。
- `workflow use` 只切换 idle workflow，不再清预算；只有显式 `--new-session --reason <text>` 才会重置会话计数并写入运行事件。
