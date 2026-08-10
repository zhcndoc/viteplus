# command_dedupe_pnpm11

## `vp dedupe --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp dedupe [选项] [-- <PASS_THROUGH_ARGS>...]

去重依赖

参数：
  [PASS_THROUGH_ARGS]...  传递给包管理器的其他参数

选项：
  --check     检查去重是否会产生更改
  -h, --help  打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp dedupe`

应该对依赖进行去重

```
Already up to date

dependencies:
 testnpm2 1.0.1

optionalDependencies:
 test-vite-plus-package-optional 1.0.0

devDependencies:
 test-vite-plus-package 1.0.0
```

## `vpt print-file package.json`

```
{
  "name": "command-dedupe-pnpm11",
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

## `vp dedupe --check`

应检查去重操作是否会产生更改

```
```

## `vpt print-file package.json`

```
{
  "name": "command-dedupe-pnpm11",
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

## `vp dedupe -- --loglevel=warn`

支持传递参数

```
```

## `vpt print-file package.json`

```
{
  "name": "command-dedupe-pnpm11",
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

## `vpt json-edit package.json dependencies {}`

应检查失败，因为没有依赖项


## `vpt print-file package.json`

```
{
  "dependencies": {},
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "name": "command-dedupe-pnpm11",
  "optionalDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "pnpm@11.0.6",
  "version": "1.0.0"
}
```

## `vp dedupe --check`

**退出代码：** 1

```
[ERR_PNPM_DEDUPE_CHECK_ISSUES] Dedupe --check found changes to the lockfile

Importers
.
└── - testnpm2 1.0.1

Packages
- testnpm2@1.0.1

Run pnpm dedupe to apply the changes above.
```

## `vp dedupe`

dedupe 是否应该通过移除依赖项来修复更改

```
软件包：-1
-

依赖项：
- testnpm2 1.0.1
```

## `vpt print-file package.json`

```
{
  "dependencies": {},
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "name": "command-dedupe-pnpm11",
  "optionalDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "pnpm@11.0.6",
  "version": "1.0.0"
}
```

## `vp dedupe --check`

```
```
