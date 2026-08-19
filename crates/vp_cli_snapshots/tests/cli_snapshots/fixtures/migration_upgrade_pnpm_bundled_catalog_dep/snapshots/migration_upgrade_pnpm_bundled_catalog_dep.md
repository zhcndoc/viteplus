# migration_upgrade_pnpm_bundled_catalog_dep

## `vp migrate --no-interactive`

现有的 Vite+ pnpm 项目通过 catalog 声明了捆绑工具（oxlint/oxlint-tsgolint/oxfmt/tsdown）：

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖：
    vite-plus  0.1.20 → <version>
    vite              → <version>
• 已配置包管理器设置
```

## `vpt print-file package.json`

捆绑的工具已被移除（vite-plus 提供这些工具），因此不会残留无效的 catalog: 引用

```
{
  "name": "migration-upgrade-pnpm-bundled-catalog-dep",
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
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

相同的捆绑工具会从 catalog 中移除，从而保持 package.json 与 catalog 一致

```
packages:
  - .

catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
overrides:
  vite@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```
