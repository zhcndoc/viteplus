# command_add_bun

## `vp add --help`

应显示帮助

```
VITE+ - The Unified Toolchain for the Web

Usage: vp add [OPTIONS] <PACKAGES>... [-- <PASS_THROUGH_ARGS>...]

Add packages to dependencies

Arguments:
  <PACKAGES>...           Packages to add
  [PASS_THROUGH_ARGS]...  Additional arguments to pass through to the package manager

Options:
  -P, --save-prod                     Save to `dependencies` (default)
  -D, --save-dev                      Save to `devDependencies`
  --save-peer                         Save to `peerDependencies` and `devDependencies`
  -O, --save-optional                 Save to `optionalDependencies`
  -E, --save-exact                     Save exact version rather than semver range
  --save-catalog-name <CATALOG_NAME>  Save the new dependency to the specified catalog name
  --save-catalog                      Save the new dependency to the default catalog
  --allow-build <NAMES>               A list of package names allowed to run postinstall
  --filter <PATTERN>                  Filter packages in monorepo (can be used multiple times)
  -w, --workspace-root                Add to workspace root
  --workspace                         Only add if package exists in workspace (pnpm-specific)
  -g, --global                        Install globally
  --node <NODE>                       Node.js version to use for global installation (only with -g)
  --concurrency <CONCURRENCY>         Number of global package installs to run in parallel (only with -g)
  -h, --help                          Print help

Documentation: https://viteplus.dev/guide/install
```

## `vp add`

由于未指定软件包，应报错

**退出代码：** 2

```
error: the following required arguments were not provided:
  <PACKAGES>...

Usage: vp add <PACKAGES>... [-- <PASS_THROUGH_ARGS>...]

For more information, try '--help'.
```

## `vp add testnpm2 -D`

应将软件包添加为开发依赖项

```
bun add <version> (af24e281)

installed testnpm2@1.0.1

1 package installed [<duration>]
```

## `vpt print-file package.json`

```
{
  "name": "command-add-bun",
  "version": "1.0.0",
  "packageManager": "bun@1.3.11",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  }
}
```

## `vp add testnpm2 test-vite-plus-install`

应将软件包添加到依赖项中

```
bun add <version> (af24e281)

已安装 testnpm2@1.0.1
已安装 test-vite-plus-install@1.0.0

已安装 2 个软件包 [<duration>]
```

## `vpt print-file package.json`

```
{
  "name": "command-add-bun",
  "version": "1.0.0",
  "packageManager": "bun@1.3.11",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
```

## `vp install test-vite-plus-package@1.0.0 --save-peer`

应为添加操作安装软件包别名

```
VITE+ - Web 的统一工具链

bun add <version> (af24e281)

已安装 test-vite-plus-package@1.0.0

已安装 1 个软件包 [<duration>]
```

## `vpt print-file package.json`

```
{
  "name": "command-add-bun",
  "version": "1.0.0",
  "packageManager": "bun@1.3.11",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  },
  "peerDependencies": {
    "test-vite-plus-package": "1.0.0"
  }
}
```

## `vp add test-vite-plus-package-optional -O`

应将软件包添加为可选依赖

```
bun add <version> (af24e281)

installed test-vite-plus-package-optional@1.0.0

1 package installed [<duration>]
```

## `vpt print-file package.json`

```
{
  "name": "command-add-bun",
  "version": "1.0.0",
  "packageManager": "bun@1.3.11",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  },
  "peerDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
  }
}
```
