# 外部子项目全生命周期

> 架构 §7 扩展 · 母版保护 · Loop Engineering 阶段 2 孵化

## 1. 路径模型

```
loop-forge/                    ← 母版（范式、Harness、Skills 库）
├── projects/
│   ├── _template/             ← 唯一模板真相源
│   └── <id>/                  ← 内部孵化（gitignore，实验用）
└── ...

e:/my-project/<id>/            ← 外部子项目（推荐生产路径）
├── .loop-forge-origin.yaml    ← 追溯母版
├── AGENTS.md                  ← 子项目 L0
├── harness/                   ← 自包含副本
└── apps/ ...                  ← 业务代码
```

## 2. 内部 vs 外部决策树

```
需要独立 GitHub 仓库、长期业务开发？
├─ 是 → 外部 init --external --git
└─ 否 → 仅母版内试验？
         ├─ 是 → 内部 init projects/<id>
         └─ 否 → 重新评估
```

## 3. 孵化流程（逐步）

### Step 1 · Intent

1. 读 `docs/ARCHITECTURE.md` §7
2. 读 `docs/ops/root-project-protection.md`
3. 确定 `id`、路径、是否 `--git`

### Step 2 · Action（空目录 init）

```powershell
cd e:\my-project\loop-forge
pnpm loop sync-template          # 可选：确保模板最新
pnpm loop init --external e:\my-project\my-app my-app --git
```

### Step 2b · Action（已有仓库 adopt）

```powershell
cd e:\my-project\loop-forge
pnpm loop sync-template
pnpm loop adopt --external e:\my-project\my-app my-app
```

**adopt 不覆盖**：`AGENTS.md`、`package.json`、业务 `docs/ARCHITECTURE.md` 等。  
**adopt 写入**：`harness/`（含 review）、subagents Skills、`REVIEW_PROMPT.md`、`verify-loop.mjs`、`.loop-forge-origin.yaml`。

### Step 3 · 子项目配置

```powershell
cd e:\my-project\my-app
copy .cursor\mcp.json.template .cursor\mcp.json   # 若模板有
# 编辑 AGENTS.md 领域铁律
# 编辑 docs/upgrade-plans/CURRENT.md
```

### Step 4 · Observation

```powershell
npm run verify
pnpm loop doctor
```

### Step 5 · GitHub（外部仓库）

```powershell
cd e:\my-project\my-app
gh repo create my-app --private --source=. --remote=origin --push
```

见 `docs/ops/github-setup.md`。

### Step 6 · Adjustment

- 子项目 `CURRENT.md` 写下轮
- 业务迭代**只在子项目**进行
- 母版 harness 改进：`pnpm loop sync-template` 后手动合并到子项目或重新 init

## 4. `.loop-forge-origin.yaml` 契约

| 字段 | 含义 |
|------|------|
| `mother_repo` | 母版绝对路径 |
| `project_id` | kebab-case id |
| `external` | true/false |
| `scaffolded_at` | ISO 8601 |
| `template_path` | 固定 `projects/_template` |

**用途**：Agent 判断当前仓库来源；禁止删除。

## 5. 母版回流协议

| 变更类型 | 方向 | 方式 |
|---------|------|------|
| 通用 harness 修复 | 子项目 ← 母版 | sync-template + 手动 diff |
| 领域 Skill | 子项目 → 母版 | 仅当通用化后 PR |
| 业务代码 | 永不 | 母版禁止 `apps/` |

## 6. workflow 编排

```bash
pnpm loop workflow use scaffold-project --target-root <target_root>
pnpm loop next    # → project-scaffold
# ... handoff complete × 5（Maker/Reviewer 分别提供 session）
```

## 7. 故障排查

| 错误 | 原因 | 处理 |
|------|------|------|
| External path must be outside projects/ | `--external` 指到了 projects/ | 改路径或去掉 --external |
| Target not empty | 目录已有文件 | init 换空目录；**已有项目用 adopt** |
| project.yaml exists | 重复 init | 新目录或清理 |
| Already adopted | 重复 adopt | 加 `--force` 重 overlay |

## 8. 验收标准

```bash
pnpm verify
pnpm smoke:adopt
```
