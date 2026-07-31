# 迁移_prettier_eslint_combo

## `vp migrate --no-interactive`

迁移应检测 ESLint 和 Prettier，并自动执行迁移

```
VITE+ - 面向 Web 的统一工具链

检测到 Prettier 配置。正在自动迁移到 Oxfmt...
◇ 已将 . 迁移到 Vite+ <版本>
• Node <版本>  pnpm <版本>
• 已应用 4 项配置更新
• 已将 ESLint 规则迁移到 Oxlint
• 已将 Prettier 迁移到 Oxfmt
```

## `vpt print-file package.json`

检查 eslint 和 prettier 是否已移除，脚本是否已重写

```
{
  "name": "migration-prettier-eslint-combo",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "lint": "vp lint .",
    "format": "vp fmt .",
    "format:check": "vp fmt --check .",
    "prepare": "vp config"
  },
  "devDependencies": {
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

## `vpt print-file pnpm-workspace.yaml`

检查 pnpm-workspace.yaml 是否包含 overrides 和 catalog

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
overrides:
  vite: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vpt stat-file eslint.config.mjs --assert-not file`

检查 eslint 配置是否已移除

```
eslint.config.mjs: missing
```

## `vpt stat-file .prettierrc.json --assert-not file`

检查 prettier 配置是否已移除

```
.prettierrc.json：缺失
```

## `vpt print-file vite.config.ts`

检查 oxlint 和 oxfmt 配置是否已合并到 vite.config.ts

```
import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
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
  fmt: {
    semi: true,
    singleQuote: true,
    printWidth: 80,
    sortPackageJson: false,
    ignorePatterns: [],
  },
});
```
