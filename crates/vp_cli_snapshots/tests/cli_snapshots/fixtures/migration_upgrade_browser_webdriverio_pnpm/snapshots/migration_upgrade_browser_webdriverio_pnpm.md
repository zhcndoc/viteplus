# 迁移升级浏览器 WebdriverIO pnpm

## `vp migrate --no-interactive`

应恢复仅源代码的 WebdriverIO provider

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖项：
    vite-plus  最新版 → <version>
    vite              → <version>
• 已配置包管理器设置
```

## `vpt print-file package.json`

应存在 provider、webdriverio 和本地 vitest

```
{
  "name": "migration-upgrade-browser-webdriverio-pnpm",
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:",
    "@vitest/browser-webdriverio": "catalog:",
    "webdriverio": "*",
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

应启用驱动构建和共享的 vitest

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
  vitest: <version>
  '@vitest/browser-webdriverio': <version>
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
allowBuilds:
  edgedriver: true
  geckodriver: true
```
