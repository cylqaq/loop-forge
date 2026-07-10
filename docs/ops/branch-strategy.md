# Git 分支策略

> Loop Forge 母版仓库采用 **main + develop + round/** 三层分支模型，对齐 Loop Engineering 多轮递进。

## 分支一览

| 分支 | 用途 | 保护 |
|------|------|------|
| `main` | 稳定母版；仅合并已 `pnpm verify` 的 develop | 默认分支；发布标签指向此 |
| `develop` | 日常集成；Round 迭代主战场 | PR/合并前须 verify |
| `round/N-short-name` | 单轮特性（可选） | 从 develop 拉出，合并回 develop |

## 工作流

```
round/2-template ──┐
round/3-xxx     ──┼──▶ develop ──▶ main
                  │      ▲
                  └──────┘（每轮合并）
```

### 新开一轮

```bash
git checkout develop
git pull origin develop
git checkout -b round/3-xxx
# ... 实现 ...
pnpm verify
git commit && git push -u origin round/3-xxx
# 合并到 develop（PR 或本地 merge）
```

### 发布稳定母版

```bash
git checkout main
git merge develop
pnpm verify
git push origin main
git tag -a v0.1.0 -m "Round 2 complete"
git push origin v0.1.0
```

## 子项目

从 `projects/_template` 孵化的具体项目**独立仓库**，不共用本分支模型；见 `root-project-protection.md`。

## 远程

- 个人 GitHub：`https://github.com/cylqaq/loop-forge.git`
- 勿与公司 Git remote 混用
