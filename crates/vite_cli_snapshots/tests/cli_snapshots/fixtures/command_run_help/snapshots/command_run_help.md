# 命令运行帮助

## `vp run --help`

```
VITE+ - Web 统一工具链

用法：vp run [选项] [任务说明符] [附加参数]...

运行任务。

参数：
  [任务说明符]          `packageName#taskName` 或 `taskName`。如果省略，则列出所有可用任务
  [附加参数]...          传递给任务的附加参数

选项：
  -r, --recursive          选择工作区中的所有包
  -t, --transitive         选择当前包及其传递依赖
  -w, --workspace-root     选择工作区根包
  -F, --filter <FILTERS>   按名称、目录或 glob 模式匹配包
  --fail-if-no-match       如果过滤器未匹配任何包，则以非零状态退出
  --ignore-depends-on      不运行 `dependsOn` 字段中指定的依赖项
  -v, --verbose            执行后显示完整的详细摘要
  --cache                  强制为所有任务和脚本启用缓存
  --no-cache               强制为所有任务和脚本禁用缓存
  --log <MODE>             设置输出模式：交错、标记或分组
  --concurrency-limit <N>  可同时运行的最大任务数（默认值：4）
  --parallel               在不遵循依赖顺序的情况下运行任务（默认使用不受限制的并发数）
  --last-details           显示上次运行的详细摘要
  -h, --help               打印帮助信息（使用“--help”查看更多内容）

过滤器模式：
  --filter <pattern>        按包名称选择（例如 foo、@scope/*）
  --filter ./<dir>          选择目录下的包
  --filter {<dir>}          与 ./<dir> 相同，但允许使用遍历后缀
  --filter <pattern>...     选择指定包及其依赖项
  --filter ...<pattern>     选择指定包及其依赖包
  --filter <pattern>^...    仅选择依赖项（排除包本身）
  --filter !<pattern>       排除匹配该模式的包

文档：https://viteplus.dev/guide/run
```

## `vp help run`

```
VITE+ - Web 的统一工具链

用法：vp run [选项] [任务说明符] [附加参数]...

运行任务。

参数：
  [任务说明符]          `packageName#taskName` 或 `taskName`。省略时列出所有可用任务
  [附加参数]...          传递给任务的附加参数

选项：
  -r, --recursive          选择工作区中的所有包
  -t, --transitive         选择当前包及其传递依赖
  -w, --workspace-root     选择工作区根包
  -F, --filter <筛选器>    按名称、目录或 glob 模式匹配包
  --fail-if-no-match       如果筛选器未匹配到任何包，则以非零状态退出
  --ignore-depends-on      不运行 `dependsOn` 字段中指定的依赖项
  -v, --verbose            执行后显示完整的详细摘要
  --cache                  强制为所有任务和脚本启用缓存
  --no-cache               强制为所有任务和脚本禁用缓存
  --log <模式>             设置输出模式：交错、带标签或分组
  --concurrency-limit <N>  同时运行的任务最大数量（默认：4）
  --parallel               不按依赖顺序运行任务（默认并发数不受限制）
  --last-details           显示上次运行的详细摘要
  -h, --help               显示帮助（使用“--help”查看更多）

筛选模式：
  --filter <模式>          按包名称选择（例如 foo、@scope/*）
  --filter ./<目录>        选择目录下的包
  --filter {<目录>}        与 ./<目录> 相同，但允许使用遍历后缀
  --filter <模式>...       选择包及其依赖项
  --filter ...<模式>       选择包及其依赖包
  --filter <模式>^...      仅选择依赖项（排除包自身）
  --filter !<模式>         排除匹配该模式的包

文档：https://viteplus.dev/guide/run
```
