# 子项目模板

从本目录复制，或使用母版命令：

```bash
pnpm loop init projects/my-app my-app
# 自动：复制 → 替换 id → npm install → doctor
```

## 自包含

- `harness/` — round-cycle CLI
- `docs/harness/` — 精简 Harness 地图
- `docs/DECISIONS.md` + `docs/decisions/` — 决策热账本 / 冷 ADR（D-023）
- `.cursor/hooks.json`
- `skills/guides/` — handoff 协议

## 扩展领域 Skill

1. 用 `@skill-author` 设计新 Skill
2. 参考母版 `.cursor/skills/domain-web-app/`
3. 写入子项目 `.cursor/skills/`

## INDEX

导航入口：`INDEX.yaml`（≤6KB）
