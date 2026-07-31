# 迁移_volta

## `vp migrate --no-interactive`

迁移应检测 package.json 中的 volta.node，并迁移到 .node-version

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
• 已将 Node 版本管理器文件迁移到 .node-version
→ 手动后续操作：
  - 从 package.json 中移除 "volta" 字段
```

## `vpt print-file .node-version`

检查 .node-version 是否由 volta.node 创建

```
20.19.0
```

## `vpt print-file package.json`

package.json 中保留了 volta 字段（未移除）

```
{
  "name": "migration-volta",
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "volta": {
    "node": "20.19.0",
    "npm": "10.2.5"
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
