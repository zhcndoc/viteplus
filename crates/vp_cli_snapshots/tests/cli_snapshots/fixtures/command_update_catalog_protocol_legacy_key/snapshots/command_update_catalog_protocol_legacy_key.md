# command_update_catalog_protocol_legacy_key

#2309 修复路径。先执行 migrate，使 catalog 保存真实的 PINNED 工具链版本（reporter 的形态），然后将 override key 降级为修复前的裸拼写，这是由旧版 Vite+ 迁移的项目仍会携带的形式。

## `vp migrate --no-interactive --no-hooks --package-manager pnpm`

migrate 通过 workspace catalog 固定工具链

```
VITE+ - The Unified Toolchain for the Web

Formatting code...

Code formatted
◇ Migrated . to Vite+ <version>
• Node <version>  pnpm <version>
✓ Dependencies installed in <duration>
• 1 config update applied
```

## `vpt replace-file-content pnpm-workspace.yaml vite@*: vite:`

将 override key 回退为修复前 #2309 的裸拼写（如果 migrate 已停止写入带范围的 key，则会失败）


## `vpt print-file pnpm-workspace.yaml`

修复前的形态：在精确固定的 catalog alias 上使用裸 override key

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
overrides:
  vite: "catalog:"
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: "*"
```

## `vp up`

没有需要更新的内容，但裸 key 仍会将 catalog 引用解析掉

```
✓ Lockfile passes supply-chain policies (verified <duration> ago)
Already up to date

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

`vite` 的固定 alias 丢失了 `catalog:`；`vite-plus`（没有 override）保留了它

```
{
  "name": "command-update-catalog-protocol-legacy-key",
  "private": true,
  "devDependencies": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vite-plus": "catalog:"
  },
  "packageManager": "pnpm@11.20.0"
}
```

## `vp migrate --no-interactive --no-hooks`

裸 key 会被读取为待处理项，因此执行一次 migrate 即可修复

```
VITE+ - The Unified Toolchain for the Web

Formatting code...

Code formatted
◇ Updated . to Vite+ <version>
• Node <version>  pnpm <version>
✓ Dependencies installed in <duration>
• Package manager settings configured
```

## `vpt print-file pnpm-workspace.yaml`

裸 key 被带范围的 key 替换

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

现在更新对 catalog 引用不产生任何影响

```
✓ Lockfile passes supply-chain policies (verified <duration> ago)
Already up to date

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

`vite` 在更新过程中保持为 `catalog:`

```
{
  "name": "command-update-catalog_protocol-legacy-key",
  "private": true,
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "packageManager": "pnpm@11.20.0"
}
```
