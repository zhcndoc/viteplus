# 迁移 ESLint 类型感知模式

## `vp migrate --no-interactive`

迁移应保留类型感知的覆盖率

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 4 项配置更新
• 已将 ESLint 规则迁移到 Oxlint
```

## `vpt print-file package.json`

检查 typescript-eslint 和 @typescript-eslint/* 已被移除；typescript 仍然保留

```
{
  "name": "migration-eslint-type-aware",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "lint": "vp lint .",
    "prepare": "vp config"
  },
  "devDependencies": {
    "typescript": "^5.6.0",
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

检查 lint 块中是否设置了 options.typeAware/typeCheck = true

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
