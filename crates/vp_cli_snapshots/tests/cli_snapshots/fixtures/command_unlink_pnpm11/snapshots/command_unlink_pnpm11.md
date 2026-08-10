# command_unlink_pnpm11

## `vp unlink -h`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp unlink [选项] [软件包|目录] [参数]...

取消链接软件包

参数：
  [软件包|目录]  要取消链接的软件包名称
  [参数]...      要传递给软件包管理器的参数

选项：
  -r, --recursive  在每个工作区软件包中取消链接
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

先链接该库

```

dependencies:
 unlink-test-lib 1.0.0 <- ../unlink-test-lib
```

## `vpt print-file package.json`

```
{
  "name": "command-unlink-pnpm11",
  "version": "1.0.0",
  "packageManager": "pnpm@11.0.6",
  "dependencies": {
    "unlink-test-lib": "link:../unlink-test-lib"
  }
}
```

## `vp unlink unlink-test-lib -- --no-frozen-lockfile`

应当解除该软件包的链接（pnpm v11 在 CI=true 下需要使用 --no-frozen-lockfile）

```
Already up to date
```

## `vpt print-file package.json`

```
{
  "name": "command-unlink-pnpm11",
  "version": "1.0.0",
  "packageManager": "pnpm@11.0.6",
  "dependencies": {
    "unlink-test-lib": "link:../unlink-test-lib"
  }
}
```

## `vp link ../unlink-test-lib`

再次链接

```
```

## `vp unlink -- --no-frozen-lockfile`

应该解除所有软件包的链接

```
Already up to date
```

## `vpt print-file package.json`

```
{
  "name": "command-unlink-pnpm11",
  "version": "1.0.0",
  "packageManager": "pnpm@11.0.6",
  "dependencies": {
    "unlink-test-lib": "link:../unlink-test-lib"
  }
}
```
