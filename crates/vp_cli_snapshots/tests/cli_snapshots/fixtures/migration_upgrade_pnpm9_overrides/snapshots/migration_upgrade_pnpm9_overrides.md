# 迁移升级_pnpm9_覆盖配置

## `vp migrate --no-interactive`

pnpm 9.5-10.6.1：设置保留在 package.json 中，catalog 仍会从 wrappers 中重新生成

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖项：
    vite-plus            0.1.20 → <version>
    vite                        → <version>
    vitest               0.1.20 → <version>
    @vitest/coverage-v8  4.1.6  → <version>
• 包管理器设置已配置
```

## `vpt print-file package.json`

pnpm.overrides 保持为 catalog：（未内联为具体版本）

```
{
  "name": "migration-upgrade-pnpm9-overrides",
  "devDependencies": {
    "@vitest/coverage-v8": "catalog:",
    "vite": "catalog:",
    "vite-plus": "catalog:",
    "vitest": "catalog:"
  },
  "packageManager": "pnpm@9.15.9",
  "pnpm": {
    "overrides": {
      "vite": "catalog:",
      "vitest": "catalog:"
    },
    "peerDependencyRules": {
      "allowAny": [
        "vite",
        "vitest"
      ],
      "allowedVersions": {
        "vite": "*",
        "vitest": "*"
      }
    }
  }
}
```

## `vpt print-file pnpm-workspace.yaml`

catalog 已从 vite-plus-test 封装中重写；覆盖项仍保留在 package.json 中（< 10.6.2）

```
packages:
  - .

catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
  vitest: <version>
  '@vitest/coverage-v8': <version>
```
