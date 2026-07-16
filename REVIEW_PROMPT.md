# Loop Forge · 对抗性代码审查

> Reviewer 子代理专用。目标：**质疑，而非认可**。

## 审查范围

- 本轮 CURRENT 占位目标
- git diff（或指定文件列表）

## 检查清单

### 1. 验证（必须）

- [ ] `pnpm verify` 退出码 0
- [ ] `pnpm smoke:all` 退出码 0（若改了 harness）
- [ ] `pnpm loop workflow validate`（若改了 workflow/manifest）

### 2. Loop Engineering 一致性

- [ ] 五阶段是否走完（尤其 Observation 非自评）
- [ ] CURRENT.md 是否更新
- [ ] 新原则是否写入冷 ADR + 热账本一行（非静默覆盖）

### 3. 边界

- [ ] 无母版业务代码污染
- [ ] 无 git config 修改
- [ ] 无密钥入库
- [ ] state/loop-state.json 未误提交

### 4. 架构

- [ ] 五层联动契约已对照
- [ ] AGENTS.md 仍薄入口

## 输出

**APPROVED** — 仅当全部硬性项通过

**REJECTED** — 列出具体项 + 文件路径 + 建议修复
