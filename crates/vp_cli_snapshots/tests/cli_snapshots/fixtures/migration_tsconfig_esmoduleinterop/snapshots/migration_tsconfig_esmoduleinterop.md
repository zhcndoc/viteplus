# 迁移_tsconfig_esmoduleinterop

## `vp migrate --no-interactive`

应从 tsconfig.json 中移除 esModuleInterop: false

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 4 项配置更新
! 警告：
  - 已从 tsconfig.json 中移除 `"esModuleInterop": false` — 此选项已弃用。请参阅 https://github.com/oxc-project/tsgolint/issues/351、https://github.com/microsoft/TypeScript/issues/62529
  - 已从 tsconfig.json 中移除 `"allowSyntheticDefaultImports": false` — 此选项已弃用。请参阅 https://github.com/oxc-project/tsgolint/issues/351、https://github.com/microsoft/TypeScript/issues/62529
```

## `vpt print-file tsconfig.json`

验证已移除 esModuleInterop: false

```
{
  "compilerOptions": {
    "target": "ES2023",
    "module": "ESNext",
    "strict": true
  }
}
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
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
});
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
