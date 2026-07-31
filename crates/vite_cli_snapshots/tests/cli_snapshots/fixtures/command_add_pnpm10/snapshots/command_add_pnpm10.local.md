# 添加 pnpm10 命令

## `vp add --help`

应显示帮助

```
添加软件包到依赖项

用法：vp add [选项] <软件包>... [-- <透传参数>...]

参数：
  <软件包>...            要添加的软件包
  [透传参数]...           要传递给软件包管理器的其他参数

选项：
  -P, --save-prod
          保存到 `dependencies`（默认）
  -D, --save-dev
          保存到 `devDependencies`
      --save-peer
          保存到 `peerDependencies` 和 `devDependencies`
  -O, --save-optional
          保存到 `optionalDependencies`
  -E, --save-exact
          保存确切版本，而不是 semver 范围
      --save-catalog-name <CATALOG_NAME>
          将新的依赖项保存到指定的目录名称
      --save-catalog
          将新的依赖项保存到默认目录
      --allow-build <NAMES>
          允许运行 postinstall 的软件包名称列表
      --filter <PATTERN>
          筛选 monorepo 中的软件包（可多次使用）
  -w, --workspace-root
          添加到工作区根目录
      --workspace
          仅在工作区中存在该软件包时添加（pnpm 特有）
  -g, --global
          全局安装
      --node <NODE>
          用于全局安装的 Node.js 版本（仅与 -g 一起使用）
      --concurrency <CONCURRENCY>
          并行运行的全局软件包安装数量（仅与 -g 一起使用）
  -h, --help
          显示帮助
```

## `vp add`

由于未指定任何软件包，应报错

**退出代码：** 2

```
错误：未提供以下必需参数：
  <PACKAGES>...

用法：vp add <PACKAGES>... [-- <PASS_THROUGH_ARGS>...]

如需更多信息，请尝试使用“--help”。
```

## `vp add testnpm2 -D -- --loglevel=verbose --verbose`

应将包添加为开发依赖项

```

devDependencies:
 testnpm2 1.0.1

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm10",
  "version": "1.0.0",
  "packageManager": "pnpm@10.19.0",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  }
}
```

## `vp add testnpm2 test-vite-plus-install --allow-build=test-vite-plus-install`

应将软件包添加到依赖项中

```

dependencies:
 test-vite-plus-install 1.0.0

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm10",
  "version": "1.0.0",
  "packageManager": "pnpm@10.19.0",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
```

## `vp install test-vite-plus-package@1.0.0 --save-peer`

应为 add 安装包别名

```

peerDependencies:
 test-vite-plus-package 1.0.0

devDependencies:
 test-vite-plus-package 1.0.0 已存在于 devDependencies 中，未移动到 dependencies。

已完成，耗时 <duration>，使用 pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm10",
  "version": "1.0.0",
  "packageManager": "pnpm@10.19.0",
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

应将软件包添加为可选依赖

```

optionalDependencies:
 test-vite-plus-package-optional 1.0.0

完成于 <duration>，使用 pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm10",
  "version": "1.0.0",
  "packageManager": "pnpm@10.19.0",
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

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm10",
  "version": "1.0.0",
  "packageManager": "pnpm@10.19.0",
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
