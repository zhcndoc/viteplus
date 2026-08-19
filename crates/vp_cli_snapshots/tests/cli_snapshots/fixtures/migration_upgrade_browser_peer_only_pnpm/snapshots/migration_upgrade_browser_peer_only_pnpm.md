# 迁移_升级_仅浏览器对等依赖_pnpm

## `vp migrate --no-interactive`

仅 peer 的浏览器 provider 会与其所需的 peer 一同被提升

```
VITE+ - The Unified Toolchain for the Web

◇ Updated . to Vite+ <version>
• Node <version>  pnpm <version>
• Dependencies:
    vite-plus  latest → <version>
    vite              → <version>
• Package manager settings configured
```

## `vpt print-file package.json`

已安装 provider、Playwright 和包本地的 Vitest

```
{
  "name": "migration-upgrade-browser-peer-only-pnpm",
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:",
    "@vitest/browser-playwright": "catalog:",
    "playwright": "*",
    "vitest": "catalog:"
  },
  "peerDependencies": {
    "@vitest/browser-playwright": "^4.0.0"
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

提升后的提供程序保留共享的 Vitest 管理

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
  vitest: <version>
  '@vitest/browser-playwright': <version>
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

## `vp migrate --no-interactive`

已修复的项目不应再处于待处理状态

```
VITE+ - Web 的统一工具链

此项目已经在使用 Vite+！祝编码愉快！
```
