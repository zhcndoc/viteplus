# 迁移_无_git_仓库

## `vp migrate --no-interactive`

迁移应在没有 `.git` 的情况下也创建 `.vite-hooks/pre-commit`

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
```

## `vpt print-file package.json`

检查 package.json 是否包含 prepare 脚本和 lint-staged 配置

```
{
  "name": "migration-no-git-repo",
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
  },
  "scripts": {
    "prepare": "vp config"
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

## `vpt stat-file .vite-hooks --assert dir`

即使没有 .git，hooks 目录也存在

```
.vite-hooks: dir
```

## `vpt print-file .vite-hooks/pre-commit`

即使没有 .git，pre-commit 钩子也应该存在

```
vp staged
```
