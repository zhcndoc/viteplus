# command_vp_alias

## `vp -h`

vp 应显示与 vite 相同的帮助信息

```
VITE+ - Web 的统一工具链

用法：vp <COMMAND>

核心命令：
  create         从模板创建新项目
  migrate        将现有项目迁移到 Vite+
  dev            运行开发服务器
  build          构建生产版本
  test           运行测试
  lint           检查代码
  fmt, format    格式化代码
  check          运行格式化、代码检查和类型检查
  pack           构建库
  run            运行任务
  exec           执行本地 node_modules/.bin 中的命令
  preview        预览生产构建
  cache          管理任务缓存
  config         配置钩子和代理集成
  staged         对暂存文件运行代码检查器

包管理器命令：
  install    安装所有依赖项，或在提供包名称时添加包

选项：
  -C <DIR>    在 <DIR> 中运行 vp，就像从该目录而非当前工作目录启动 vp
  -h, --help  打印帮助信息
```

## `vp run -h`

vp run 应显示帮助

```
VITE+ - Web 的统一工具链

用法：vp run [选项] [任务说明符] [附加参数]...

运行任务。

参数：
  [TASK_SPECIFIER]      `packageName#taskName` 或 `taskName`。如果省略，则显示任务选择器
  [ADDITIONAL_ARGS]...  要传递给任务的附加参数

选项：
  -r, --recursive          选择工作区中的所有包
  -t, --transitive         选择当前包及其传递依赖
  -w, --workspace-root     选择工作区根包
  -F, --filter <FILTERS>   按名称、目录或 glob 模式匹配包
  --fail-if-no-match       如果筛选器未匹配到任何包，则以非零状态退出
  --ignore-depends-on      不运行 `dependsOn` 字段中指定的依赖项
  -v, --verbose            执行后显示完整的详细摘要
  --cache                  强制为所有任务和脚本启用缓存
  --no-cache               强制为所有任务和脚本禁用缓存
  --log <MODE>             设置输出模式：交错（默认）、带标签或分组
  --concurrency-limit <N>  可同时运行的任务的最大数量（默认：4）
  --parallel               在不遵循依赖顺序的情况下运行任务；除非指定 `--concurrency-limit`，否则并发数不受限制
  --last-details           显示上次运行的详细摘要
  -h, --help               显示帮助

筛选模式：
  --filter <pattern>        按包名称选择（例如 foo、@scope/*）
  --filter ./<dir>          选择目录下的包
  --filter {<dir>}          与 ./<dir> 相同，但允许使用遍历后缀
  --filter <pattern>...     选择包及其依赖项
  --filter ...<pattern>     选择包及其依赖者
  --filter <pattern>^...    仅选择依赖项（排除包自身）
  --filter !<pattern>       排除与模式匹配的包

文档：https://viteplus.dev/guide/run
```
