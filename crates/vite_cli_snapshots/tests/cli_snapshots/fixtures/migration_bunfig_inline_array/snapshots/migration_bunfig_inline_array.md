# 迁移_bunfig_内联数组

## `vp migrate --no-interactive`

迁移会保留现有 bunfig.toml 中的内联数组

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  bun <version>
• 已应用 2 项配置更新
```

## `vpt print-file bunfig.toml`

检查 Bun 配置未发生变化

```
[install]
minimumReleaseAge = 259200
minimumReleaseAgeExcludes = ["@zerobyte/*"]
```
