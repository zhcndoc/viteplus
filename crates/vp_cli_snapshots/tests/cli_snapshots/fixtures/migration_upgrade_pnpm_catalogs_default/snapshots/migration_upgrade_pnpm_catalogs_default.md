# 迁移_升级_pnpm_目录_默认值

## `vp migrate --no-interactive`

复用 catalogs.default 旁边受管理的命名目录

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖：
    vite-plus  0.1.20 → <version>
    vite              → <version>
• 已配置包管理器设置
```

## `vpt print-file package.json`

现有的 `catalog:build` 依赖引用得以保留

```
{
  "name": "migration-upgrade-pnpm-catalogs-default",
  "devDependencies": {
    "vite": "catalog:build",
    "vite-plus": "catalog:build"
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

`catalogs.default` 仍然是唯一的默认 catalog 定义

```
packages:
  - .

catalogs:
  build:
    vite: npm:@voidzero-dev/vite-plus-core@<version>
    vite-plus: <version>
  default:
    rari: ^0.14.12
overrides:
  vite@*: catalog:build
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vp migrate --no-interactive`

catalogs.default 迁移具有幂等性

```
VITE+ - 面向 Web 的统一工具链

此项目已在使用 Vite+！祝编码愉快！
```

## `vpt print-file package.json`

重新运行后 package.json 保持不变

```
{
  "name": "migration-upgrade-pnpm-catalogs-default",
  "devDependencies": {
    "vite": "catalog:build",
    "vite-plus": "catalog:build"
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

重新运行不会改变 catalog 的位置

```
packages:
  - .

catalogs:
  build:
    vite: npm:@voidzero-dev/vite-plus-core@<version>
    vite-plus: <version>
  default:
    rari: ^0.14.12
overrides:
  vite@*: catalog:build
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```
