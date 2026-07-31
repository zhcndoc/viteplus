# 迁移_eslint_js插件_保留

## `vp migrate --no-interactive`

通过 lint.jsPlugins 引用的插件必须在清理和清理规范化过程中保留

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 4 项配置更新
• 已将 ESLint 规则迁移至 Oxlint
```

## `vpt print-file package.json`

eslint-plugin-survives 保留在 devDependencies 中（eslint 本身已移除）

```
{
  "name": "migration-eslint-jsplugins-preserve",
  "scripts": {
    "lint": "vp lint .",
    "prepare": "vp config"
  },
  "devDependencies": {
    "eslint-plugin-survives": "^1.0.0",
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

## `vpt print-file vite.config.ts`

lint.jsPlugins 保留 `eslint-plugin-survives`；lint.rules 保留 `survives/no-fiction`

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
  fmt: {},
  lint: {
    "plugins": [
      "oxc",
      "typescript",
      "unicorn",
      "react"
    ],
    "jsPlugins": [
      "eslint-plugin-survives",
      {
        "name": "vite-plus",
        "specifier": "vite-plus/oxlint-plugin"
      }
    ],
    "categories": {
      "correctness": "warn"
    },
    "env": {
      "builtin": true
    },
    "rules": {
      "survives/no-fiction": "warn",
      "vite-plus/prefer-vite-plus-imports": "error"
    },
    "options": {
      "typeAware": true,
      "typeCheck": true
    }
  },
});
```
