# command_vpr

## `vpr -h`

应显示 vp run 帮助

```
VITE+ - Web 的统一工具链

用法：vp run [选项] [任务指定符] [附加参数]...

运行任务。

参数：
  [TASK_SPECIFIER]      `packageName#taskName` 或 `taskName`。省略时，列出所有可用任务
  [ADDITIONAL_ARGS]...  要传递给任务的附加参数

选项：
  -r, --recursive          选择工作区中的所有包
  -t, --transitive         选择当前包及其传递依赖
  -w, --workspace-root     选择工作区根包
  -F, --filter <FILTERS>   按名称、目录或 glob 模式匹配包
  --fail-if-no-match       如果筛选器未匹配到任何包，则以非零状态退出
  --ignore-depends-on      不运行 `dependsOn` 字段中指定的依赖
  -v, --verbose            执行后显示完整的详细摘要
  --cache                  强制为所有任务和脚本启用缓存
  --no-cache               强制为所有任务和脚本禁用缓存
  --log <MODE>             设置输出模式：交错、带标签或分组
  --concurrency-limit <N>  可同时运行的最大任务数（默认为：4）
  --parallel               在不考虑依赖顺序的情况下运行任务（默认不限制并发数）
  --last-details           显示上次运行的详细摘要
  -h, --help               打印帮助（使用“--help”查看更多）

筛选器模式：
  --filter <pattern>        按包名称选择（例如 foo、@scope/*）
  --filter ./<dir>          选择目录下的包
  --filter {<dir>}          与 ./<dir> 相同，但允许遍历后缀
  --filter <pattern>...     选择包及其依赖
  --filter ...<pattern>     选择包及其依赖包
  --filter <pattern>^...    仅选择依赖（排除包本身）
  --filter !<pattern>       排除与模式匹配的包

文档：https://viteplus.dev/guide/run
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

应传递额外的参数

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
