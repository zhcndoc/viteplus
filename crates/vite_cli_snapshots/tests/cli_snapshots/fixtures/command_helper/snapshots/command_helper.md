# 命令助手

## `vp -h`

帮助信息

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
  staged         对暂存文件运行代码检查工具

包管理器命令：
  install    安装所有依赖，或在提供包名称时添加这些包

选项：
  -C <DIR>    在 <DIR> 中运行 vp，就像从该目录而非当前工作目录启动 vp
  -h, --help  显示帮助信息
```

## `vp pack -h`

pack 帮助信息

```
VITE+ - Web 的统一工具链

用法：vp pack [...FILES] [OPTIONS]

构建一个库。
选项将传递给 Vite+ Pack。

参数：
  [...FILES]  要打包的文件

选项：
  -f, --format <FORMAT>         打包格式：esm、cjs、iife、umd（默认：esm）
  --clean                       清理输出目录，使用 --no-clean 禁用
  --deps.never-bundle <MODULE>  将依赖标记为外部依赖
  --minify                      压缩输出
  --devtools                    启用 devtools 集成
  --debug [FEAT]                显示调试日志
  --target <TARGET>             打包目标，例如 "es2015"、"esnext"
  -l, --logLevel <LEVEL>        设置日志级别：info、warn、error、silent
  --fail-on-warn                遇到警告时失败（默认：true）
  --no-write                    禁止将文件写入磁盘，与监视模式不兼容（默认：true）
  -d, --out-dir <DIR>           输出目录（默认：dist）
  --treeshake                   对打包结果进行 Tree-shaking（默认：true）
  --sourcemap                   生成 source map（默认：false）
  --shims                       启用 cjs 和 esm shim（默认：false）
  --platform <PLATFORM>         目标平台（默认：node）
  --dts                         生成 dts 文件
  --publint                     启用 publint（默认：false）
  --attw                        启用 Are the types wrong 集成（默认：false）
  --unused                      启用未使用依赖检查（默认：false）
  -w, --watch [PATH]            监视模式
  --ignore-watch <PATH>         在监视模式下忽略自定义路径
  --from-vite [VITEST]          复用 Vite 或 Vitest 的配置
  --report                      大小报告（默认：true）
  --env.* <VALUE>               定义编译时环境变量
  --env-file <FILE>             从文件加载环境变量，与 --env 一起使用时，--env 中的变量优先级更高
  --env-prefix <PREFIX>         注入到打包结果中的环境变量前缀（默认：VITE_PACK_,TSDOWN_）
  --on-success <COMMAND>        成功时运行的命令
  --copy <DIR>                  将文件复制到输出目录
  --public-dir <DIR>            --copy 的别名，已弃用
  --tsconfig <TSCONFIG>         设置 tsconfig 路径
  --unbundle                    取消打包模式
  --root <DIR>                  输入文件的根目录
  --exe                         打包为可执行文件
  -W, --workspace [DIR]         启用工作区模式
  --concurrency <COUNT>         并行运行的 Rolldown 构建的最大数量
  -F, --filter <PATTERN>        过滤配置（cwd 或名称），例如 /pkg-name$/ 或 pkg-name
  --exports                     为 package.json 生成与导出相关的元数据（实验性）
  -h, --help                    显示此消息

示例：
  vp pack
  vp pack src/index.ts --dts
  vp pack --watch

文档：https://viteplus.dev/guide/pack
```

## `vp fmt -h`

fmt 帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp fmt [PATH]... [OPTIONS]

格式化代码。
选项将传递给 Oxfmt。

参数：
  [PATH]...  文件、目录或 glob 模式（默认为当前目录）

模式选项：
  --stdin-filepath <PATH>  指定用于推断 stdin 解析器的文件名

输出选项：
  --write           就地格式化并写入文件
  --check           检查文件是否已格式化并显示统计信息
  --list-different  列出将被更改的文件

忽略选项：
  --ignore-path <PATH>  忽略文件的路径；可以多次指定
  --with-node-modules   格式化 node_modules 中的文件，该目录默认会被跳过

运行时选项：
  --no-error-on-unmatched-pattern  当模式未匹配时不要退出并报错
  --threads <INT>                  要使用的线程数；设置为 1 可使用一个 CPU 核心

选项：
  -h, --help  打印帮助信息

示例：
  vp fmt
  vp fmt src --check
  vp fmt . --write

文档：https://viteplus.dev/guide/fmt
```

## `vp lint -h`

lint 帮助信息

```
VITE+ - The Unified Toolchain for the Web

Usage: vp lint [PATH]... [OPTIONS]

Lint code.
Options are forwarded to Oxlint.

Arguments:
  [PATH]...  Files or directories to lint

Basic Configuration:
  --tsconfig <PATH>  Override the TypeScript config used for import resolution

Rule Severity:
  -A, --allow <NAME>  Allow a rule or category
  -W, --warn <NAME>   Emit a warning for a rule or category
  -D, --deny <NAME>   Emit an error for a rule or category

Plugins:
  --disable-unicorn-plugin     Disable the unicorn plugin, which is enabled by default
  --disable-oxc-plugin         Disable Oxc-specific rules, which are enabled by default
  --disable-typescript-plugin  Disable the TypeScript plugin, which is enabled by default
  --import-plugin              Enable the import plugin
  --react-plugin               Enable the React plugin
  --jsdoc-plugin               Enable the JSDoc plugin
  --jest-plugin                Enable the Jest plugin
  --vitest-plugin              Enable the Vitest plugin
  --jsx-a11y-plugin            Enable the JSX accessibility plugin
  --nextjs-plugin              Enable the Next.js plugin
  --react-perf-plugin          Enable the React performance plugin
  --promise-plugin             Enable the promise plugin
  --node-plugin                Enable the Node.js plugin
  --vue-plugin                Enable the Vue plugin

Fix Problems:
  --fix              Fix issues when possible
  --fix-suggestions  Apply auto-fixable suggestions
  --fix-dangerously  Apply dangerous fixes and suggestions

Ignore Files:
  --ignore-path <PATH>        Use the specified .eslintignore file
  --ignore-pattern <PATTERN>  Add file patterns to ignore
  --no-ignore                 Disable file exclusion from ignore rules

Handle Warnings:
  --quiet               Report errors only
  --deny-warnings       Exit non-zero when warnings are reported
  --max-warnings <INT>  Set the warning threshold before exiting non-zero

Output:
  -f, --format <FORMAT>  Set output format: checkstyle, default, agent, github, gitlab, json, junit, sarif, stylish, or unix
  --debug <OPTIONS>      Enable comma-separated debug output options: files or timings

Miscellaneous:
  --silent                         Do not display diagnostics
  --no-error-on-unmatched-pattern  Do not exit with an error when no files are selected for linting
  --threads <INT>                  Number of threads to use; set to 1 to use one CPU core
  --print-config                   Print the resolved configuration without linting

Inline Configuration:
  --report-unused-disable-directives                      Report unused oxlint-disable directives
  --report-unused-disable-directives-severity <SEVERITY>  Report unused disable directives at the specified severity

Options:
  --rules       List all registered rules
  --type-aware  Enable rules requiring type information
  --type-check  Enable experimental type checking and compiler diagnostics
  -h, --help    Print help information

Examples:
  vp lint
  vp lint src --fix
  vp lint --type-aware --tsconfig ./tsconfig.json

Documentation: https://viteplus.dev/guide/lint
```

## `vp build -h`

构建帮助信息

```
VITE+ - Web 统一工具链

用法：vp build [ROOT] [OPTIONS]

构建生产版本。
选项将传递给 Vite。

参数：
  [ROOT]  项目根目录（默认：当前目录）

选项：
  --target <TARGET>             转译目标
  --outDir <DIR>                输出目录
  --assetsDir <DIR>             生成资源的目录
  --assetsInlineLimit <NUMBER>  静态资源内联阈值
  --ssr [ENTRY]                 构建用于服务端渲染的版本
  --sourcemap [MODE]            输出源映射
  --minify [MINIFIER]           启用或禁用压缩
  --manifest [NAME]             生成构建清单
  --ssrManifest [NAME]          生成 SSR 清单
  --emptyOutDir                 即使 outDir 位于根目录之外也清空它
  -w, --watch                   文件发生变化时重新构建
  --app                         使用构建器 API 构建应用
  --base <PATH>                 公共基础路径
  -l, --logLevel <LEVEL>        设置日志级别
  --clearScreen                 允许或禁用清屏
  -d, --debug [FEAT]            显示调试日志
  -f, --filter <FILTER>         筛选调试日志
  -m, --mode <MODE>             设置环境模式
  -h, --help                    打印帮助信息

示例：
  vp build
  vp build --watch
  vp build --sourcemap

文档：https://viteplus.dev/guide/build
```

## `vp test -h`

测试帮助信息

```
VITE+ - Web 的统一工具链

用法：vp test [COMMAND] [FILTERS]... [OPTIONS]

默认运行一次测试。
选项将传递给 Vitest。

命令：
  run      运行一次测试
  watch    以监视模式运行测试
  dev      以开发模式运行测试
  related  运行与已更改文件相关的测试
  bench    运行基准测试
  list     列出匹配的测试

参数：
  [FILTERS]...  测试文件筛选器

选项：
  -r, --root <PATH>                   根路径
  -u, --update [TYPE]                 更新快照（接受布尔值、"new"、"all" 或 "none"）
  -w, --watch                         启用监视模式
  -t, --testNamePattern <PATTERN>     运行完整名称匹配指定正则表达式模式的测试
  --dir <PATH>                        扫描测试文件的基础目录
  --ui                                启用 UI
  --open                              自动打开 UI（默认：!process.env.CI）
  --api [PORT]                        指定服务器端口；如果为 true，则默认为 51204
  --silent [VALUE]                    静默测试的控制台输出。使用 'passed-only' 仅查看失败测试的日志
  --hideSkippedTests                  隐藏跳过测试的日志
  --reporter <NAME>                   指定报告器（default、agent、minimal、blob、verbose、dot、json、tap、tap-flat、junit、tree、hanging-process、github-actions）
  --outputFile <FILENAME/-S>          将测试结果写入文件；对于多个报告器的单独输出，请使用点号表示法（例如：--outputFile.tap=./tap.txt）
  --coverage                          启用覆盖率报告
  --mode <NAME>                       覆盖 Vite 模式（默认：test 或 benchmark）
  --isolate                           隔离运行每个测试文件。使用 --no-isolate 禁用（默认：true）
  --globals                           全局注入 API
  --dom                               使用 happy-dom 模拟浏览器 API
  --browser <NAME>                    在浏览器中运行测试；等同于 --browser.enabled（默认：false）
  --pool <POOL>                       不在浏览器中运行时指定进程池（默认：forks）
  --execArgv <OPTION>                 生成工作线程或子进程时向 Node.js 传递额外参数
  --vmMemoryLimit <LIMIT>             VM 进程池的内存限制
  --fileParallelism                   并行运行测试文件。使用 --no-file-parallelism 禁用（默认：true）
  --maxWorkers <WORKERS>              运行测试的最大工作线程数或百分比
  --environment <NAME>                指定运行环境（默认：node）
  --passWithNoTests                   未找到测试时仍通过
  --logHeapUsage                      在 Node.js 中运行时显示每个测试的堆大小
  --detectAsyncLeaks                  检测测试文件中泄漏的异步资源（默认：false）
  --allowOnly                         允许标记为 only 的测试和测试套件（默认：!process.env.CI）
  --dangerouslyIgnoreUnhandledErrors  忽略发生的所有未处理错误
  --shard <SHARDS>                    要执行的测试套件分片，格式为 <index>/<count>
  --changed [SINCE]                   运行受已更改文件影响的测试（默认：false）
  --sequence <OPTIONS>                配置测试排序
  --inspect [[HOST:]PORT]             启用 Node.js 检查器（默认：127.0.0.1:9229）
  --inspectBrk [[HOST:]PORT]          启用 Node.js 检查器，并在测试开始前暂停
  --testTimeout <TIMEOUT>             默认测试超时时间（毫秒）（默认：5000；0 表示禁用）
  --hookTimeout <TIMEOUT>             默认钩子超时时间（毫秒）（默认：10000；0 表示禁用）
  --bail <NUMBER>                     在指定数量的失败后停止执行测试（默认：0）
  --retry <TIMES>                     重试失败的测试（默认：0）
  --diff <PATH>                       DiffOptions 对象或导出该对象的模块路径
  --exclude <GLOB>                    要从测试中排除的其他文件 glob
  --expandSnapshotDiff                快照失败时显示完整差异
  --disableConsoleIntercept           禁用对控制台日志的自动拦截（默认：false）
  --typecheck                         启用与测试并行的类型检查（默认：false）
  --project <NAME>                    按名称或通配符选择一个或多个 Vitest 工作区项目
  --slowTestThreshold <THRESHOLD>     将测试或测试套件视为缓慢的阈值（默认：<duration>）
  --teardownTimeout <TIMEOUT>         默认清理超时时间（毫秒）（默认：10000）
  --cache                             启用缓存
  --maxConcurrency <NUMBER>           最大并发测试和测试套件数量（默认：5）
  --expect                            配置 expect 匹配器
  --printConsoleTrace                 始终打印控制台堆栈跟踪
  --includeTaskLocation               收集测试和测试套件的位置，并存入 location 属性
  --attachmentsDir <DIR>              使用 context.annotate 创建的附件目录（默认：.vitest-attachments）
  --run                               禁用监视模式
  --no-color                          移除控制台输出中的颜色（默认：true）
  --clearScreen                       在监视模式下重新运行测试时清空终端（默认：true）
  --standalone                        启动 Vitest，但在文件发生更改前不运行测试（默认：false）
  --mergeReports [PATH]               合并之前记录的 blob 报告，但不运行测试
  --listTags [TYPE]                   列出可用标签；--list-tags=json 输出 JSON
  --clearCache                        删除所有 Vitest 缓存，但不运行测试
  --tagsFilter <EXPRESSION>           仅运行与标签表达式匹配的测试
  --strictTags                        测试使用未定义标签时出错（默认：true）
  --experimental <FEATURES>           启用实验性功能
  -h, --help                          显示此信息

基准测试选项：
  --compare <FILENAME>     要与之比较的基准测试输出文件
  --outputJson <FILENAME>  基准测试输出文件

列表选项：
  --json [TRUE/PATH]                将收集的测试打印为 JSON 或写入文件（默认：false）
  --filesOnly                       仅打印测试文件，不包含测试用例
  --staticParse                     静态解析文件，而不是运行文件（默认：false）
  --staticParseConcurrency <LIMIT>  并发处理的测试文件数量

示例：
  vp test
  vp test src/foo.test.ts
  vp test watch --coverage

文档：https://viteplus.dev/guide/test
```

## `vp preview -h`

preview 帮助信息

```
VITE+ - Web 的统一工具链

用法：vp preview [ROOT] [OPTIONS]

预览生产构建。
选项将转发给 Vite。

参数：
  [ROOT]  项目根目录（默认：当前目录）

选项：
  --host [HOST]           指定主机名
  --port <PORT>           指定端口
  --strictPort            如果指定端口已被占用则退出
  --open [PATH]           启动时打开浏览器
  --outDir <DIR>          要预览的输出目录
  --base <PATH>           公共基础路径
  -l, --logLevel <LEVEL>  设置日志级别
  --clearScreen           允许或禁用清屏
  -d, --debug [FEAT]      显示调试日志
  -f, --filter <FILTER>   筛选调试日志
  -m, --mode <MODE>       设置环境模式
  -h, --help              显示帮助

示例：
  vp preview
  vp preview --port 4173

文档：https://viteplus.dev/guide/build
```

## `vp dev -h`

dev 帮助信息

```
VITE+ - Web 统一工具链

用法：vp dev [ROOT] [OPTIONS]

运行开发服务器。
选项将转发给 Vite。

参数：
  [ROOT]  项目根目录（默认：当前目录）

选项：
  --host [HOST]           指定主机名
  --port <PORT>           指定端口
  --open [PATH]           启动时打开浏览器
  --cors                  启用 CORS
  --strictPort            如果指定端口已被占用则退出
  --force                 忽略优化器缓存并重新打包
  --experimentalBundle    使用实验性完整打包模式
  --base <PATH>           公共基础路径
  -l, --logLevel <LEVEL>  设置日志级别
  --clearScreen           允许或禁用清屏
  -d, --debug [FEAT]      显示调试日志
  -f, --filter <FILTER>   过滤调试日志
  -m, --mode <MODE>       设置环境模式
  -h, --help              打印帮助信息

示例：
  vp dev
  vp dev --open
  vp dev --host localhost --port 5173

文档：https://viteplus.dev/guide/dev
```
