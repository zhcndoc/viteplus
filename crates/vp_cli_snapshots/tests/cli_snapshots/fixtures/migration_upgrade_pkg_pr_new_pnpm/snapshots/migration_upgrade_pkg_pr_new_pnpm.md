# migration_upgrade_pkg_pr_new_pnpm

## `vp migrate --no-interactive`

桥接提交构建升级，如同普通的 npm 版本升级

```
VITE+ - Web 的统一工具链

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

直接依赖项使用与桥接构建相匹配的 catalog

```
{
  "name": "migration-upgrade-pkg-pr-new-pnpm",
  "devDependencies": {
    "@vitest/coverage-v8": "catalog:",
    "vite": "catalog:",
    "vite-plus": "catalog:",
    "vitest": "catalog:"
  },
  "packageManager": "pnpm@10.33.2"
}
```

## `vpt print-file pnpm-workspace.yaml`

catalog 中保存不可变的提交版本

```
packages:
  - .

blockExoticSubdeps: true

catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
  vitest: <version>
  '@vitest/coverage-v8': <version>

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

## `vp migrate --no-interactive`

桥接提交迁移是幂等的

```
VITE+ - Web 的统一工具链

此项目已经在使用 Vite+！祝编码愉快！
```

## `vpt print-file package.json`

重新运行后 package.json 保持不变

```
{
  "name": "migration-upgrade-pkg-pr-new-pnpm",
  "devDependencies": {
    "@vitest/coverage-v8": "catalog:",
    "vite": "catalog:",
    "vite-plus": "catalog:",
    "vitest": "catalog:"
  },
  "packageManager": "pnpm@10.33.2"
}
```

## `vpt print-file pnpm-workspace.yaml`

重新运行后 catalog 保持不变

```
packages:
  - .

blockExoticSubdeps: true

catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
  vitest: <version>
  '@vitest/coverage-v8': <version>

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
