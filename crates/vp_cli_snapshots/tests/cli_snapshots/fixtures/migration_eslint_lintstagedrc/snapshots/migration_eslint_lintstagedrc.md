# 迁移_eslint_lintstagedrc

## `vp migrate --no-interactive`

迁移应检测 ESLint 并自动迁移，包括 lintstagedrc

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 5 项配置更新
• 已将 ESLint 规则迁移至 Oxlint
```

## `vpt print-file package.json`

检查 eslint 是否已移除，以及 scripts 是否已重写

```
{
  "name": "migration-eslint-lintstagedrc",
  "scripts": {
    "lint": "vp lint .",
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
  vite@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vpt stat-file .lintstagedrc.json --assert-not file`

检查 lintstagedrc.json 是否已删除

```
.lintstagedrc.json: missing
```

## `vpt print-file vite.config.ts`

检查已合并到 vite.config.ts 中的 oxlint 配置

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
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
  staged: {
    "*.ts": "vp lint --fix"
  },
});
```
