# 个人 GitHub 发布

> 仓库：`https://github.com/cylqaq/loop-forge.git`（个人账号，与公司 Git 分离）

## 凭证

本机需已配置 Git 凭据或 SSH 密钥。可选：

```powershell
gh auth login   # 可选，用于 gh pr 等
```

## 分支与推送

见 [`branch-strategy.md`](./branch-strategy.md)。

```powershell
git remote add origin https://github.com/cylqaq/loop-forge.git
git push -u origin main
git push -u origin develop
```

## 注意

- 勿提交 `state/loop-state.json`、`.env`、含密钥的 `mcp.json`
- 孵化的 `projects/*`（除 `_template`）不入母版库
