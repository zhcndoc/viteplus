# 迁移 ESLint 插件清理

## `vp migrate --no-interactive`

迁移应移除 ESLint、插件、配置、作用域、格式化程序和 ESLint 对等依赖

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <版本>
• Node <版本>  pnpm <版本>
• 已应用 4 项配置更新
• 已将 ESLint 规则迁移到 Oxlint
• 已为框架组件文件添加 TypeScript shim
```

## `vpt print-file package.json`

验证全面的 ESLint 生态系统清理

```
{
  "name": "migration-eslint-plugins-cleanup",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "lint": "vp lint .",
    "prepare": "vp config"
  },
  "devDependencies": {
    "@nuxt/kit": "^3.13.0",
    "@types/node": "^22.0.0",
    "@typescript-eslint/utils": "^8.0.0",
    "@vitejs/plugin-vue": "^6.0.0",
    "vite": "catalog:",
    "vue": "^3.5.0",
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

```
eslint.config.mjs: missing
```

## `vpt print-file vite.config.ts`

验证生成的 vite.config.ts

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
    "categories": {
      "correctness": "warn"
    },
    "env": {
      "builtin": true
    },
    "rules": {
      "no-unused-vars": "error",
      "vite-plus/prefer-vite-plus-imports": "error"
    },
    "options": {
      "typeAware": true,
      "typeCheck": true
    },
    "jsPlugins": [
      {
        "name": "vite-plus",
        "specifier": "vite-plus/oxlint-plugin"
      }
    ]
  },
});
```
