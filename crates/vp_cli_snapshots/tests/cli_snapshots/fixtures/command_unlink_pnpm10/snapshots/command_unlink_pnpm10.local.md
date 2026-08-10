# command_unlink_pnpm10

## `vp unlink -h`

应显示帮助信息

```
取消链接软件包

用法：vp unlink [选项] [软件包|目录] [参数]...

参数：
  [软件包|目录]  要取消链接的软件包名称
  [参数]...      要传递给软件包管理器的参数

选项：
  -r, --recursive  在每个工作区软件包中取消链接
  -h, --help       打印帮助信息
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

先链接该库

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

应解除该软件包的链接

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
