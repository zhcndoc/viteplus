# 命令_更新_pnpm11

## `vp update --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp update [选项] [软件包]... [-- <透传参数>...]

将软件包更新到最新版本

参数：
  [软件包]...              要更新的软件包（可选——省略时更新全部软件包）
  [透传参数]...             要传递给软件包管理器的其他参数

选项：
  -L, --latest              更新到最新版本（忽略 semver 范围）
  -g, --global              更新全局软件包
  --concurrency <并发数>    并行执行的全局软件包更新数量（仅与 -g 一起使用）
  --reinstall-node-mismatch 重新安装使用不同 Node.js 版本安装的最新全局软件包
  --ignore-node-mismatch    跳过使用不同 Node.js 版本安装的最新全局软件包
  -r, --recursive           在所有工作区软件包中递归更新
  --filter <模式>           筛选 monorepo 中的软件包（可多次使用）
  -w, --workspace-root      包含工作区根目录
  -D, --dev                 仅更新 devDependencies
  -P, --prod                仅更新 dependencies（生产环境）
  -i, --interactive         交互模式
  --no-optional             不更新 optionalDependencies
  --no-save                 仅更新锁文件，不修改 package.json
  --workspace               仅在软件包存在于工作区时更新（pnpm 特有）
  -h, --help                显示帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp update testnpm2`

应在 sem版本范围内更新软件包

```

dependencies:
 testnpm2 1.0.1

optionalDependencies:
 test-vite-plus-package-optional 1.0.0

devDependencies:
 test-vite-plus-package 1.0.0

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-update-pnpm11",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "*"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "*"
  },
  "packageManager": "pnpm@11.0.6"
}
```

## `vp up testnpm2 --latest`

应升级到绝对最新版本

```
Already up to date

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-update-pnpm11",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "*"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "*"
  },
  "packageManager": "pnpm@11.0.6"
}
```

## `vp update -D`

应仅更新开发依赖

```
已是最新版本

依赖项：已跳过

可选依赖项：已跳过

使用 pnpm <version> 在 <duration> 内完成
```

## `vpt print-file package.json`

```
{
  "name": "command-update-pnpm11",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "^1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "*"
  },
  "packageManager": "pnpm@11.0.6"
}
```

## `vp update -P --no-save`

应仅更新 dependencies 和 optionalDependencies，不保存

```
已是最新版本

devDependencies：已跳过

已完成，用时 <duration>，使用 pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-update-pnpm11",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "^1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "*"
  },
  "packageManager": "pnpm@11.0.6"
}
```

## `vp rm testnpm2`

应从依赖项中移除该包，以用于下一个测试


## `vp add testnpm2@1.0.0 -O`

应跳过可选依赖

```

可选依赖：
 testnpm2 1.0.0（1.0.1 可用）

使用 pnpm <version> 在 <duration> 内完成
```

## `vp update --no-optional --latest`

```
 -1
-

optionalDependencies:
- testnpm2 1.0.0
 testnpm2 1.0.1

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-update-pnpm11",
  "version": "1.0.0",
  "devDependencies": {
    "test-vite-plus-package": "^1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0",
    "testnpm2": "1.0.1"
  },
  "packageManager": "pnpm@11.0.6"
}
```

## `vp update`

应更新所有软件包并修改 package.json

```
已是最新版本

使用 pnpm <version> 在 <duration> 内完成
```

## `vp update --recursive`

```

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-update-pnpm11",
  "version": "1.0.0",
  "devDependencies": {
    "test-vite-plus-package": "^1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0",
    "testnpm2": "1.0.1"
  },
  "packageManager": "pnpm@11.0.6"
}
```
