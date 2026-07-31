# 迁移_无钩子

## `git init`


## `vp migrate --no-hooks --no-interactive`

使用 --no-hooks 进行迁移时应跳过 hooks 设置

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 1 项配置更新
```

## `vpt print-file package.json`

检查 package.json 中没有 prepare 脚本和 lint-staged 配置

```
{
  "name": "migration-no-hooks",
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

检查 pnpm-workspace.yaml 是否包含 overrides 和 catalog

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
overrides:
  vite: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vpt stat-file .vite-hooks --assert-not dir`

使用 --no-hooks 时不存在 .vite-hooks 目录

```
.vite-hooks: missing
```
