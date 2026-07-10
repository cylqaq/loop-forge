# Golden Rules（门禁）

1. **验证优先** — `pnpm verify` 为唯一完成判定
2. **状态落盘** — CURRENT + loop-state + DECISIONS
3. **窄目标** — 每轮 Intent 可测量
4. **最小 diff** — 可逆变更
5. **母版不堆业务** — 子项目隔离
6. **并行 worktree** — 避免文件冲突
7. **Loop 安全栓** — 连续失败 3 次 → blocked
