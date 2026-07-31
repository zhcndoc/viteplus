# command_update_pnpm10

## `vp update --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp update [OPTIONS] [PACKAGES]... [-- <PASS_THROUGH_ARGS>...]

将软件包更新到最新版本

参数：
  [PACKAGES]...           要更新的软件包（可选——省略时更新全部软件包）
  [PASS_THROUGH_ARGS]...  要传递给软件包管理器的其他参数

选项：
  -L, --latest                 更新到最新版本（忽略 semver 范围）
  -g, --global                 更新全局软件包
  --concurrency <CONCURRENCY>  并行运行的全局软件包更新数量（仅与 -g 一起使用）
  --reinstall-node-mismatch    重新安装使用不同 Node.js 版本安装且已是最新版本的全局软件包
  --ignore-node-mismatch       跳过使用不同 Node.js 版本安装且已是最新版本的全局软件包
  -r, --recursive              在所有工作区软件包中递归更新
  --filter <PATTERN>           筛选 monorepo 中的软件包（可多次使用）
  -w, --workspace-root         包含工作区根目录
  -D, --dev                    仅更新 devDependencies
  -P, --prod                   仅更新 dependencies（生产依赖）
  -i, --interactive            交互模式
  --no-optional                不更新 optionalDependencies
  --no-save                    仅更新锁定文件，不修改 package.json
  --workspace                  仅在工作区中存在软件包时更新（pnpm 特有）
  -h, --help                   显示帮助

文档：https://viteplus.dev/guide/install
```

## `vp update testnpm2`

应在 semver 范围内更新软件包

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
  "name": "command-update-pnpm10",
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
  "packageManager": "pnpm@10.18.0"
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
  "name": "command-update-pnpm10",
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
  "packageManager": "pnpm@10.18.0"
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
  "name": "command-update-pnpm10",
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
  "packageManager": "pnpm@10.18.0"
}
```

## `vp update -P --no-save`

应仅更新 dependencies 和 optionalDependencies，而不保存

```
已是最新

devDependencies：已跳过

使用 pnpm <version> 在 <duration> 内完成
```

## `vpt print-file package.json`

```
{
  "name": "command-update-pnpm10",
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
  "packageManager": "pnpm@10.18.0"
}
```

## `vp rm testnpm2`

应从下一次测试的依赖项中移除软件包


## `vp add testnpm2@1.0.0 -O`

应跳过可选依赖

```

optionalDependencies:
 testnpm2 1.0.0 (1.0.1 is available)

Done in <duration> using pnpm <version>
```

## `vp update --no-optional --latest`

```
包：-2
--

可选依赖：
- test-vite-plus-package-optional 1.0.0
- testnpm2 1.0.0

已完成，用时 <duration>，使用 pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-update-pnpm10",
  "version": "1.0.0",
  "devDependencies": {
    "test-vite-plus-package": "^1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0",
    "testnpm2": "1.0.1"
  },
  "packageManager": "pnpm@10.18.0"
}
```

## `vp update`

应更新所有软件包并修改 package.json

```

optionalDependencies:
 test-vite-plus-package-optional 1.0.0
 testnpm2 1.0.1

完成于 <duration>，使用 pnpm <version>
```

## `vp update --recursive`

```

已完成，用时 <duration>，使用 pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-update-pnpm10",
  "version": "1.0.0",
  "devDependencies": {
    "test-vite-plus-package": "^1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0",
    "testnpm2": "1.0.1"
  },
  "packageManager": "pnpm@10.18.0"
}
```
