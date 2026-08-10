# 命令 prune_pnpm10

## `vp install`

应先安装软件包

```
VITE+ - The Unified Toolchain for the Web

dependencies:
 testnpm2 1.0.1

optionalDependencies:
 test-vite-plus-package-optional 1.0.0

devDependencies:
 test-vite-plus-package 1.0.0

Done in <duration> using pnpm <version>
```

## `vp pm prune --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp pm prune [选项] [-- <PASS_THROUGH_ARGS>...]

移除不必要的软件包

参数：
  [PASS_THROUGH_ARGS]...  其他参数

选项：
  --prod         移除 devDependencies
  --no-optional  移除可选依赖
  -h, --help     打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp pm prune`

应清理多余的依赖项

```
Lockfile is up to date, resolution step is skipped
Already up to date
```

## `vpt print-file package.json`

```
{
  "name": "command-prune-pnpm10",
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
  "packageManager": "pnpm@10.20.0"
}
```

## `vp pm prune --prod`

应该清理开发依赖

```
Lockfile is up to date, resolution step is skipped
Packages: -1
-

devDependencies:
- test-vite-plus-package 1.0.0
```

## `vpt print-file package.json`

```
{
  "name": "command-prune-pnpm10",
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
  "packageManager": "pnpm@10.20.0"
}
```

## `vp pm prune --no-optional`

应清理可选依赖

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
  "name": "command-prune-pnpm10",
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
  "packageManager": "pnpm@10.20.0"
}
```

## `vp pm prune --prod --no-optional`

应同时清理开发依赖和可选依赖

```
锁定文件已是最新，已跳过解析步骤
软件包：-1
-

可选依赖：已跳过

开发依赖：
- test-vite-plus-package 1.0.0
```

## `vpt print-file package.json`

```
{
  "name": "command-prune-pnpm10",
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
  "packageManager": "pnpm@10.20.0"
}
```

## `vp pm prune -- --loglevel=warn`

应支持透传参数

```

## `vpt print-file package.json`

```
{
  "name": "command-prune-pnpm10",
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
  "packageManager": "pnpm@10.20.0"
}
```
