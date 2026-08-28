# 执行阶段索引

Loop 外循环五阶段在本仓库的落地细则：

| Phase | 文档 | 阶段 |
|-------|------|------|
| 00 | [00-intent.md](./phases/00-intent.md) | Intent |
| 01 | [01-context.md](./phases/01-context.md) | Context |
| 02 | [02-action.md](./phases/02-action.md) | Action |
| 03 | [03-observation.md](./phases/03-observation.md) | Observation |
| 04 | [04-adjustment.md](./phases/04-adjustment.md) | Adjustment |
| 05 | [05-scaffold.md](./phases/05-scaffold.md) | Scaffold（子项目孵化） |

完整 round 走 `harness/workflows/round-cycle.yaml`。  
子项目孵化走 `harness/workflows/scaffold-project.yaml`（plan → copy → verify → review → adjust）。
