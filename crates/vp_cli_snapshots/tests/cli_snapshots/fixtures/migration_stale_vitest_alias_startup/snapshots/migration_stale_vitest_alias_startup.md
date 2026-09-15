# migration_stale_vitest_alias_startup

## `node setup-local.mjs`


## `npm_lifecycle_event=prepare vp config --no-hooks --no-agent`

prepare 应报告过时的别名，而不是加载其原生绑定

**退出代码：** 1

```
error: Found a stale Vitest alias in pnpm-workspace.yaml that points to the removed `@voidzero-dev/vite-plus-test` package. Run `vp migrate` to update the project before installing dependencies.
```

## `VP_SKIP_INSTALL=1 vp migrate --no-interactive`

migrate 应在不加载过时 Vitest 别名的情况下启动

```
VITE+ - The Unified Toolchain for the Web

◇ Updated . to Vite+ <version>
• Node <version>  pnpm <version>
• Dependencies:
    vite   → <version>
• Package manager settings configured
```

## `vpt print-file package.json`

应移除过时的 Vitest 依赖

```
{
  "name": "migration-stale-vitest-alias-startup",
  "scripts": {
    "prepare": "vp config"
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

应移除过时的目录别名和覆盖配置

```
packages:
  - .

catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>

overrides:
  vite@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```
