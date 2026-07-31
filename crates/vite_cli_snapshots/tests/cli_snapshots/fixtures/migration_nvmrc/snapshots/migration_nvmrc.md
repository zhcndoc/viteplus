# migration_nvmrc

## `vp migrate --no-interactive`

迁移应检测 `.nvmrc` 并自动迁移为 `.node-version`

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
• 已将 Node 版本管理器文件迁移为 .node-version
```

## `vpt print-file .node-version`

检查 .node-version 是否已创建并去除 v 前缀

```
25.8.2
```

## `vpt stat-file .nvmrc --assert-not file`

检查 .nvmrc 已被删除

```
.nvmrc: missing
```
