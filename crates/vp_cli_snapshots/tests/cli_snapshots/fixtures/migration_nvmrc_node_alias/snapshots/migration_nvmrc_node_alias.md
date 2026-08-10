# 迁移_nvmrc_node_别名

## `vp migrate --no-interactive`

'node' 别名应映射到 lts/*，并显示信息提示

```
VITE+ - 面向 Web 的统一工具链

.nvmrc 中的 "node" 不是特定版本；已自动映射到 "lts/*"
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
• Node 版本管理器文件已迁移到 .node-version
```

## `vpt print-file .node-version`

检查 node 别名是否映射到 lts/*

```
lts/*
```

## `vpt stat-file .nvmrc --assert-not file`

检查 .nvmrc 是否已删除

```
.nvmrc: missing
```
