# migration_eslint_rerun

## `vp migrate --no-interactive`

应检测 vite-plus + eslint，并自动迁移 eslint

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖：
    vite-plus  latest → <version>
    vite              → <version>
• 已配置包管理器设置
• 已跳过编辑器、钩子和 lint 设置。运行 `vp migrate --full` 以应用这些设置。
```

## `vpt print-file package.json`

检查 eslint 已从 devDependencies 中移除，并且 scripts 已重写

```
{
  "name": "migration-eslint-rerun",
  "scripts": {
    "lint": "eslint ."
  },
  "devDependencies": {
    "eslint": "^9.0.0",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  }
}
```

## `vpt stat-file eslint.config.mjs --assert-not file`

检查 eslint 配置是否已移除

**退出代码：** 1

```
eslint.config.mjs: file
stat-file assertion failed
```

## `vpt print-file vite.config.ts`

检查已合并到 vite.config.ts 中的 oxlint 配置

**退出代码：** 1

```
vite.config.ts: not found
missing file
```
