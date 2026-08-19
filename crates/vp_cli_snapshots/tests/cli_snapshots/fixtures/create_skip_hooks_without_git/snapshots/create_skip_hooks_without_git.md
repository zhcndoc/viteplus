# create_skip_hooks_without_git

## `vp create vite:application --directory app --package-manager pnpm --no-agent --no-editor`

拒绝初始化 Git 应跳过 pre-commit hooks 提示


## `vpt stat-file app/.vite-hooks/pre-commit --assert missing`

没有 Git 仓库时不应配置 pre-commit hooks

```
app/.vite-hooks/pre-commit: missing
```
