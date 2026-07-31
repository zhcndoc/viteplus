# migration_eslint_rerun_mjs

## `vp migrate --no-interactive`

应检测 vite-plus + eslint 并自动迁移 eslint

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

检查是否已从 devDependencies 中移除 eslint，并重写 scripts

```
{
  "name": "migration-eslint-rerun-mjs",
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

## `vpt print-file vite.config.mjs`

检查 oxlint 配置是否已合并到现有的 vite.config.mjs 中（而不是创建 vite.config.ts）

```
import { defineConfig } from 'vite-plus';

export default defineConfig({});
```
