# command_add_pnpm12

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
  -E, --save-exact                    Save exact version rather than semver range
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

## `vp add testnpm2 -D -- --loglevel=verbose --verbose`

应将软件包添加为开发依赖项

**退出代码：** 2

```
error: unexpected argument '--loglevel' found

  tip: to pass '--loglevel' as a value, use '-- --loglevel'

Usage: pnpm add --save-dev <PACKAGE_NAMES>...

For more information, try '--help'.
```

*（跳过 1 个步骤到下一个行边界：步骤失败）*

## `vp add testnpm2 test-vite-plus-install --allow-build=test-vite-plus-install`

应将软件包添加到依赖项中

```

dependencies:
 test-vite-plus-install 1.0.0
 testnpm2 1.0.1

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm12",
  "version": "1.0.0",
  "packageManager": "pnpm@12.0.0-beta.0",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0",
    "testnpm2": "^1.0.1"
  }
}
```

## `vp install test-vite-plus-package@1.0.0 --save-peer`

应为 add 安装软件包别名

```
VITE+ - Web 的统一工具链

✓ 锁文件通过供应链策略检查（已于 <duration> 前验证）

开发依赖项:
 test-vite-plus-package 1.0.0

完成，用时 <duration>，使用 pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm12",
  "version": "1.0.0",
  "packageManager": "pnpm@12.0.0-beta.0",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0",
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "peerDependencies": {
    "test-vite-plus-package": "1.0.0"
  }
}
```

## `vp add test-vite-plus-package-optional -O`

应将软件包添加为可选依赖

```
✓ 锁文件通过供应链策略检查（<duration> 前已验证）

optionalDependencies:
 test-vite-plus-package-optional 1.0.0

已完成，用时 <duration>，使用 pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm12",
  "version": "1.0.0",
  "packageManager": "pnpm@12.0.0-beta.0",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0",
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "peerDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
  }
}
```

## `vp add test-vite-plus-package-optional -- --loglevel=warn`

支持传递参数

**退出代码：** 2

```
error: unexpected argument '--loglevel' found

  tip: to pass '--loglevel' as a value, use '-- --loglevel'

Usage: pnpm add [OPTIONS] <PACKAGE_NAMES>...

For more information, try '--help'.
```

*（跳过 1 个步骤到下一个行边界：步骤失败）*
