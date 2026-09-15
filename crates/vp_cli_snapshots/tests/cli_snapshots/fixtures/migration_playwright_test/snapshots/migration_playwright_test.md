# migration_playwright_test

## `vp migrate --no-interactive`

现有 Vite+ 升级：@playwright/test 应保持不变，不添加直接的 Playwright 依赖

```
VITE+ - The Unified Toolchain for the Web

◇ Updated . to Vite+ <version>
• Node <version>  pnpm <version>
• Dependencies:
    vite-plus                   latest → <version>
    vite                               → <version>
    vitest                      4.1.10 → <version>
    @vitest/browser-playwright  4.1.10 → <version>
    @vitest/coverage-v8         4.1.10 → <version>
• Package manager settings configured
```

## `vpt print-file package.json`

@vitest/browser-playwright 和 @vitest/coverage-v8 应变为 catalog：

```
{
  "name": "playwright-test-app",
  "private": true,
  "devDependencies": {
    "@playwright/test": "1.60.0",
    "@vitest/browser-playwright": "catalog:",
    "@vitest/coverage-v8": "catalog:",
    "vite": "catalog:",
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

默认 catalog 应管理版本对齐的 @vitest/* 软件包

```
packages:
  - .
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
  vitest: <version>
  '@vitest/browser-playwright': <version>
  '@vitest/coverage-v8': <version>
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
