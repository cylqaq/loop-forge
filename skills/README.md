# Skills 索引

## round-cycle 链

```
loop-orchestrator → navigator → implementer → tester → reviewer → loop-orchestrator
```

## scaffold-project 链（Round 5 v2）

```
project-scaffold → implementer → tester → reviewer → loop-orchestrator
```

Workflow：`harness/workflows/scaffold-project.yaml`  
Manifests：`scaffold-plan` / `scaffold-exec` / `scaffold-close`

## 角色

| Skill | 路径 | 用途 |
|-------|------|------|
| loop-orchestrator | `roles/loop-orchestrator/` | 编排、CURRENT、Adjustment |
| navigator | `roles/navigator/` | 防雪球导航 |
| implementer | `roles/implementer/` | 实现 |
| tester | `roles/tester/` | 验证 |
| reviewer | `roles/reviewer/` | 对抗审查 |
| explorer | `roles/explorer/` | 只读探索 |
| project-scaffold | `roles/project-scaffold/` | 孵化子项目 |
| **skill-author** | `roles/skill-author/` | **设计/审查 SKILL.md（元技能）** |
| **domain-web-app** | `roles/domain-web-app/` | 全栈 Web 领域示例 |
| **daily-triage** | `roles/daily-triage/` | MCP 只读 GitHub Triage（阶段 1） |
| **pr-draft** | `roles/pr-draft/` | Draft PR 半自动（阶段 3，须人工 merge） |

Cursor 副本：`.cursor/skills/`（含 subagents 子目录）

## 自主阶梯与 Skill 映射

| 阶段 | Skill / Workflow |
|------|------------------|
| 1 只读 | `@daily-triage` |
| 2 草稿 | `ci-fix` workflow |
| 3 半自动 | `@pr-draft` |
| 4 全自动 | Round 6+（SDK） |

## 协议

- `guides/handoff-protocol.md`
- `guides/golden-rules.md`
- `guides/new-session-onboarding.md`

## 创建新 Skill

使用 `@skill-author`，遵循 Agent Skills 标准（agentskills.io）。
