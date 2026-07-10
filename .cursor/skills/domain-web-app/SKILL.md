---
name: domain-web-app
description: >-
  Scaffolds fullstack web apps (API + admin UI) from Loop Forge sub-projects.
  Use when creating SaaS, admin panels, monorepo apps, or adding apps/api and apps/web.
paths: projects/**, apps/**
---

# Domain Web App（领域示例技能）

> 展示如何从 Loop Forge 母版**扩展为具体 Web 项目**的领域 Skill 模板。

## 适用场景

- 新建 SaaS / 管理后台 / API 服务
- Monorepo：`apps/api` + `apps/admin` + `packages/shared`

## 孵化流程

1. `pnpm loop init projects/my-saas my-saas`（自动 install + doctor）
2. 在子项目 `AGENTS.md` 填写领域铁律
3. 复制本 Skill 到子项目 `.cursor/skills/domain-web-app/`
4. 添加 `docs/requirements/prd-*.md` → 实现 → `pnpm verify`

## 推荐结构

```
my-saas/
├── apps/
│   ├── api/          # Nitro/Nest/Fastify
│   └── admin/        # Nuxt/React
├── packages/
│   ├── shared/       # 类型契约唯一来源
│   └── db/           # schema + migration
├── docs/
│   ├── requirements/
│   └── architecture/
└── deploy/
```

## 铁律（子项目 AGENTS.md 应覆盖）

- 类型契约只在 `packages/shared`
- API 变更同步 `api-contract-*`
- 禁止跳过 migration
- 终止条件：子项目 `pnpm verify`

## Loop 集成

- round-cycle 不变；领域任务写入 `CURRENT.md` 下轮占位
- 新增 manifest：`harness/manifests/web-feature.yaml`（子项目内）

## 验证

```bash
pnpm verify                    # 子项目门禁
pnpm loop workflow validate    # harness 对齐
```

## 扩展

用 `@skill-author` 创建更多领域 Skill（如 `domain-mobile`、`domain-data-pipeline`）。
