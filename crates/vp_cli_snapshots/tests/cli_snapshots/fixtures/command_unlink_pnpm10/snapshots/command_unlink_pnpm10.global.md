# command_unlink_pnpm10

## `vp unlink -h`

应显示帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp unlink [选项] [软件包|目录] [参数]...

解除软件包链接

参数：
  [软件包|目录]  要解除链接的软件包名称
  [参数]...      要传递给软件包管理器的参数

选项：
  -r, --recursive  在每个工作区软件包中解除链接
  -h, --help       打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vpt mkdir -p ../unlink-test-lib`

创建测试库

```
```

## `vpt write-file ../unlink-test-lib/package.json '{"name": "unlink-test-lib", "version": "1.0.0"}
'`

```
```

## `vp link ../unlink-test-lib`

首先链接该库

```

dependencies:
 unlink-test-lib 1.0.0 <- ../unlink-test-lib
```

## `vpt print-file package.json`

```
{
  "name": "command-unlink-pnpm10",
  "version": "1.0.0",
  "packageManager": "pnpm@10.19.0",
  "dependencies": {
    "unlink-test-lib": "link:../unlink-test-lib"
  }
}
```

## `vp unlink unlink-test-lib`

应取消链接该软件包

```
Nothing to unlink
```

## `vpt print-file package.json`

```
{
  "name": "command-unlink-pnpm10",
  "version": "1.0.0",
  "packageManager": "pnpm@10.19.0",
  "dependencies": {
    "unlink-test-lib": "link:../unlink-test-lib"
  }
}
```

## `vp link ../unlink-test-lib`

再次链接

```
Lockfile is up to date, resolution step is skipped
```

## `vp unlink`

应该解除所有软件包的链接

```
Nothing to unlink
```

## `vpt print-file package.json`

```
{
  "name": "command-unlink-pnpm10",
  "version": "1.0.0",
  "packageManager": "pnpm@10.19.0",
  "dependencies": {
    "unlink-test-lib": "link:../unlink-test-lib"
  }
}
```
