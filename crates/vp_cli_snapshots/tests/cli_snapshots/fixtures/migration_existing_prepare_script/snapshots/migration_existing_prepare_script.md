# migration_existing_prepare_script

## `git init`


## `vp migrate --no-interactive`

迁移应将 vp 配置与现有的 prepare 脚本组合

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <版本>
• Node <版本>  pnpm <版本>
• 已应用 2 项配置更新
• Git 钩子已配置
```

## `vpt print-file package.json`

检查 prepare 脚本是否由以下内容组成：vp config && npm run build

```
{
  "name": "migration-existing-prepare-script",
  "scripts": {
    "build": "tsc",
    "prepare": "vp config && npm run build"
  },
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

## `vpt print-file .vite-hooks/pre-commit`

检查 pre-commit 钩子

```
vp staged
```
