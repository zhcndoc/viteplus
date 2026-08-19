# 迁移_升级_单仓库_vitest_本地化_pnpm

## `vp migrate --no-interactive`

现有的 Vite+ 工作区包应进行协调

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖：
    vite-plus  最新版本 → <version>
    vite              → <version>
• 已配置包管理器设置
```

## `vpt print-file package.json`

根目录不应直接获得 vitest 依赖

```
{
  "name": "migration-upgrade-monorepo-vitest-localized-pnpm",
  "private": true,
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

## `vpt print-file packages/app/package.json`

只有对等消费者应获得本地 vitest

```
{
  "name": "app",
  "devDependencies": {
    "@vitest/ui": "catalog:",
    "vite": "catalog:",
    "vite-plus": "catalog:",
    "vitest": "catalog:"
  }
}
```

## `vpt print-file pnpm-workspace.yaml`

使用该配置的包中应存在共享的 Vitest 配置

```
packages:
  - packages/*
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
  vitest: <version>
  '@vitest/ui': <version>
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
