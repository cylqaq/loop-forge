# CURRENT · Round 8 完成 · 等待期 · 封版 v0.8.0

> 单窗口迭代：**上轮摘要 + 下轮占位**。  
> **状态**：母版 **v0.8.0 文档封版**；主动迭代暂停，待新技能/架构理念沉淀后再开 Round 9。

## 上轮摘要

**Round 8 · 2026-07-16 · Decision Ledger（热账本 + 冷 ADR）**

- **`docs/DECISIONS.md`** 改为热路径索引（≤8KB）；完整条目迁入 `docs/decisions/D-NNN-*.md`
- **D-023**：决策热冷分层；冷正文仅追加；超越更新热表状态
- **`context-budget.yaml`** 增加 `decisions.*`；review 规则 `decisions-ledger` 门禁体积与 1:1 索引
- **模板**：`_template` 同步热 stub + `docs/decisions/`
- **封版**：README / AGENTS / 路由 / 文档规范对齐；`pnpm verify` exit 0 ✅

## 下轮占位 · 等待期（非活跃）

> 无预设 Round 9 任务。当你学会新的有用技能、MCP 集成或架构理念时，在此写下轮目标并重启迭代。

### 触发条件（任选）

- 新 Skill / MCP / Automation 模式值得母版化
- 子项目回流通用 harness 改进（经 `sync-template` 手动合并）
- Cursor SDK / cloud-loop 需 live 模式生产化
- 已 adopt 子项目迁移旧单体 DECISIONS 的辅助脚本

### 重启时拟措施（模板）

1. 读 `DECISIONS.md` 热账本 + 相关冷 ADR + `ARCHITECTURE.md`，确认不推翻既有 D-NNN
2. 在此节写下 Round N 目标、拟措施、风险
3. 实现 → `pnpm verify` → 冷 ADR + 热表 → 合并 develop → main → 打标签

### 验收标准

```bash
pnpm verify
pnpm smoke:all
```

---

## 历史

### Round 7 · L4 SDK 闭环 + adopt · v0.7.0

### Round 6 · adopt + 模板自洽 · v0.5.0

### Round 5 · 外部孵化 + scaffold v2 · v0.4.0

### Round 4 · MCP Triage + ci-fix · v0.3.0

### Round 3 · init + skill-author · v0.2.0

### Round 2 · Git 标准化

### Round 1 · 骨架
