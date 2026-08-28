# Handoff 协议

## 一 Skill 一会话

1. `pnpm loop next` — 只激活一个角色
2. 本会话**仅**扮演该 Skill
3. `pnpm loop handoff complete` — 仅在当前角色已激活时推进；Implementer/Reviewer 分别附带 session 证据，gate 在 Observation/Review 运行
4. 新会话再 `pnpm loop next`

## 顺序权威

以 `harness/workflows/*.yaml` 为准，不以口头约定为准。

## Maker-Checker

implementer 与 reviewer **必须不同会话**。
