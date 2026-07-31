# 迁移带注释的 oxlintrc.json

## `vp migrate --no-interactive`

迁移应支持带有 JSONC 注释的 .oxlintrc.json

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 3 项配置更新
```

## `vpt print-file vite.config.ts`

检查 vite.config.ts

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
  fmt: {},
  lint: {
    "categories": {
      "correctness": "error"
    },
    "rules": {
      "no-console": "error",
      "vite-plus/prefer-vite-plus-imports": "error"
    },
    "globals": {},
    "ignorePatterns": [],
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

## `vpt stat-file .oxlintrc.json --assert-not file`

检查 .oxlintrc.json 是否已删除

```
.oxlintrc.json: missing
```

## `vpt print-file package.json`

检查 package.json

```
{
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
  },
  "scripts": {
    "prepare": "vp config"
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
