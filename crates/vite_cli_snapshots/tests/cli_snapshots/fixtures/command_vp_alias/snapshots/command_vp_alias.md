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
  -h, --help  打印帮助信息
```

## `vp run -h`

vp run 应显示帮助

```
运行任务

用法：vp run [选项] [任务说明符] [附加参数]...

参数：
  [任务说明符] [附加参数]...
          要运行的任务，格式为 `packageName#taskName` 或仅使用 `taskName`。
          任务名称之后的任何参数都会传递给任务进程。
          不带任务名称运行 `vp run` 将显示交互式任务选择器。

选项：
  -r, --recursive
          选择工作区中的所有软件包
  -t, --transitive
          选择当前软件包及其传递依赖项
  -w, --workspace-root
          选择工作区根软件包
  -F, --filter <FILTERS>
          按名称、目录或 glob 模式匹配软件包
      --fail-if-no-match
          如果 `--filter` 表达式未匹配任何软件包，则以非零状态退出
      --ignore-depends-on
          不运行 `dependsOn` 字段中指定的依赖项
  -v, --verbose
          执行后显示完整的详细摘要
      --cache
          强制为所有任务和脚本启用缓存
      --no-cache
          强制为所有任务和脚本禁用缓存
      --log <LOG>
          任务输出的显示方式 [默认：interleaved] [可选值：interleaved、labeled、grouped]
      --concurrency-limit <CONCURRENCY_LIMIT>
          可同时运行的最大任务数。默认为 4
      --parallel
          在不考虑依赖顺序的情况下运行任务。除非同时指定 `--concurrency-limit`，否则将并发数设置为无限
      --last-details
          显示上次运行的详细摘要
  -h, --help
          打印帮助（使用“--help”查看更多内容）
```
