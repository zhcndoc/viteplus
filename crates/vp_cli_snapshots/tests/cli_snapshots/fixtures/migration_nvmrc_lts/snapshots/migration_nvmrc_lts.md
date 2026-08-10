# 迁移_nvmrc_lts

## `vp migrate --no-interactive`

迁移应检测带有 lts 别名的 .nvmrc 并自动执行迁移

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
• Node 版本管理器文件已迁移为 .node-version
```

## `vpt print-file .node-version`

检查 lts 别名是否保持不变

```
lts/iron
```

## `vpt stat-file .nvmrc --assert-not file`

检查 .nvmrc 是否已删除

```
.nvmrc: missing
```
