# command_prune_pnpm11

## `vp install`

应先安装软件包

```
VITE+ - Web 的统一工具链

依赖项：
 testnpm2 1.0.1

可选依赖项：
 test-vite-plus-package-optional 1.0.0

开发依赖项：
 test-vite-plus-package 1.0.0

使用 pnpm <version> 在 <duration> 内完成
```

## `vp pm prune --help`

应显示帮助信息

```
VITE+ - The Unified Toolchain for the Web

Usage: vp pm prune [OPTIONS] [-- <PASS_THROUGH_ARGS>...]

Remove unnecessary packages

Arguments:
  [PASS_THROUGH_ARGS]...  Additional arguments

Options:
  --prod         Remove devDependencies
  --no-optional  Remove optional dependencies
  -h, --help     Print help

Documentation: https://viteplus.dev/guide/install
```

## `vp pm prune`

应清理多余的依赖

```
Already up to date
```

## `vpt print-file package.json`

```
{
  "name": "command-prune-pnpm11",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "pnpm@11.0.6"
}
```

## `vp pm prune --prod`

应该清理开发依赖

```
锁定文件已是最新状态，跳过解析步骤
软件包：-1
-

开发依赖：
- test-vite-plus-package 1.0.0
```

## `vpt print-file package.json`

```
{
  "name": "command-prune-pnpm11",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "pnpm@11.0.6"
}
```

## `vp pm prune --no-optional`

应清理可选依赖项

```
Lockfile is up to date, resolution step is skipped
Packages: -1
-

optionalDependencies:
- test-vite-plus-package-optional 1.0.0

devDependencies:
 test-vite-plus-package 1.0.0
```

## `vpt print-file package.json`

```
{
  "name": "command-prune-pnpm11",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "pnpm@11.0.6"
}
```

## `vp pm prune --prod --no-optional`

should prune both dev and optional dependencies

```
Lockfile is up to date, resolution step is skipped
Packages: -1
-

optionalDependencies: skipped

devDependencies:
- test-vite-plus-package 1.0.0
```

## `vpt print-file package.json`

```
{
  "name": "command-prune-pnpm11",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "pnpm@11.0.6"
}
```

## `vp pm prune -- --loglevel=warn`

应该支持透传参数

```
```

## `vpt print-file package.json`

```
{
  "name": "command-prune-pnpm11",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "pnpm@11.0.6"
}
```
