# command_add_pnpm9

## `vp add --help`

应显示帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp add [选项] <PACKAGES>... [-- <PASS_THROUGH_ARGS>...]

将软件包添加到依赖项

参数：
  <PACKAGES>...           要添加的软件包
  [PASS_THROUGH_ARGS]...  要传递给软件包管理器的其他参数

Options:
  -P, --save-prod                     Save to `dependencies` (default)
  -D, --save-dev                      Save to `devDependencies`
  --save-peer                         Save to `peerDependencies` and `devDependencies`
  -O, --save-optional                 Save to `optionalDependencies`
  -E, --save-exact                    Save exact version rather than semver range
  --save-catalog-name <CATALOG_NAME>  Save the new dependency to the specified catalog name
  --save-catalog                      Save the new dependency to the default catalog
  --allow-build <NAMES>               A list of package names allowed to run postinstall
  --ignore-scripts                    Do not run lifecycle scripts
  --filter <PATTERN>                  Filter packages in monorepo (can be used multiple times)
  -w, --workspace-root                Add to workspace root
  --workspace                         Only add if package exists in workspace (pnpm-specific)
  -g, --global                        Install globally
  --node <NODE>                       Node.js version to use for global installation (only with -g)
  --concurrency <CONCURRENCY>         Number of global package installs to run in parallel (only with -g)
  -h, --help                          Print help

文档：https://viteplus.dev/guide/install
```

## `vp add testnpm2 -D`

应将软件包添加为开发依赖项

```

devDependencies:
 testnpm2 1.0.1

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm9",
  "version": "1.0.0",
  "packageManager": "pnpm@9.15.9",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  }
}
```

## `vp add testnpm2 test-vite-plus-install`

应将软件包添加到依赖项中

```

dependencies:
 test-vite-plus-install 1.0.0

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm9",
  "version": "1.0.0",
  "packageManager": "pnpm@9.15.9",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
```

## `vp add testnpm2 test-vite-plus-install --allow-build=test-vite-plus-install`

由于 pnpm@9 不支持 allow-build，因此应报错

**退出代码：** 1

```
 ERROR  Unknown option: 'allow-build'
For help, run: pnpm help add
```

## `vp install test-vite-plus-package@1.0.0 --save-peer`

应该为添加安装包别名

```
VITE+ - Web 的统一工具链

peerDependencies:
 test-vite-plus-package 1.0.0

devDependencies:
 test-vite-plus-package 1.0.0 已存在于 devDependencies 中，未将其移动到 dependencies。

在 <duration> 内使用 pnpm <version> 完成
```

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm9",
  "version": "1.0.0",
  "packageManager": "pnpm@9.15.9",
  "devDependencies": {
    "test-vite-plus-package": "1.0.0",
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

应将软件包添加为可选依赖项

```

optionalDependencies:
 test-vite-plus-package-optional 1.0.0

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm9",
  "version": "1.0.0",
  "packageManager": "pnpm@9.15.9",
  "devDependencies": {
    "test-vite-plus-package": "1.0.0",
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

## `vp add test-vite-plus-package-optional -- --loglevel=warn`

支持传递参数

```
```

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm9",
  "version": "1.0.0",
  "packageManager": "pnpm@9.15.9",
  "devDependencies": {
    "test-vite-plus-package": "1.0.0",
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
