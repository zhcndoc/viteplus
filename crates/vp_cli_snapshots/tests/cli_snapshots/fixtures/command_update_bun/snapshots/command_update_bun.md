# command_update_bun

## `vp update --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp update [选项] [软件包]... [-- <透传参数>...]

将软件包更新到最新版本

参数：
  [软件包]...              要更新的软件包（可选——省略时更新全部软件包）
  [透传参数>...]           要传递给软件包管理器的其他参数

选项：
  -L, --latest                 更新到最新版本（忽略 semver 范围）
  -g, --global                 更新全局软件包
  --concurrency <并发数>      并行运行的全局软件包更新数量（仅与 -g 一起使用）
  --reinstall-node-mismatch    重新安装使用不同 Node.js 版本安装的最新全局软件包
  --ignore-node-mismatch       跳过使用不同 Node.js 版本安装的最新全局软件包
  -r, --recursive              在所有工作区软件包中递归更新
  --filter <模式>             筛选 monorepo 中的软件包（可多次使用）
  -w, --workspace-root         包含工作区根目录
  -D, --dev                    仅更新 devDependencies
  -P, --prod                   仅更新 dependencies（生产环境）
  -i, --interactive            交互模式
  --no-optional                不更新 optionalDependencies
  --no-save                    仅更新锁文件，不修改 package.json
  --workspace                  仅在软件包存在于工作区时更新（pnpm 专用）
  -h, --help                   显示帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp update testnpm2`

应在 semver 范围内更新软件包

```
bun update <version> (af24e281)

 test-vite-plus-package@1.0.0
 test-vite-plus-package-optional@1.0.0

installed testnpm2@1.0.1

3 packages installed [<duration>]
```

## `vpt print-file package.json`

```
{
  "name": "command-update-bun",
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
  "packageManager": "bun@1.3.11"
}
```

## `vp up testnpm2 --latest`

应更新到绝对最新版本

```
bun update <version> (af24e281)

installed testnpm2@1.0.1

[<duration>] done
```

## `vpt print-file package.json`

```
{
  "name": "command-update-bun",
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
  "packageManager": "bun@1.3.11"
}
```
