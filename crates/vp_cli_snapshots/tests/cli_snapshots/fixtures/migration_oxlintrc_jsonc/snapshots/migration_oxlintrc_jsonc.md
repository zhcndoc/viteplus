# migration_oxlintrc_jsonc

## `vp migrate --no-interactive`

迁移应检测 .oxlintrc.jsonc 和 .oxfmtrc.jsonc

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 4 项配置更新
```

## `vpt print-file vite.config.ts`

检查 vite.config.ts

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
  fmt: {
    "printWidth": 100,
    "tabWidth": 2,
    "semi": true,
    "singleQuote": true,
    "trailingComma": "es5",
  },
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
});
```

## `vpt stat-file .oxlintrc.jsonc --assert-not file`

检查 .oxlintrc.jsonc 是否已删除

```
.oxlintrc.jsonc: missing
```

## `vpt stat-file .oxfmtrc.jsonc --assert-not file`

检查 .oxfmtrc.jsonc 是否已删除

```
.oxfmtrc.jsonc: missing
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
