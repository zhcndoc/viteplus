# migration_upgrade_deprecated_coverage_c8_npm

## `vp migrate --no-interactive`

已弃用的 coverage-c8 有独立的版本线

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  npm <version>
• 依赖项：
    vite-plus  最新版本 → <version>
    vite              → <version>
    vitest     4.1.8  → <version>
• 包管理器设置已配置
```

## `vpt print-file package.json`

coverage-c8 不得被重写为不存在的 Vitest 4 版本

```
{
  "name": "migration-upgrade-deprecated-coverage-c8-npm",
  "devDependencies": {
    "@vitest/coverage-c8": "^0.33.0",
    "vite-plus": "<version>",
    "vitest": "<version>"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vitest": "<version>"
  },
  "devEngines": {
    "packageManager": {
      "name": "npm",
      "version": "<version>",
      "onFail": "download"
    }
  }
}
```
