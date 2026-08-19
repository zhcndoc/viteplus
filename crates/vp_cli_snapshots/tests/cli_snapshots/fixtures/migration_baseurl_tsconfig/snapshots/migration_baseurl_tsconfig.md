# 迁移_baseurl_tsconfig

## `vpt chmod +x fix-baseurl.mjs`

设置 baseUrl 修复器

```
```

## `vp migrate --no-interactive`

迁移应自动修复 tsconfig baseUrl

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 3 项配置更新
```

## `vpt print-file vite.config.ts`

检查 vite.config.ts 是否包含 typeAware 和 typeCheck

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
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
});
```

## `vpt print-file tsconfig.json`

检查 baseUrl 是否已被移除

```
{
  "compilerOptions": {
    // JSONC 注释不应阻止检测 baseUrl。
    "target": "ES2023",
    "module": "NodeNext"
  }
}
```

## `vpt stat-file .oxlintrc.json --assert-not file`

检查 .oxlintrc.json 是否已被移除

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
  vite@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```
