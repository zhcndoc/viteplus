# command_dedupe_pnpm10

## `vp dedupe --help`

应显示帮助

```
VITE+ - Web 的统一工具链

用法: vp dedupe [选项] [-- <PASS_THROUGH_ARGS>...]

去重依赖项

参数:
  [PASS_THROUGH_ARGS]...  要传递给包管理器的其他参数

选项:
  --check     检查去重是否会产生更改
  -h, --help  打印帮助

文档: https://viteplus.dev/guide/install
```

## `vp dedupe`

应对依赖项进行去重

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
  "name": "command-dedupe-pnpm10",
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
  "packageManager": "pnpm@10.18.0"
}
```

## `vp dedupe --check`

应检查去重是否会产生更改

```
```

## `vpt print-file package.json`

```
{
  "name": "command-dedupe-pnpm10",
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
  "packageManager": "pnpm@10.18.0"
}
```

## `vp dedupe -- --loglevel=warn`

支持透传参数

```
```

## `vpt print-file package.json`

```
{
  "name": "command-dedupe-pnpm10",
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
  "packageManager": "pnpm@10.18.0"
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
  "name": "command-dedupe-pnpm10",
  "optionalDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "pnpm@10.18.0",
  "version": "1.0.0"
}
```

## `vp dedupe --check`

**退出代码：** 1

```
 ERR_PNPM_DEDUPE_CHECK_ISSUES  Dedupe --check 发现锁文件存在更改

导入器
.
└── - testnpm2 1.0.1

软件包
- testnpm2@1.0.1

运行 pnpm dedupe 以应用上述更改。
```

## `vp dedupe`

`dedupe` 是否应该通过移除依赖来修复更改

```
Packages: -1
-

dependencies:
- testnpm2 1.0.1
```

## `vpt print-file package.json`

```
{
  "dependencies": {},
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "name": "command-dedupe-pnpm10",
  "optionalDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "pnpm@10.18.0",
  "version": "1.0.0"
}
```

## `vp dedupe --check`

```
```
