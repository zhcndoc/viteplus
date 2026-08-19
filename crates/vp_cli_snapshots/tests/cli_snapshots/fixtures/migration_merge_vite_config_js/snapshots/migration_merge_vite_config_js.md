# 迁移_合并_Vite_配置_JS

## `vp migrate --no-interactive`

迁移应合并 vite.config.js 并移除 oxlintrc

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 3 项配置更新
• 已使用 lazyPlugins 包装内联 Vite 插件，以支持 check/lint/fmt
```

## `vpt print-file vite.config.js`

检查 vite.config.js

```
import react from '@vitejs/plugin-react';
import { lazyPlugins } from 'vite-plus';

export default {
  staged: {
    "*": "vp check --fix"
  },
  fmt: {},
  lint: {
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
  plugins: lazyPlugins(() => [react()]),
}
```

## `vpt stat-file .oxlintrc.json --assert-not file`

检查 .oxlintrc.json 是否已删除

```
.oxlintrc.json: missing
```

## `vpt print-file package.json`

检查 package.json

```
{
  "scripts": {
    "dev": "vp dev --port 3000",
    "build": "vp build",
    "lint": "vp lint",
    "prepare": "vp config"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
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
