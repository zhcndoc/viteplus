# command_add_yarn4

## `vp add --help`

应显示帮助

```
VITE+ - Web 统一工具链

用法: vp add [选项] <软件包>... [-- <透传参数>...]

将软件包添加到依赖项

参数:
  <PACKAGES>...           要添加的软件包
  [PASS_THROUGH_ARGS]...  要传递给软件包管理器的其他参数

选项:
  -P, --save-prod                     保存到 `dependencies`（默认）
  -D, --save-dev                      保存到 `devDependencies`
  --save-peer                         保存到 `peerDependencies` 和 `devDependencies`
  -O, --save-optional                 保存到 `optionalDependencies`
  -E, --save-exact                     保存确切版本，而非 semver 范围
  --save-catalog-name <CATALOG_NAME>  将新依赖项保存到指定的 catalog 名称
  --save-catalog                      将新依赖项保存到默认 catalog
  --allow-build <NAMES>               允许运行 postinstall 的软件包名称列表
  --filter <PATTERN>                  过滤 monorepo 中的软件包（可多次使用）
  -w, --workspace-root                添加到工作区根目录
  --workspace                         仅当软件包存在于工作区中时添加（pnpm 专用）
  -g, --global                        全局安装
  --node <NODE>                       用于全局安装的 Node.js 版本（仅与 -g 一起使用）
  --concurrency <CONCURRENCY>         并行运行的全局软件包安装数量（仅与 -g 一起使用）
  -h, --help                          显示帮助

文档：https://viteplus.dev/guide/install
```

## `vp add testnpm2 -D`

应将软件包添加为开发依赖项

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ 解析步骤
➤ YN0085: │ + testnpm2@npm:1.0.1
➤ YN0000: └ 已完成
➤ YN0000: ┌ 获取步骤
➤ YN0013: │ 已向项目添加一个软件包（+ <size> KiB）。
➤ YN0000: └ 已完成
➤ YN0000: ┌ 链接步骤
➤ YN0000: └ 已完成
➤ YN0000: · 在 <duration> <duration> 内完成
```

## `vpt print-file package.json`

```
{
  "name": "command-add-yarn4",
  "version": "1.0.0",
  "packageManager": "yarn@4.10.3",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  }
}
```

## `vp add testnpm2 test-vite-plus-install --allow-build=test-vite-plus-install`

应将软件包添加到依赖项中

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + test-vite-plus-install@npm:1.0.0
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0013: │ A package was added to the project (+ <size> KiB).
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-add-yarn4",
  "version": "1.0.0",
  "packageManager": "yarn@4.10.3",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
```

## `vp install test-vite-plus-package@1.0.0 --save-peer`

应安装用于 add 的包别名

```
VITE+ - The Unified Toolchain for the Web

➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-add-yarn4",
  "version": "1.0.0",
  "packageManager": "yarn@4.10.3",
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

应将软件包添加为可选依赖项

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + test-vite-plus-package-optional@npm:1.0.0
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0013: │ A package was added to the project (+ <size> KiB).
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-add-yarn4",
  "version": "1.0.0",
  "packageManager": "yarn@4.10.3",
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

## `vp add test-vite-plus-package-optional -- --tilde`

支持传递参数

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-add-yarn4",
  "version": "1.0.0",
  "packageManager": "yarn@4.10.3",
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
    "test-vite-plus-package-optional": "~1.0.0"
  }
}
```
