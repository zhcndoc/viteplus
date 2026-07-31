# migration_upgrade_vitest_non_runtime_only_npm

## `vp migrate --no-interactive`

非运行时的 @vitest 软件包不得固定 vitest 版本

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  npm <version>
• 依赖项：
    vite-plus          最新 → <version>
    vite                      → <version>
    @vitest/utils      4.1.8  → <version>
    @vitest/ws-client  4.1.8  → <version>
• 已配置软件包管理器设置
```

## `vpt print-file package.json`

内部软件包版本对齐，eslint 插件保持独立，移除 vitest

```
{
  "name": "migration-upgrade-vitest-non-runtime-only-npm",
  "devDependencies": {
    "@vitest/eslint-plugin": "^1.6.0",
    "@vitest/utils": "<version>",
    "@vitest/ws-client": "<version>",
    "vite-plus": "<version>"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>"
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
