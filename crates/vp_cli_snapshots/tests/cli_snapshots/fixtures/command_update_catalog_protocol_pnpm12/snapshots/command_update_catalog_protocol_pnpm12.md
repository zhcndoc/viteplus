# command_update_catalog_protocol_pnpm12

pnpm 12 上的 #2309。pnpm 12 修复了上游的覆盖问题（裸覆盖键不再剥离 `catalog:` 导入器规范），因此这里固定了 vite-plus 写入的范围限定键在 pnpm 12 上也同样正确，而不只是 pnpm 9-11 的变通方案。

## `vp migrate --no-interactive --no-hooks --package-manager pnpm`

migrate 通过工作区 catalog 固定工具链

```
VITE+ - The Unified Toolchain for the Web

Formatting code...

Code formatted
◇ Migrated . to Vite+ <version>
• Node <version>  pnpm <version>
✓ Dependencies installed in <duration>
• 1 config update applied
```

## `vpt print-file pnpm-workspace.yaml`

在 pnpm 12 上也会写入范围限定的覆盖键

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
overrides:
  vite@*: "catalog:"
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: "*"
```

## `vp up`

update 不得将 catalog 引用解析掉（省略屏幕输出：pnpm 12 的更新摘要会报告一个随捆绑依赖图变化而反复变动的软件包数量差异）


## `vpt print-file package.json`

`vite` 保持为 `catalog:`

```
{
  "name": "command-update-catalog-protocol-pnpm12",
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "packageManager": "pnpm@12.0.0-rc.3"
}
```
