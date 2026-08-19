# 迁移_vitest_对等依赖

## `vp migrate --no-interactive`

存在 vitest-browser-svelte 时，应将 vitest 添加到 devDeps

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
```

## `vpt print-file package.json`

vitest 应位于 devDependencies 中

```
{
  "name": "migration-vitest-peer-dep",
  "scripts": {
    "dev": "vp dev",
    "build": "vp build",
    "test": "vp test",
    "prepare": "vp config"
  },
  "devDependencies": {
    "vite": "catalog:",
    "vitest-browser-svelte": "^2.1.0",
    "vite-plus": "catalog:",
    "vitest": "catalog:"
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

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vitest: <version>
  vite-plus: <version>
overrides:
  vite@*: 'catalog:'
  vitest@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
    - vitest
  allowedVersions:
    vite: '*'
    vitest: '*'
```
