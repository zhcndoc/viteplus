# create_approve_builds_migrate_pnpm11

## `vp create @your-org:with-build-dep --no-interactive --approve-builds --directory approved-app`

模板自带 Prettier，因此 create 会在主安装之前先安装并迁移；受限构建（core-js）仍然必须被提示并批准

```

检测到工作区包中存在 Prettier，但未找到根配置。包级 Prettier 必须手动迁移。
◇ 已生成 approved-app
• Node <version>  pnpm <version>
✓ 依赖已安装，耗时 <duration>
→ 下一步：cd approved-app && vp run
```

## `vpt print-file approved-app/pnpm-workspace.yaml`

尽管迁移预安装存在，仍在 allowBuilds 下记录了批准

```
allowBuilds:
  core-js: true
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

## `vp create @your-org:with-build-dep --no-interactive --directory default-app`

default run 会展示带有指导信息的受限构建，但保持未批准状态

```

在工作区包中检测到 Prettier，但未找到根配置。包级 Prettier 必须手动迁移。

未运行以下依赖的构建脚本：core-js。

这些依赖在构建完成前可能无法正常工作。在项目中运行 vp pm approve-builds 以批准它们，或者使用 --approve-builds 重新创建。

◇ 已搭建 default-app
• Node <version>  pnpm <version>
✓ 依赖已安装，用时 <duration>
→ 下一步：cd default-app && vp run
```

## `vpt print-file default-app/pnpm-workspace.yaml`

没有 allowBuilds，因此未运行构建

```
allowBuilds:
  core-js: 将此设置为 true 或 false
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

## `cd default-app && vp pm approve-builds core-js`

该指南中的 `vp pm approve-builds` 命令用于批准受限构建

```
node_modules/.pnpm/core-js@3.39.0/node_modules/core-js: Running postinstall script, done in <duration>
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
  vite: "catalog:"
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: "*"
```
