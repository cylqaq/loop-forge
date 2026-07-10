# {Project Name} · Agent 指南

> 子项目 AGENTS.md — 覆盖母版通用铁律，添加**本领域**约束。

## 继承

母版 Loop Engineering 五阶段与六大积木仍然适用。  
先读本文件，再读 `docs/upgrade-plans/CURRENT.md`。

## 领域铁律（在此填写）

- （示例）API 变更须更新 `docs/requirements/api-contract-*.md`
- （示例）禁止 regex 做用户意图门控

## 命令

```bash
pnpm verify
pnpm loop next
```

## 边界（NEVER）

- 不跳过 verify
- 不把密钥提交 git
