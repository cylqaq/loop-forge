# 文档 Harness（渐进披露）

面向人类与 AI Agent：用最少上下文定位正确文档。

## 何时必读

- 任务跨 `harness/`、`skills/`、`docs/` 多层
- 涉及子项目孵化或六层控制契约变更
- 不确定读哪份长文

仅改单文件且熟悉规范时，读根 `AGENTS.md` + [`agent-routing.md`](./agent-routing.md) 即可。

## D0→D3 披露层级

| 层级 | 内容 | 路径 |
|------|------|------|
| D0 | 铁律、地图 | [`AGENTS.md`](../../AGENTS.md) |
| D1 | 门户 + 本文 | [`README.md`](../README.md) |
| D2 | 子目录索引 | `execution/`、`ops/` |
| D3 | 长文 | `ARCHITECTURE.md`、`LOOP_ENGINEERING.md` 等 |

**冲突处理**：安全 → 禁止项 → 目录就近

## 按维度跳转

| 维度 | L2 | L3 |
|------|----|----|
| Loop 范式 | 本文 | [`LOOP_ENGINEERING.md`](../LOOP_ENGINEERING.md) |
| 架构边界 | [`../ARCHITECTURE.md`](../ARCHITECTURE.md) | [`layer-sync-contract.md`](./layer-sync-contract.md) |
| 迭代接力 | [`../upgrade-plans/`](../upgrade-plans/) | [`CURRENT.md`](../upgrade-plans/CURRENT.md) |
| 决策记忆 | [`../DECISIONS.md`](../DECISIONS.md) 热账本 | [`../decisions/`](../decisions/) 冷 ADR（按需） |
| 运维 | [`ops/`](./ops/) | [`branch-strategy.md`](./ops/branch-strategy.md)、[`github-setup.md`](./ops/github-setup.md) |
| 母版保护 | [`../ops/root-project-protection.md`](../ops/root-project-protection.md) | — |

## 产品域读链：孵化子项目

1. [`../ops/root-project-protection.md`](../ops/root-project-protection.md)
2. [`../../projects/_template/README.md`](../../projects/_template/README.md)
3. `harness/workflows/scaffold-project.yaml`

## 与 agent-routing 配合

代码/目录路径 → Skill 映射见 [`agent-routing.md`](./agent-routing.md)。
