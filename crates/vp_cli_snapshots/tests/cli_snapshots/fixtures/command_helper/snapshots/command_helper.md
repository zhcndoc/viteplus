# 命令辅助工具

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
  check          执行格式化、代码检查和类型检查
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
  -C <DIR>    在 <DIR> 中运行 vp，就像从该目录启动 vp，而不是当前工作目录
  -h, --help  打印帮助信息
```

## `vp pack -h`

pack 帮助信息

```
VITE+ - Web 的统一工具链

用法：vp pack [...files] [OPTIONS]

构建库。
选项将传递给 Vite+ Pack。

参数：
  [...files]  打包文件

选项：
  -f, --format <format>         打包格式：esm、cjs、iife、umd（默认：esm）
  --clean                       清理输出目录，使用 --no-clean 可禁用
  --deps.never-bundle <module>  将依赖标记为外部依赖
  --minify                      压缩输出
  --devtools                    启用 devtools 集成
  --debug [feat]                显示调试日志
  --target <target>             打包目标，例如 "es2015"、"esnext"
  -l, --logLevel <level>        设置日志级别：info、warn、error、silent
  --fail-on-warn                遇到警告时失败（默认：true）
  --no-write                    禁止将文件写入磁盘，与监听模式不兼容（默认：true）
  -d, --out-dir <dir>           输出目录（默认：dist）
  --treeshake                   对包进行 Tree-shaking（默认：true）
  --sourcemap                   生成 source map（默认：false）
  --shims                       启用 cjs 和 esm 垫片（默认：false）
  --platform <platform>         目标平台（默认：node）
  --dts                         生成 dts 文件
  --publint                     启用 publint（默认：false）
  --attw                        启用 Are the types wrong 集成（默认：false）
  --unused                      启用未使用依赖检查（默认：false）
  -w, --watch [path]            监听模式
  --ignore-watch <path>         在监听模式下忽略自定义路径
  --from-vite [vitest]          复用 Vite 或 Vitest 的配置
  --report                      大小报告（默认：true）
  --env.* <value>               定义编译时环境变量
  --env-file <file>             从文件加载环境变量，与 --env 一起使用时，--env 中的变量优先级更高
  --env-prefix <prefix>         注入包中的环境变量前缀（默认：TSDOWN_）
  --on-success <command>        成功时运行的命令
  --copy <dir>                  将文件复制到输出目录
  --public-dir <dir>            --copy 的别名，已弃用
  --tsconfig <tsconfig>         设置 tsconfig 路径
  --unbundle                    取消打包模式
  --root <dir>                  输入文件的根目录
  --exe                         将包构建为可执行文件
  -W, --workspace [dir]         启用工作区模式
  --concurrency <count>         并行运行的 Rolldown 构建任务的最大数量
  -F, --filter <pattern>        筛选配置（cwd 或名称），例如 /pkg-name$/ 或 pkg-name
  --exports                     为 package.json 生成与导出相关的元数据（实验性）
  -h, --help                    显示此信息

示例：
  vp pack
  vp pack src/index.ts --dts
  vp pack --watch

文档：https://viteplus.dev/guide/pack
```

## `vp fmt -h`

fmt 帮助信息

```
VITE+ - Web 的统一工具链

用法：vp fmt [PATH]... [OPTIONS]

格式化代码。
选项将转发给 Oxfmt。

可用的位置参数：
  [PATH]...  单个文件、路径或路径列表。也支持 glob 模式。（请务必将其用引号括起来，否则 shell 可能会在传递前展开它们。）也支持使用 `!` 前缀的排除模式，例如 `'!**/fixtures/*.js'`。如果未提供，则使用当前工作目录。

模式选项：
  --stdin-filepath=PATH  指定用于推断解析器的文件名

输出选项：
  --write           就地格式化并写入文件（默认）
  --check           检查文件是否已格式化，同时显示统计信息
  --list-different  列出将被更改的文件

忽略选项：
  --ignore-path=PATH   要忽略的文件路径。可以多次指定。如果未指定，则使用当前目录中的 .gitignore 和 .prettierignore。
  --with-node-modules  格式化 node_modules 目录中的代码（默认跳过）

运行时选项：
  --no-error-on-unmatched-pattern  当模式未匹配时不退出并报错
  --threads=INT                    要使用的线程数。设置为 1 可仅使用 1 个 CPU 核心。

可用选项：
  -h, --help  显示帮助信息

示例：
  vp fmt
  vp fmt src --check
  vp fmt . --write

文档：https://viteplus.dev/guide/fmt
```

## `vp lint -h`

lint 帮助信息

```
VITE+ - Web 的统一工具链

用法：vp lint [PATH]... [OPTIONS]

检查代码。
选项会传递给 Oxlint。

可用的位置参数：
  [PATH]...  单个文件、单个路径或路径列表

基本配置：
  --tsconfig=<./tsconfig.json>  覆盖用于导入解析的 TypeScript 配置。Oxlint 会自动为每个文件查找相关的 `tsconfig.json`。仅当项目使用非标准的 tsconfig 名称或位置时才使用此选项。

允许/禁止多个检查：
  在命令行中从左到右累积规则和类别。
  例如 `-D correctness -A no-debugger` 或 `-A all -D no-debugger`。
  类别包括：
  * `correctness` - 明显错误或无用的代码（默认）
  * `suspicious`  - 很可能错误或无用的代码
  * `pedantic`    - 相当严格或偶尔会产生误报的检查
  * `perf`        - 可以用性能更高的方式编写的代码
  * `style`       - 应以更符合惯用方式编写的代码
  * `restriction` - 禁止使用语言和库特性的检查
  * `nursery`     - 仍在开发中的新检查
  * `all`         - 上述除 `nursery` 外的所有类别。不会自动启用插件。
  -A, --allow=NAME  允许规则或类别（抑制检查）
  -W, --warn=NAME   对规则或类别发出警告（产生警告）
  -D, --deny=NAME   禁止规则或类别（产生错误）

启用/禁用插件：
  --disable-unicorn-plugin     禁用默认启用的 unicorn 插件
  --disable-oxc-plugin         禁用默认启用的 oxc 独有规则
  --disable-typescript-plugin  禁用默认启用的 TypeScript 插件
  --import-plugin              启用 import 插件并检测 ESM 问题。
  --react-plugin               启用 react 插件，默认关闭
  --jsdoc-plugin               启用 jsdoc 插件并检测 JSDoc 问题
  --jest-plugin                启用 Jest 插件并检测测试问题
  --vitest-plugin              启用 Vitest 插件并检测测试问题
  --jsx-a11y-plugin            启用 JSX-a11y 插件并检测可访问性问题
  --nextjs-plugin              启用 Next.js 插件并检测 Next.js 问题
  --react-perf-plugin          启用 React 性能插件并检测渲染性能问题
  --promise-plugin             启用 promise 插件并检测 promise 使用问题
  --node-plugin                启用 node 插件并检测 node 使用问题
  --vue-plugin                 启用 vue 插件并检测 vue 使用问题

修复问题：
  --fix              尽可能修复问题。输出中只报告未修复的问题。
  --fix-suggestions  应用可自动修复的建议。可能会改变程序行为。
  --fix-dangerously  应用危险的修复和建议

忽略文件：
  --ignore-path=PATH    指定用作 `.eslintignore` 的文件
  --ignore-pattern=PAT  指定要忽略的文件模式（在 `.eslintignore` 之外追加）
  --no-ignore           禁止根据 `.eslintignore` 文件、--ignore-path 标志和 --ignore-pattern 标志排除文件

处理警告：
  --quiet             禁止报告警告，仅报告错误
  --deny-warnings     确保警告产生非零退出代码
  --max-warnings=INT  指定警告阈值，可用于在项目中存在过多警告级别的规则违规时强制以错误状态退出

输出：
  -f, --format=ARG  使用特定的输出格式。可能的值：`checkstyle`、`default`、`agent`、`github`、`gitlab`、`json`、`junit`、`sarif`、`stylish`、`unix`
  --debug=OPTIONS   启用调试输出选项。选项以逗号分隔。可能的值：
                     * `files` - 输出将要检查的文件列表，然后退出。
                     * `timings` - 启用按规则统计的耗时信息。

其他：
  --silent                         不显示任何诊断信息
  --no-error-on-unmatched-pattern  未选择任何文件进行检查时不以错误退出（例如，应用忽略模式后）
  --threads=INT                    要使用的线程数。设置为 1 时仅使用 1 个 CPU 核心。
  --print-config                   此选项输出要使用的配置。启用后不会执行检查，且仅配置相关选项有效。

内联配置注释：
  --report-unused-disable-directives                    报告类似 `// oxlint-disable-line` 的指令注释，即使该行原本不会报告任何错误
  --report-unused-disable-directives-severity=SEVERITY  与 `--report-unused-disable-directives` 相同，但允许指定所报告错误的严重级别。这两个选项不能同时使用。

可用选项：
  --rules       列出当前已注册的所有规则
  --type-aware  启用需要类型信息的规则
  --type-check  启用实验性的类型检查（包括 TypeScript 编译器诊断）
  -h, --help    打印帮助信息

示例：
  vp lint
  vp lint src --fix
  vp lint --type-aware --tsconfig ./tsconfig.json

文档：https://viteplus.dev/guide/lint
```

## `vp build -h`

构建帮助信息

```
VITE+ - Web 的统一工具链

用法：vp build [ROOT] [OPTIONS]

为生产环境构建。
选项将转发给 Vite。

参数：
  [ROOT]  项目根目录（默认：当前目录）

选项：
  --target <target>             [string] 转译目标（默认：'baseline-widely-available'）
  --outDir <dir>                [string] 输出目录（默认：dist）
  --assetsDir <dir>             [string] 在 outDir 下放置资源的目录（默认：assets）
  --assetsInlineLimit <number>  [number] 静态资源以内联 Base64 的字节数阈值（默认：4096）
  --ssr [entry]                 [string] 为服务端渲染构建指定的入口
  --sourcemap [output]          [boolean | "inline" | "hidden"] 为构建输出源映射（默认：false）
  --minify [minifier]           [boolean | "oxc" | "terser" | "esbuild"] 启用/禁用压缩，或指定要使用的压缩器（默认：oxc）
  --manifest [name]             [boolean | string] 输出构建清单 JSON
  --ssrManifest [name]          [boolean | string] 输出 SSR 清单 JSON
  --emptyOutDir                 [boolean] 当 outDir 位于根目录之外时强制清空
  -w, --watch                   [boolean] 磁盘上的模块发生更改时重新构建
  --app                         [boolean] 等同于 `builder: {}`
  --base <path>                 [string] 公共基础路径（默认：/）
  -l, --logLevel <level>        [string] info | warn | error | silent
  --clearScreen                 [boolean] 允许/禁用日志记录时清屏
  -d, --debug [feat]            [string | boolean] 显示调试日志
  -f, --filter <filter>         [string] 过滤调试日志
  -m, --mode <mode>             [string] 设置环境模式
  -h, --help                    显示此消息

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

默认执行一次测试。
选项将转发给 Vitest。

命令：
  run      执行一次测试
  watch    以监视模式运行测试
  dev      以开发模式运行测试
  related  运行与已更改文件相关的测试
  bench    运行基准测试
  list     列出匹配的测试

参数：
  [FILTERS]...  测试文件过滤器

选项：
  -r, --root <path>                   根路径
  -u, --update [type]                 更新快照（接受布尔值、"new"、"all" 或 "none"）
  -w, --watch                         启用监视模式
  -t, --testNamePattern <pattern>     运行完整名称匹配指定正则表达式模式的测试
  --dir <path>                        扫描测试文件的基础目录
  --ui                                启用 UI
  --open                              自动打开 UI（默认：!process.env.CI）
  --api [port]                        指定服务器端口。注意，如果端口已被占用，Vite 将自动尝试下一个可用端口，因此该端口可能不是服务器最终监听的实际端口。如果为 true，则设置为 51204。使用 '--help --api' 获取更多信息。
  --silent [value]                    静默测试中的控制台输出。使用 'passed-only' 仅查看失败测试的日志。
  --hideSkippedTests                  隐藏跳过测试的日志
  --reporter <name>                   指定报告器（default、agent、minimal、blob、verbose、dot、json、tap、tap-flat、junit、tree、hanging-process、github-actions）
  --outputFile <filename/-s>          将测试结果写入文件，同时必须指定 supporter reporter；对于多个报告器的单独输出，使用 cac 的点号表示法（示例：--outputFile.tap=./tap.txt）
  --coverage                          启用覆盖率报告。使用 '--help --coverage' 获取更多信息。
  --mode <name>                       覆盖 Vite 模式（默认：test 或 benchmark）
  --isolate                           隔离运行每个测试文件。要禁用隔离，请使用 --no-isolate（默认：true）
  --globals                           全局注入 API
  --dom                               使用 happy-dom 模拟浏览器 API
  --browser <name>                    在浏览器中运行测试。等同于 --browser.enabled（默认：false）。使用 '--help --browser' 获取更多信息。
  --pool <pool>                       指定池；不在浏览器中运行时使用（默认：forks）
  --execArgv <option>                 在生成 worker_threads 或 child_process 时向 node 进程传递额外参数。
  --vmMemoryLimit <limit>             VM 池的内存限制。如果发现内存泄漏，请尝试调整此值。
  --fileParallelism                   是否并行运行所有测试文件。使用 --no-file-parallelism 禁用（默认：true）
  --maxWorkers <workers>              运行测试的最大 worker 数量或百分比
  --environment <name>                指定运行环境；不在浏览器中运行时使用（默认：node）
  --passWithNoTests                   未找到测试时仍视为通过
  --logHeapUsage                      在 node 中运行时显示每个测试的堆大小
  --detectAsyncLeaks                  检测测试文件中泄漏的异步资源（默认：false）
  --allowOnly                         允许运行标记为 only 的测试和测试套件（默认：!process.env.CI）
  --dangerouslyIgnoreUnhandledErrors  忽略发生的所有未处理错误
  --shard <shards>                    以 <index>/<count> 格式执行测试套件分片
  --changed [since]                   运行受已更改文件影响的测试（默认：false）
  --sequence <options>                测试排序方式的选项。使用 '--help --sequence' 获取更多信息。
  --inspect [[host:]port]             启用 Node.js 检查器（默认：127.0.0.1:9229）
  --inspectBrk [[host:]port]          启用 Node.js 检查器，并在测试开始前暂停
  --testTimeout <timeout>             测试的默认超时时间（以毫秒为单位，默认：5000）。使用 0 可完全禁用超时。
  --hookTimeout <timeout>             hook 的默认超时时间（以毫秒为单位，默认：10000）。使用 0 可完全禁用超时。
  --bail <number>                     当失败测试达到指定数量时停止执行测试（默认：0）
  --retry <times>                     测试失败时重试指定次数（默认：0）。使用 '--help --retry' 获取更多信息。
  --diff <path>                       DiffOptions 对象，或导出 DiffOptions 对象的模块路径。使用 '--help --diff' 获取更多信息。
  --exclude <glob>                    要从测试中排除的其他文件 glob
  --expandSnapshotDiff                快照失败时显示完整差异
  --disableConsoleIntercept           禁用对控制台日志的自动拦截（默认：false）
  --typecheck                         启用与测试同时进行的类型检查（默认：false）。使用 '--help --typecheck' 获取更多信息。
  --project <name>                    使用 Vitest workspace 功能时要运行的项目名称。可以重复此选项以指定多个项目：--project=1 --project=2。也可以使用通配符筛选项目，例如 --project=packages*，并使用 --project=!pattern 排除项目。
  --slowTestThreshold <threshold>     将测试或测试套件视为运行缓慢的阈值（以毫秒为单位，默认：300）
  --teardownTimeout <timeout>         teardown 函数的默认超时时间（以毫秒为单位，默认：10000）
  --cache                             启用缓存。使用 '--help --cache' 获取更多信息。
  --maxConcurrency <number>           测试文件执行期间并发测试和测试套件的最大数量（默认：5）
  --expect                            expect() 匹配的配置选项。使用 '--help --expect' 获取更多信息。
  --printConsoleTrace                 始终打印控制台堆栈跟踪
  --includeTaskLocation               收集测试和测试套件的位置，并存储在 location 属性中
  --attachmentsDir <dir>              存储 context.annotate 附件的目录（默认：.vitest-attachments）
  --run                               禁用监视模式
  --no-color                          移除控制台输出中的颜色（默认：true）
  --clearScreen                       在监视模式下重新运行测试时清空终端屏幕（默认：true）
  --standalone                        启动 Vitest 而不运行测试。仅在发生更改时运行测试。如果启用浏览器模式，将自动打开 UI。传入 CLI 文件过滤器时，此选项会被忽略。（默认：false）
  --mergeReports [path]               blob 报告目录的路径。如果使用此选项，Vitest 不会运行任何测试，而只会报告之前记录的测试
  --listTags [type]                   列出所有可用标签，而不是运行测试。--list-tags=json 将以 JSON 格式输出标签，除非不存在标签。
  --clearCache                        删除所有 Vitest 缓存，包括 experimental.fsModuleCache，但不运行任何测试。这会降低后续测试运行的性能。
  --tagsFilter <expression>           仅运行带有指定标签的测试。可以使用逻辑运算符 &&（与）、||（或）和 !（非）创建复杂表达式，详情请参见 https://vitest.dev/guide/test-tags#syntax。
  --strictTags                        如果测试使用了配置中未定义的标签，Vitest 是否应抛出错误。（默认：true）
  --experimental <features>           实验性功能。使用 '--help --experimental' 获取更多信息。
  -h, --help                          显示此信息

基准测试选项：
  --compare <filename>     要比较的基准测试输出文件
  --outputJson <filename>  基准测试输出文件

列表选项：
  --json [true/path]                将收集的测试打印为 JSON，或写入文件（默认：false）
  --filesOnly                       仅打印测试文件，不包含测试用例
  --staticParse                     静态解析文件，而不是运行文件来收集测试（默认：false）
  --staticParseConcurrency <limit>  同时处理的测试数量（默认：os.availableParallelism()）

示例：
  vp test
  vp test src/foo.test.ts
  vp test watch --coverage

文档：https://viteplus.dev/guide/test
```

## `vp preview -h`

预览帮助信息

```
VITE+ - The Unified Toolchain for the Web

Usage: vp preview [ROOT] [OPTIONS]

Preview a production build.
Options are forwarded to Vite.

Arguments:
  [ROOT]  Project root directory (default: current directory)

Options:
  --host [host]           [string] specify hostname
  --port <port>           [number] specify port
  --strictPort            [boolean] exit if specified port is already in use
  --open [path]           [boolean | string] open browser on startup
  --outDir <dir>          [string] output directory (default: dist)
  --base <path>           [string] public base path (default: /)
  -l, --logLevel <level>  [string] info | warn | error | silent
  --clearScreen           [boolean] allow/disable clear screen when logging
  -d, --debug [feat]      [string | boolean] show debug logs
  -f, --filter <filter>   [string] filter debug logs
  -m, --mode <mode>       [string] set env mode
  -h, --help              Display this message

Examples:
  vp preview
  vp preview --port 4173

Documentation: https://viteplus.dev/guide/build
```

## `vp dev -h`

dev 帮助信息

```
VITE+ - Web 的统一工具链

用法：vp dev [ROOT] [OPTIONS]

运行开发服务器。
选项将传递给 Vite。

参数：
  [ROOT]  项目根目录（默认：当前目录）

选项：
  --host [host]           [string] 指定主机名
  --port <port>           [number] 指定端口
  --open [path]           [boolean | string] 启动时打开浏览器
  --cors                  [boolean] 启用 CORS
  --strictPort            [boolean] 如果指定端口已被占用则退出
  --force                 [boolean] 强制优化器忽略缓存并重新打包
  --experimentalBundle    [boolean] 使用实验性完整打包模式（高度实验性）
  --base <path>           [string] 公共基础路径（默认：/）
  -l, --logLevel <level>  [string] info | warn | error | silent
  --clearScreen           [boolean] 允许/禁用日志记录时清屏
  -d, --debug [feat]      [string | boolean] 显示调试日志
  -f, --filter <filter>   [string] 过滤调试日志
  -m, --mode <mode>       [string] 设置环境模式
  -h, --help              显示此信息

示例：
  vp dev
  vp dev --open
  vp dev --host localhost --port 5173

文档：https://viteplus.dev/guide/dev
```
