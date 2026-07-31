# 迁移升级过时的本地 pnpm

## `node setup-local.mjs`


## `vp migrate --no-interactive`

较新的全局 CLI 必须绕过已安装的过时本地 CLI

```
VITE+ - 面向 Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  pnpm <version>
• 依赖：
    vite-plus  0.1.24 → <version>
    vite              → <version>
• 已配置包管理器设置
```

## `vpt print-file package.json`

过时的包装器依赖和普通的 vite-plus 版本范围应被修复；空的 pnpm 字段应被移除

```
{
  "name": "migration-upgrade-stale-local-pnpm",
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

pnpm 设置应集中于此处

```
overrides:
  vite: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
```
