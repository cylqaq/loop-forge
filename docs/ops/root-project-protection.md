# 母版保护

## 原则

| 仓库 | 用途 |
|------|------|
| **loop-forge（母版）** | 范式迭代、通用 Skills、Harness、文档标准 |
| **子项目** | 具体业务开发、领域 Skills、生产部署 |

## 规则

1. 子项目创建后，**业务迭代在子项目进行**，不回母版堆业务代码
2. 母版改进（通用 harness 修复）可回流，但须经 `pnpm verify` + PR 审查
3. 从母版复制 `projects/_template/` 时，子项目获得**自包含副本**，可脱离母版运行
4. 子项目路径建议：`e:/my-project/{project-name}/` 或用户指定

## 母版允许的内容

- `harness/` 通用编排
- `skills/roles/` 通用角色（navigator、reviewer…）
- `docs/patterns/` 设计模式库
- `.cursor/skills/loop-*` 母版 Skills

## 母版禁止的内容

- 具体业务 API/Web 应用（应放子项目 `apps/`）
- 生产密钥、客户数据
- 仅对单一业务有效的硬编码
