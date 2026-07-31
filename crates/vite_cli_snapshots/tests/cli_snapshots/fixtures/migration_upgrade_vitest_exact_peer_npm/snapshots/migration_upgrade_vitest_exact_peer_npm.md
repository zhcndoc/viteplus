# 迁移_升级_vitest_精确_对等依赖_npm

## `vp migrate --no-interactive`

精确版本的 @vitest 对等依赖要求包本地安装 vitest

```
VITE+ - The Unified Toolchain for the Web

◇ Updated . to Vite+ <version>
• Node <version>  npm <version>
• Dependencies:
    vite-plus            latest → <version>
    vite                        → <version>
    vitest               latest → <version>
    @vitest/coverage-v8  4.1.8  → <version>
    @vitest/ui           4.1.8  → <version>
    @vitest/utils        4.1.8  → <version>
    @vitest/web-worker   4.1.8  → <version>
• Package manager settings configured
```

## `vpt print-file package.json`

生态系统软件包和 vitest 应与捆绑版本保持一致

```
{
  "name": "migration-upgrade-vitest-exact-peer-npm",
  "devDependencies": {
    "@vitest/coverage-v8": "<version>",
    "@vitest/eslint-plugin": "^1.6.0",
    "@vitest/ui": "<version>",
    "@vitest/utils": "<version>",
    "@vitest/web-worker": "<version>",
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
