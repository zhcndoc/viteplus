# 迁移升级：仅适用于浏览器源码的 pnpm

## `vp migrate --no-interactive`

应恢复仅源代码浏览器提供程序

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖项：
    vite-plus        latest → <version>
    vite                    → <version>
    @vitest/browser  4.1.8  → <version>
• 已配置包管理器设置
```

## `vpt print-file package.json`

应存在 provider、框架 peer 和本地 vitest

```
{
  "name": "migration-upgrade-browser-source-only-pnpm",
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:",
    "@vitest/browser-playwright": "catalog:",
    "playwright": "*",
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

应存在共享的 vitest catalog 和 override

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
  vitest: <version>
  '@vitest/browser-playwright': <version>
overrides:
  vite: 'catalog:'
  vitest: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
    - vitest
  allowedVersions:
    vite: '*'
    vitest: '*'
```
