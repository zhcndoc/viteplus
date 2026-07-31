# 移除 Bun

## `vp remove --help`

应显示帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp remove [选项] <软件包>... [-- <透传参数>...]

从依赖中移除软件包

参数：
  <软件包>...             要移除的软件包
  [透传参数]...            要传递给软件包管理器的其他参数

选项：
  -D, --save-dev        仅从 `devDependencies` 中移除（仅限 pnpm）
  -O, --save-optional   仅从 `optionalDependencies` 中移除（仅限 pnpm）
  -P, --save-prod       仅从 `dependencies` 中移除（仅限 pnpm）
  --filter <模式>       筛选 monorepo 中的软件包（可多次使用）
  -w, --workspace-root  从工作区根目录移除
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
error: the following required arguments were not provided:
  <PACKAGES>...

Usage: vp remove <PACKAGES>... [-- <PASS_THROUGH_ARGS>...]

For more information, try '--help'.
```

## `vp remove testnpm2 -D`

从开发依赖中移除不存在的软件包时应报错

```
bun remove <version> (af24e281)
package.json 中没有依赖项，没有可移除的内容！
```

## `vpt print-file package.json`

```
{
  "name": "command-remove-bun",
  "version": "1.0.0",
  "packageManager": "bun@1.3.11"
}
```

## `vp add testnpm2`

应将软件包添加到依赖项中

```
bun add <version> (af24e281)

已安装 testnpm2@1.0.1

已安装 1 个软件包 [<duration>]
```

## `vp add -D test-vite-plus-install`

```
bun add <version> (af24e281)

installed test-vite-plus-install@1.0.0

1 package installed [<duration>]
```

## `vp add -O test-vite-plus-package-optional`

```
bun add <version> (af24e281)

installed test-vite-plus-package-optional@1.0.0

1 package installed [<duration>]
```

## `vpt print-file package.json`

```
{
  "name": "command-remove-bun",
  "version": "1.0.0",
  "packageManager": "bun@1.3.11",
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
bun remove <version> (af24e281)

- testnpm2
- test-vite-plus-install
已移除 2 个软件包 [<duration>]
```

## `vpt print-file package.json`

```
{
  "name": "command-remove-bun",
  "version": "1.0.0",
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
  },
  "packageManager": "bun@1.3.11"
}
```

## `vp remove -O test-vite-plus-package-optional`

应从可选依赖中移除软件包

```
bun remove <version> (af24e281)

package.json has no dependencies! Deleted empty lockfile

- test-vite-plus-package-optional
1 package removed [<duration>]
```

## `vpt print-file package.json`

```
{
  "name": "command-remove-bun",
  "version": "1.0.0",
  "packageManager": "bun@1.3.11"
}
```
