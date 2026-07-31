# command_vpr

## `vpr -h`

应显示 vp run 帮助信息

```
运行任务

用法：vp run [选项] [任务指定符] [附加参数]...

参数：
  [任务指定符] [附加参数]...
          要运行的任务，格式为 `packageName#taskName` 或仅使用 `taskName`。
          任务名称之后的任何参数都会传递给任务进程。
          在不指定任务名称的情况下运行 `vp run`，会显示交互式任务选择器。

选项：
  -r, --recursive
          选择工作区中的所有包
  -t, --transitive
          选择当前包及其传递依赖
  -w, --workspace-root
          选择工作区根包
  -F, --filter <FILTERS>
          按名称、目录或 glob 模式匹配包
      --fail-if-no-match
          如果 `--filter` 表达式未匹配到任何包，则以非零状态退出
      --ignore-depends-on
          不运行 `dependsOn` 字段中指定的依赖项
  -v, --verbose
          执行后显示完整的详细摘要
      --cache
          强制为所有任务和脚本启用缓存
      --no-cache
          强制为所有任务和脚本禁用缓存
      --log <LOG>
          任务输出的显示方式 [默认值：interleaved] [可选值：interleaved、labeled、grouped]
      --concurrency-limit <CONCURRENCY_LIMIT>
          可同时运行的最大任务数。默认为 4
      --parallel
          在不考虑依赖顺序的情况下运行任务。如果同时指定了 `--concurrency-limit`，则并发数不受限制
      --last-details
          显示上次运行的详细摘要
  -h, --help
          打印帮助信息（使用 '--help' 查看更多）
```

## `vpr hello`

应通过 vpr 简写运行脚本

```
$ node args.mjs hello from script ⊘ cache disabled
hello
from
script
```

## `vpr greet --arg1 value1`

应传递额外参数

```
$ node args.mjs greet --arg1 value1 ⊘ cache disabled
greet
--arg1
value1
```

## `vpr nonexistent`

应显示 pnpm 缺少脚本错误

**退出代码：** 1

```
Task "nonexistent" not found.
```
