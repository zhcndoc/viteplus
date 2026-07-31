# 迁移_bunfig_缺失

## `vp migrate --no-interactive`

迁移不会创建 bunfig.toml

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  bun <version>
• 已应用 2 项配置更新
```

## `vpt stat-file bunfig.toml --assert-not file`

检查 Bun 配置是否仍不存在

```
bunfig.toml: missing
```
