# 删除 pnpm11 的命令

## `vp remove --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp remove [OPTIONS] <PACKAGES>... [-- <PASS_THROUGH_ARGS>...]

从依赖项中移除软件包

参数：
  <PACKAGES>...           要移除的软件包
  [PASS_THROUGH_ARGS]...  要传递给软件包管理器的其他参数

选项：
  -D, --save-dev        仅从 `devDependencies` 中移除（pnpm 特有）
  -O, --save-optional   仅从 `optionalDependencies` 中移除（pnpm 特有）
  -P, --save-prod       仅从 `dependencies` 中移除（pnpm 特有）
  --filter <PATTERN>    筛选 monorepo 中的软件包（可多次使用）
  -w, --workspace-root  从工作区根目录中移除
  -r, --recursive       从所有工作区软件包中递归移除
  -g, --global          移除全局软件包
  --dry-run             预览将要移除的内容，但不实际移除（仅与 -g 一起使用）
  -h, --help            打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp remove`

由于未指定软件包，应报错

**退出代码：** 2

```
错误：未提供以下必需参数：
  <PACKAGES>...

用法：vp remove <PACKAGES>... [-- <PASS_THROUGH_ARGS>...]

有关更多信息，请尝试“--help”。
```

## `vp remove testnpm2 -D`

从开发依赖中移除不存在的软件包时应报错

**退出代码：** 1

```
[ERR_PNPM_CANNOT_REMOVE_MISSING_DEPS] Cannot remove 'testnpm2': project has no 'devDependencies'
```

*（跳过 1 个步骤到下一个行边界：步骤失败）*

## `vp add testnpm2`

应将软件包添加到依赖项中

```

dependencies:
 testnpm2 1.0.1

Done in <duration> using pnpm <version>
```

## `vp add -D test-vite-plus-install`

```

devDependencies:
 test-vite-plus-install 1.0.0

Done in <duration> using pnpm <version>
```

## `vp add -O test-vite-plus-package-optional`

```

optionalDependencies:
 test-vite-plus-package-optional 1.0.0

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-remove-pnpm11",
  "version": "1.0.0",
  "packageManager": "pnpm@11.0.6",
  "dependencies": {
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-install": "^1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
  }
}
```

## `vp remove testnpm2 test-vite-plus-install`

应从依赖项中移除软件包

```
Packages: -2
--

dependencies:
- testnpm2 1.0.1

devDependencies:
- test-vite-plus-install 1.0.0

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-remove-pnpm11",
  "version": "1.0.0",
  "packageManager": "pnpm@11.0.6",
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
  }
}
```

## `vp remove -O test-vite-plus-package-optional -- --loglevel=warn`

支持从可选依赖中移除软件包，并传递参数

```
```

## `vpt print-file package.json`

```
{
  "name": "command-remove-pnpm11",
  "version": "1.0.0",
  "packageManager": "pnpm@11.0.6"
}
```

## `vp remove -g --dry-run testnpm2`

支持使用 dry-run 移除全局软件包

**退出代码：** 1

```
卸载 testnpm2 失败：未安装软件包 testnpm2
```

*（跳过 1 个步骤到下一行边界：步骤失败）*

## `vp rm --stream foo`

当不支持某个选项时，应提示用户使用透传参数

**退出代码：** 2

```
VITE+ - Web 的统一工具链

错误：意外的参数 '--stream'

使用 `-- --stream` 将该参数作为值传递
```
