# 将 monorepo 迁移至 pnpm overrides 依赖选择器

## `vp migrate --no-interactive`

迁移应将 pnpm overrides 与依赖选择器合并

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新，已重写 1 个文件中的导入
• 已使用 lazyPlugins 包装内联 Vite 插件，以支持检查/ lint / fmt
```

## `vpt print-file vite.config.ts`

检查 vite.config.ts

```
import react from '@vitejs/plugin-react';
import { defineConfig, lazyPlugins } from 'vite-plus';

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
  plugins: lazyPlugins(() => [react()]),
});
```

## `vpt print-file package.json`

检查 package.json

```
{
  "name": "migration-monorepo-pnpm-overrides-dependency-selector",
  "version": "1.0.0",
  "scripts": {
    "dev": "vp dev",
    "prepare": "vp config"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "catalog:",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "packageManager": "pnpm@10.20.0+sha512.cf9998222162dd85864d0a8102e7892e7ba4ceadebbf5a31f9c2fce48dfce317a9c53b9f6464d1ef9042cba2e02ae02a9f7c143a2b438cd93c91840f0192b9dd"
}
```

## `vpt print-file pnpm-workspace.yaml`

检查 pnpm-workspace.yaml

```
packages:
  - packages/*

catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>

overrides:
  supertest>superagent: 9.0.2
  react-click-away-listener>react: 0.0.0-experimental-7dc903cd-20251203
  vite@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vpt print-file packages/app/package.json`

检查 app package.json

```
{
  "name": "app",
  "scripts": {
    "dev": "vp dev --port 3000",
    "build": "vp build"
  },
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "optionalDependencies": {
    "test-vite-plus-other-optional": "1.0.0"
  }
}
```
