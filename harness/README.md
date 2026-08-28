# 执行 Harness

CLI 入口：`pnpm loop`（根 package.json 指向 `harness/scripts/loop.mjs`）

## 结构

```
harness/
├── scripts/       loop.mjs, loop-lib.mjs, smoke-all.mjs, worktree.mjs
├── workflows/     L2 编排
├── manifests/     L3 读/写清单
├── context-budget.yaml
├── templates/
└── review/        规则评审（Round 2+）
```

## 命令

```bash
pnpm loop doctor
pnpm loop next
pnpm loop handoff complete --maker-session <id>
pnpm loop handoff complete --reviewer-session <id>
pnpm loop workflow validate
pnpm smoke:state-machine
pnpm loop manifest round-start
pnpm loop init [path]
```
