# command_update_catalog_protocol_pnpm

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

## `vpt print-file package.json`

迁移后的项目引用了 catalog

```
{
  "name": "command-update-catalog-protocol-pnpm",
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "packageManager": "pnpm@11.20.0"
}
```

## `vp up`

#2309：update 不得将 catalog 引用解析掉

```
✓ Lockfile passes supply-chain policies (verified <duration> ago)
Already up to date

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

`vite` 保持为 `catalog:`，而不是具体的 core 别名

```
{
  "name": "command-update-catalog-protocol-pnpm",
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "packageManager": "pnpm@11.20.0"
}
```

## `vpt print-file pnpm-workspace.yaml`

catalog 继续负责存储解析后的工具链版本

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
