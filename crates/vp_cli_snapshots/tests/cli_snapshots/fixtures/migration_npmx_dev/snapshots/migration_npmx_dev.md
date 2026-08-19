# 迁移_npmx_开发

## `vp migrate --no-interactive`

npmx.dev 形态：现有的 Vite+ 升级，具体的 @vitest/* 应移入 catalog

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖项：
    vite-plus  最新版本 → <version>
    vite              → <version>
• 已配置包管理器设置
```

## `vpt print-file package.json`

@vitest/browser-playwright 和 @vitest/coverage-v8 应改为使用 catalog：

```
{
  "name": "npmx",
  "private": true,
  "devDependencies": {
    "@vitest/browser-playwright": "catalog:",
    "@vitest/coverage-v8": "catalog:",
    "playwright": "1.60.0",
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

默认目录应统一管理对齐的 @vitest/* 软件包

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
