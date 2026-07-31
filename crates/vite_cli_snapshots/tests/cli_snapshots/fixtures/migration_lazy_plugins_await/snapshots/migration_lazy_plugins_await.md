# 迁移_懒加载插件_等待

## `vp migrate --no-interactive --no-hooks`

迁移应使用 async lazyPlugins 包裹已等待的内联插件

```
VITE+ - The Unified Toolchain for the Web

◇ Migrated . to Vite+ <version>
• Node <version>  pnpm <version>
• 1 config update applied, 1 file had imports rewritten
• Inline Vite plugins wrapped with lazyPlugins for check/lint/fmt
```

## `vpt print-file vite.config.ts`

检查使用异步 `lazyPlugins` 的插件是否已使用 `await`

```
import react from '@vitejs/plugin-react';
import { defineConfig, lazyPlugins } from 'vite-plus';

async function loadPlugin() {
  return { name: 'loaded-plugin' };
}

export default defineConfig({
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
  plugins: lazyPlugins(async () => [react(), await loadPlugin()]),
});
```

## `vpt print-file package.json`

检查 package.json

```
{
  "name": "migration-lazy-plugins-await",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.2.0",
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "packageManager": "pnpm@10.33.2"
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
