# D-009 · Git 分支模型 main + develop + round/

> status: binding



- **日期**：2026-07-10 · Round 2
- **问题**：如何管理母版多轮迭代与稳定发布？
- **决策**：`main` 稳定、`develop` 集成、`round/N-*` 单轮特性分支。
- **理由**：对齐 Loop 多轮递进；稳定与实验分离。
- **影响**：`docs/ops/branch-strategy.md`；默认从 develop 开发。
- **锚点**：`docs/ops/branch-strategy.md`

