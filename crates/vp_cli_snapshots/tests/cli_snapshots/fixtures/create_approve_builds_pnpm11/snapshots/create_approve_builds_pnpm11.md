# create_approve_builds_pnpm11

## `vp create @your-org:with-build-dep --no-interactive --approve-builds --directory approved-app`

--approve-builds 会自动批准并运行受限的构建脚本（core-js）

```
◇ 已生成 approved-app
• Node <version>  pnpm <version>
✓ 依赖已安装，耗时 <duration>
→ 下一步：cd approved-app && vp run
```

## `vpt print-file approved-app/pnpm-workspace.yaml`

已在 allowBuilds 下记录批准

```
allowBuilds:
  core-js: true
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

## `vp create @your-org:with-build-dep --no-interactive --directory default-app`

默认运行会展示受限的构建并提供指导，但不会将其标记为已批准

```

未为以下包运行构建脚本：core-js。

这些依赖在构建完成之前可能无法正常工作。请在项目中运行 vp pm approve-builds 以批准它们，或者使用 --approve-builds 重新创建。
◇ 已生成 default-app
• Node <version>  pnpm <version>
✓ 依赖已安装，用时 <duration>
→ 下一步：cd default-app && vp run
```

## `vpt print-file default-app/pnpm-workspace.yaml`

没有 allowBuilds，因此未运行构建

```
allowBuilds:
  core-js: 将其设置为 true 或 false
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

## `cd default-app && vp pm approve-builds core-js`

指导信息中的 `vp pm approve-builds` 命令会批准受限构建

```
node_modules/.pnpm/core-js@3.39.0/node_modules/core-js: 正在运行 postinstall 脚本，已在 <duration> 内完成
```

## `vpt print-file default-app/pnpm-workspace.yaml`

core-js 现在已被允许加入 allowBuilds

```
allowBuilds:
  core-js: true
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
