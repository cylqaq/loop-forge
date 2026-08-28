# 六层控制契约

> Skill、workflow、manifest、执行文档、架构**解耦但环环相扣**。
> 改任意一层必须对照本契约。

## 五层职责

| 层 | 管什么 | 真相源 | 不管什么 |
|----|--------|--------|----------|
| **C0 INDEX** | 导航页 ≤6KB | `projects/*/INDEX.yaml` | 不抄正文 |
| **C1 Skill** | 角色语义 | `skills/roles/*/SKILL.md` | 不定义全局顺序 |
| **C2 Workflow** | 顺序、handoff、gate | `harness/workflows/*.yaml` | 不列完整读文件清单 |
| **C3 Manifest** | 上下文、读写、gate 声明 | `harness/manifests/*.yaml` | 不定义步骤先后 |
| **C4 执行文档** | 人类读序 | `docs/harness/execution/` | 不替代脚本 |
| **C5 架构** | 状态机、预算、事件 | `ARCHITECTURE.md`、`context-budget.yaml` | 不列逐步 CLI |

**编排真相源**：`harness/scripts/loop-lib.mjs`

**能力画像边界**：`harness/project-capabilities.yaml` 是 C3 gate 的项目适配输入，只能选择 allowlisted 的 package manager 与 script gate；它不授予 YAML 任意 shell 权限。新增/修改 gate 时，须同时更新执行器、画像 schema 与 golden smoke。

## 机械校验（改完必跑）

```bash
pnpm loop workflow validate
pnpm smoke:state-machine
pnpm smoke:all
pnpm verify
```

## 迭代检查表

### 改了 `harness/workflows/*.yaml`

- [ ] `pnpm loop workflow validate`
- [ ] 对应 Skill「工作流位置」已更新
- [ ] `docs/harness/execution/` 相关 phase
- [ ] `skills/README.md` 链式表
- [ ] 含 `goal.success_condition` 的 workflow 被 `workflow-goal` review 覆盖

### 改了 `scaffold-project` 或 init 相关

- [ ] `harness/manifests/scaffold-{plan,exec,close}.yaml` 与 workflow 四步对齐
- [ ] `init-lib.mjs` 在 `sync-manifest.yaml` 中
- [ ] `smoke:scaffold` + `smoke:external` 通过
- [ ] `docs/ops/external-project-lifecycle.md` 与 CLI 一致

### 改了 `skills/roles/*/SKILL.md`

- [ ] 产出路径 ⊆ manifest `during_write`
- [ ] 工作流位置与 workflow 某步 `skill:` 一致

### 改了 `harness/manifests/*.yaml`

- [ ] workflow 仍引用该 manifest
- [ ] `pnpm loop manifest <name>` 输出合理

### 改了 `docs/harness/` 或 `AGENTS.md`

- [ ] 与 L2/L3 无矛盾
- [ ] `pnpm loop doctor` 通过
