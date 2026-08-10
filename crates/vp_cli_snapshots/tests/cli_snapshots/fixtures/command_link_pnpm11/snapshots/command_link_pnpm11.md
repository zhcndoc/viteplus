# command_link_pnpm11

## `vp link -h`

应显示帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp link [PACKAGE|DIR] [ARGS]...

链接用于本地开发的软件包

参数：
  [PACKAGE|DIR]  要链接的软件包名称或目录
  [ARGS]...      要传递给包管理器的参数

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
  "name": "command-link-pnpm11",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "*"
  },
  "packageManager": "pnpm@11.0.6"
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

应该与 ln 别名配合工作

```
Lockfile is up to date, resolution step is skipped
```

## `vpt print-file package.json pnpm-lock.yaml`

```
{
  "name": "command-link-pnpm11",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "*"
  },
  "packageManager": "pnpm@11.0.6"
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

## `vp unlink ../test-lib-pnpm -- --no-frozen-lockfile`

应当解除该软件包的链接（pnpm v11 在 `CI=true` 下需要使用 `--no-frozen-lockfile`，以避免出现 ERR_PNPM_LOCKFILE_CONFIG_MISMATCH）

```
Already up to date
```

## `vp unlink testnpm2 -- --no-frozen-lockfile`

```
testnpm2 已链接到 <workspace>/node_modules，来自 <case>/test-lib-pnpm
已经是最新版本

依赖项：
- testnpm2 1.0.0
 testnpm2 1.0.1
```

## `vpt print-file package.json pnpm-lock.yaml`

```
{
  "name": "command-link-pnpm11",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "*"
  },
  "packageManager": "pnpm@11.0.6"
}
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

importers:

  .:
    dependencies:
      testnpm2:
        specifier: '*'
        version: 1.0.1

packages:

  testnpm2@1.0.1:
    resolution: {integrity: sha512-F4AQ+KmzhbOSlt7ae+X2O8IJktFZAcN6OK169TT4ny7M3e4Vje7NITZTOU31AtEk9L/Z8lrCrqinl/eY6WPuEw==}

snapshots:

  testnpm2@1.0.1: {}
```
