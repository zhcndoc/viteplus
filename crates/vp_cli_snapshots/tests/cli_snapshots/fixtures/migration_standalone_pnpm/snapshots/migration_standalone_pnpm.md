# 迁移_standalone_pnpm

## `vp migrate --no-interactive --no-hooks --package-manager pnpm`

迁移应支持 pnpm，将 overrides 和 peerDependencyRules 写入 pnpm-workspace.yaml

```
VITE+ - 面向 Web 的统一工具链

正在格式化代码...

代码格式化完成
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
✓ 已安装依赖，耗时 <duration>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

检查 package.json 中没有 pnpm 部分

```
{
  "name": "migration-standalone-pnpm",
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "packageManager": "pnpm@10.33.2"
}
```

## `vpt print-file pnpm-workspace.yaml`

检查 pnpm-workspace.yaml 是否包含 overrides、peerDependencyRules 和 catalog

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
