# 迁移_保留_策略节点下方内容

## `vp migrate --no-interactive`

现有的 Vite+ 项目：低于支持范围的 Node 版本将被保留，不会升级（原生绑定支持 Node >=20）

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖：
    vite-plus  0.1.21 → <version>
    vite              → <version>
• 已配置包管理器设置
```

## `vpt print-file .node-version`

保持为 24.3.0

```
24.3.0
```

## `vpt print-file package.json`

engines.node 保持为 24.x，devEngines.runtime node 保持为 ^24（已保留，未提升）

```
{
  "name": "migration-preserve-below-policy-node-pins",
  "devDependencies": {
    "vite": "catalog:vite-stack",
    "vite-plus": "catalog:vite-stack"
  },
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    },
    "runtime": [
      {
        "name": "node",
        "version": "^24"
      }
    ]
  },
  "engines": {
    "node": "24.x"
  }
}
```

## `vpt print-file pnpm-workspace.yaml`

vite-stack catalog 已更新为迁移目标

```
packages:
  - .

catalogs:
  vite-stack:
    vite: npm:@voidzero-dev/vite-plus-core@<version>
    vite-plus: <version>
overrides:
  vite@*: catalog:vite-stack
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```
