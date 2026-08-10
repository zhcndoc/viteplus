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

选项：
  -P, --save-prod                     保存到 `dependencies`（默认）
  -D, --save-dev                      保存到 `devDependencies`
  --save-peer                         保存到 `peerDependencies` 和 `devDependencies`
  -O, --save-optional                 保存到 `optionalDependencies`
  -E, --save-exact                     保存确切版本，而不是 semver 范围
  --save-catalog-name <CATALOG_NAME>  将新依赖项保存到指定的 catalog 名称
  --save-catalog                      将新依赖项保存到默认 catalog
  --allow-build <NAMES>               允许运行 postinstall 的软件包名称列表
  --filter <PATTERN>                  筛选 monorepo 中的软件包（可多次使用）
  -w, --workspace-root                添加到工作区根目录
  --workspace                         仅当软件包存在于工作区中时添加（pnpm 特有）
  -g, --global                        全局安装
  --node <NODE>                       用于全局安装的 Node.js 版本（仅与 -g 一起使用）
  --concurrency <CONCURRENCY>         并行执行的全局软件包安装数量（仅与 -g 一起使用）
  -h, --help                          显示帮助信息

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
