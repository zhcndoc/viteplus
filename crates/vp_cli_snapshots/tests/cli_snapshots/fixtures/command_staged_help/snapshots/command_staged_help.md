# command_staged_help

## `vp staged -h`

```
VITE+ - Web 的统一工具链

用法：vp staged [选项]

使用 vite.config.ts 中的暂存配置对已暂存文件运行代码检查器。

选项：
  --allow-empty                      当任务还原所有已暂存更改时允许空提交
  -p, --concurrent <number|boolean>  并发运行的任务数，或设为 false 以串行运行
  --continue-on-error                即使某个任务失败，也运行所有任务直至完成
  --cwd <path>                       运行所有任务时使用的工作目录
  -d, --debug                        启用调试输出
  --diff <string>                    覆盖 git diff 默认的 --staged 标志
  --diff-filter <string>             覆盖 git diff 默认的 --diff-filter=ACMR 标志
  --fail-on-changes                  当任务修改已跟踪文件时，以退出码 1 失败
  --hide-partially-staged            隐藏部分暂存文件中的未暂存更改
  --hide-unstaged                    在运行任务前隐藏所有未暂存更改
  --no-stash                         禁用备份暂存
  -q, --quiet                        禁用控制台输出
  -r, --relative                     将相对于 cwd 的文件路径传递给任务
  --revert                           发生错误时还原到原始状态
  -v, --verbose                      即使任务成功也显示任务输出
  -h, --help                         显示此帮助信息

文档：https://viteplus.dev/guide/commit-hooks
```

## `vp staged --help`

```
VITE+ - Web 的统一工具链

用法：vp staged [选项]

使用 vite.config.ts 中的 staged 配置对已暂存文件运行代码检查器。

选项：
  --allow-empty                      当任务还原所有已暂存更改时允许空提交
  -p, --concurrent <number|boolean>  并发运行的任务数量，或使用 false 以串行运行
  --continue-on-error                即使某个任务失败，也运行所有任务直至完成
  --cwd <path>                       运行所有任务时使用的工作目录
  -d, --debug                        启用调试输出
  --diff <string>                    覆盖 git diff 的默认 --staged 标志
  --diff-filter <string>             覆盖 git diff 的默认 --diff-filter=ACMR 标志
  --fail-on-changes                  当任务修改已跟踪文件时，以退出代码 1 失败
  --hide-partially-staged            隐藏部分暂存文件中的未暂存更改
  --hide-unstaged                    运行任务前隐藏所有未暂存更改
  --no-stash                         禁用备份暂存
  -q, --quiet                        禁用控制台输出
  -r, --relative                     将相对于 cwd 的文件路径传递给任务
  --revert                           发生错误时还原到原始状态
  -v, --verbose                      即使任务成功，也显示任务输出
  -h, --help                         显示此帮助信息

文档：https://viteplus.dev/guide/commit-hooks
```

## `vp help staged`

```
VITE+ - Web 统一工具链

用法：vp staged [选项]

使用 vite.config.ts 中的 staged 配置对已暂存文件运行代码检查器。

选项：
  --allow-empty                      当任务还原所有已暂存更改时允许空提交
  -p, --concurrent <number|boolean>  并发运行的任务数，或使用 false 串行运行
  --continue-on-error                即使某个任务失败，也运行所有任务直至完成
  --cwd <path>                       运行所有任务时使用的工作目录
  -d, --debug                        启用调试输出
  --diff <string>                    覆盖 git diff 默认的 --staged 标志
  --diff-filter <string>             覆盖 git diff 默认的 --diff-filter=ACMR 标志
  --fail-on-changes                  当任务修改受跟踪文件时以退出代码 1 失败
  --hide-partially-staged            隐藏部分暂存文件中的未暂存更改
  --hide-unstaged                    运行任务前隐藏所有未暂存更改
  --no-stash                         禁用备份暂存
  -q, --quiet                        禁用控制台输出
  -r, --relative                     将相对于 cwd 的文件路径传递给任务
  --revert                           发生错误时还原到原始状态
  -v, --verbose                      即使任务成功，也显示任务输出
  -h, --help                         显示此帮助信息

文档：https://viteplus.dev/guide/commit-hooks
```
