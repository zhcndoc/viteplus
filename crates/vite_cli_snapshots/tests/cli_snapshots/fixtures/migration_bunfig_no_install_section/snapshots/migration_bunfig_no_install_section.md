# 迁移_bunfig_无安装部分

## `vp migrate --no-interactive`

迁移会保留不含 install 部分的 bunfig.toml

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  bun <version>
• 已应用 2 项配置更新
```

## `vpt print-file bunfig.toml`

检查 Bun 配置未发生变化

```
[run]
shell = "bun"
```
