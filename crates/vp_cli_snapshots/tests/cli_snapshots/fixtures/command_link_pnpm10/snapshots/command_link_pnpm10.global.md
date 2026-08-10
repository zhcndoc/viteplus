# command_link_pnpm10

## `vp link -h`

应显示帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp link [PACKAGE|DIR] [ARGS]...

链接软件包以进行本地开发

参数：
  [PACKAGE|DIR]  要链接的软件包名称或目录
  [ARGS]...      要传递给软件包管理器的参数

选项：
  -h, --help  打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp install`

安装初始依赖

```
VITE+ - Web 的统一工具链

依赖：
 testnpm2 1.0.1

使用 pnpm <version> 在 <duration> 内完成
```

## `vpt mkdir -p ../test-lib-pnpm`

创建测试库

```
```

## `vpt write-file ../test-lib-pnpm/package.json '{"name": "testnpm2", "version": "1.0.0"}
'`

```
```

## `vp link ../test-lib-pnpm`

应链接本地目录

```
Packages: -1
-

dependencies:
- testnpm2 1.0.1
 testnpm2 1.0.0 <- ../test-lib-pnpm
```

## `vpt print-file package.json pnpm-lock.yaml`

```
{
  "name": "command-link-pnpm10",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "*"
  },
  "packageManager": "pnpm@10.19.0"
}
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

overrides:
  testnpm2: link:../test-lib-pnpm

importers:

  .:
    dependencies:
      testnpm2:
        specifier: link:../test-lib-pnpm
        version: link:../test-lib-pnpm
```

## `vp ln ../test-lib-pnpm`

应该能与 ln 别名一起工作

```
Lockfile is up to date, resolution step is skipped
```

## `vpt print-file package.json pnpm-lock.yaml`

```
{
  "name": "command-link-pnpm10",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "*"
  },
  "packageManager": "pnpm@10.19.0"
}
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

overrides:
  testnpm2: link:../test-lib-pnpm

importers:

  .:
    dependencies:
      testnpm2:
        specifier: link:../test-lib-pnpm
        version: link:../test-lib-pnpm
```

## `vp unlink ../test-lib-pnpm`

应该解除该软件包的链接

```
Nothing to unlink
```

## `vp unlink testnpm2`

```
没有可取消链接的内容
```

## `vpt print-file package.json pnpm-lock.yaml`

```
{
  "name": "command-link-pnpm10",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "*"
  },
  "packageManager": "pnpm@10.19.0"
}
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

overrides:
  testnpm2: link:../test-lib-pnpm

importers:

  .:
    dependencies:
      testnpm2:
        specifier: link:../test-lib-pnpm
        version: link:../test-lib-pnpm
```
