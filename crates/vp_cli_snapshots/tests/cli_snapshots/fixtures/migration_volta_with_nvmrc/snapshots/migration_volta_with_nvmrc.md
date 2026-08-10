# 使用 nvmrc 迁移 Volta

## `vp migrate --no-interactive`

`.nvmrc` 应优先于 `volta.node`

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
• Node 版本管理器文件已迁移至 .node-version
→ 手动后续操作：
  - 从 package.json 中移除 "volta" 字段
```

## `vpt print-file .node-version`

检查 .node-version 来自 .nvmrc（v20.19.0），而不是 volta.node（18.0.0）

```
20.19.0
```

## `vpt stat-file .nvmrc --assert-not file`

检查 .nvmrc 是否已删除

```
.nvmrc: missing
```

## `vpt print-file package.json`

volta 字段必须保持不变

```
{
  "name": "migration-volta-with-nvmrc",
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "volta": {
    "node": "18.0.0",
    "npm": "9.0.0"
  },
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  },
  "scripts": {
    "prepare": "vp config"
  }
}
```
