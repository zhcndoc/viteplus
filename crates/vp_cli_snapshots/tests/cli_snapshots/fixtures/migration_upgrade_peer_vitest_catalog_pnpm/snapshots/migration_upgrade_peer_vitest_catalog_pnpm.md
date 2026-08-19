# migration_upgrade_peer_vitest_catalog_pnpm

## `vp migrate --no-interactive`

必须先解析 peer catalog，才能清理由 Vite+ 管理的 Vitest catalog

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖：
    vite-plus  latest → <version>
    vite              → <version>
• 已配置包管理器设置
```

## `vpt print-file package.json`

peer 使用其解析后的公开范围，而不会直接获得 Vitest

```
{
  "name": "migration-upgrade-peer-vitest-catalog-pnpm",
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "peerDependencies": {
    "vitest": "^4.0.0"
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

未引用的受管理 Vitest catalog 已被移除

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
catalogs:
  test: {}
overrides:
  vite@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vp migrate --no-interactive`

修复后的项目不应再处于待处理状态

```
VITE+ - 面向 Web 的统一工具链

此项目已经在使用 Vite+！祝编码愉快！
```
