# migration_prettier_rerun

## `vp migrate --no-interactive`

应检测 vite-plus + prettier 并自动迁移 prettier

```
VITE+ - The Unified Toolchain for the Web

◇ Updated . to Vite+ <version>
• Node <version>  pnpm <version>
• Dependencies:
    vite-plus  latest → <version>
    vite              → <version>
• Package manager settings configured
• Skipped editor, hooks, and lint setup. Run `vp migrate --full` to apply them.
```

## `vpt print-file package.json`

检查 prettier 已从 devDependencies 中移除，且 scripts 已重写

```
{
  "name": "migration-prettier-rerun",
  "scripts": {
    "format": "prettier --write ."
  },
  "devDependencies": {
    "prettier": "^3.0.0",
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

## `vpt stat-file .prettierrc.json --assert-not file`

检查 prettier 配置是否已移除

**退出代码：** 1

```
.prettierrc.json: file
stat-file assertion failed
```

## `vpt print-file vite.config.ts`

检查已合并到 vite.config.ts 中的 oxfmt 配置

**退出代码：** 1

```
vite.config.ts：未找到
缺少文件
```
