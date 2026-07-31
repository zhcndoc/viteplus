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
  -h, --help  打印帮助信息
```

## `vp pack -h`

pack 帮助信息

```
vp pack

用法：
  $ vp pack [...files]

命令：
  [...files]  打包文件

如需更多信息，请使用 `--help` 标志运行任意命令：
  $ vp pack --help

选项：
  --config-loader <loader>      要使用的配置加载器：auto、native、tsx、unrun（默认：auto）
  --no-config                   禁用配置文件（默认：true）
  -f, --format <format>         打包格式：esm、cjs、iife、umd（默认：esm）
  --clean                       清理输出目录，使用 --no-clean 禁用
  --deps.never-bundle <module>  将依赖标记为外部依赖
  --minify                      压缩输出
  --devtools                    启用 devtools 集成
  --debug [feat]                显示调试日志
  --target <target>             打包目标，例如 "es2015"、"esnext"
  -l, --logLevel <level>        设置日志级别：info、warn、error、silent
  --fail-on-warn                遇到警告时失败（默认：true）
  --no-write                    禁止将文件写入磁盘，与监听模式不兼容（默认：true）
  -d, --out-dir <dir>           输出目录（默认：dist）
  --treeshake                   对打包内容进行 Tree-shaking（默认：true）
  --sourcemap                   生成 source map（默认：false）
  --shims                       启用 cjs 和 esm shims（默认：false）
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
  --env-prefix <prefix>         要注入到打包内容中的环境变量前缀（默认：VITE_PACK_,TSDOWN_）
  --on-success <command>        成功时要运行的命令
  --copy <dir>                  将文件复制到输出目录
  --public-dir <dir>            --copy 的别名，已弃用
  --tsconfig <tsconfig>         设置 tsconfig 路径
  --unbundle                    非打包模式
  --root <dir>                  输入文件的根目录
  --exe                         打包为可执行文件
  -W, --workspace [dir]         启用工作区模式
  --concurrency <count>         并行运行的 Rolldown 构建任务的最大数量
  -F, --filter <pattern>        过滤配置（cwd 或名称），例如 /pkg-name$/ 或 pkg-name
  --exports                     为 package.json 生成与导出相关的元数据（实验性）
  -h, --help                    显示此帮助信息
```

## `vp fmt -h`

fmt 帮助信息

```
用法：[-c=PATH] [PATH]...

模式选项：
        --init               使用默认值初始化 `.oxfmtrc.json`
        --migrate=SOURCE     从指定来源迁移配置到 `.oxfmtrc.json`
                             可用来源：prettier、biome
        --lsp                启动语言服务器协议（LSP）服务器
        --stdin-filepath=PATH  指定用于推断所使用解析器的文件名

输出选项：
        --write              就地格式化并写入文件（默认）
        --check              检查文件是否已格式化，同时显示统计信息
        --list-different     列出将被更改的文件

配置选项
    -c, --config=PATH        配置文件路径（.json、.jsonc、.ts、.mts、.cts、.js、
                             .mjs、.cjs）
        --disable-nested-config  不在子目录中搜索配置文件

忽略选项
        --ignore-path=PATH   忽略文件的路径。可以多次指定。如果未指定，则使用当前目录中的
                             .gitignore 和 .prettierignore。
        --with-node-modules  格式化 node_modules 目录中的代码（默认跳过）

运行时选项
        --no-error-on-unmatched-pattern  当模式不匹配时不以错误退出
        --threads=INT        要使用的线程数。设置为 1 以仅使用 1 个 CPU 核心。

可用的位置参数：
    PATH                     单个文件、路径或路径列表。也支持 Glob 模式。
                             （请务必将其放在引号中，否则 shell 可能会在传递之前将其展开。）
                             也支持使用 `!` 前缀排除模式，例如 `'!**/fixtures/*.js'`。
                             如果未提供，则使用当前工作目录。

可用选项：
    -h, --help               打印帮助信息
    -V, --version            打印版本信息
```

## `vp lint -h`

lint 帮助信息

```
用法：[-c=<./.oxlintrc.json>] [PATH]...

基本配置
    -c, --config=<./.oxlintrc.json>  Oxlint 配置文件
                              * `.json` 和 `.jsonc` 配置文件在所有运行时中均受支持
                              * JavaScript/TypeScript 配置文件仍处于实验阶段，要求通过 Node.js
                              运行
                              * 配置文件中可以使用注释。
                              * 尝试兼容 ESLint v8 的格式
        --tsconfig=<./tsconfig.json>  覆盖用于导入解析的 TypeScript 配置。
                              Oxlint 会自动为每个文件查找相关的 `tsconfig.json`。仅当你的项目使用
                              非标准的 tsconfig 名称或位置时才使用此选项。
        --init                使用默认值初始化 oxlint 配置

允许 / 禁止多个 lint 规则
   在命令行中从左到右累积规则和类别。
   例如 `-D correctness -A no-debugger` 或 `-A all -D no-debugger`。
   类别包括：
   * `correctness` - 完全错误或无用的代码（默认）
   * `suspicious`  - 很可能错误或无用的代码
   * `pedantic`    - 相当严格或偶尔会产生误报的 lint 规则
   * `perf`        - 可以用更高性能的方式编写的代码
   * `style`       - 应以更符合惯用方式编写的代码
   * `restriction` - 禁止使用语言和库功能的 lint 规则
   * `nursery`     - 仍在开发中的新 lint 规则
   * `all`         - 上述除 `nursery` 外的所有类别。不自动启用插件
  -A, --allow=NAME          允许该规则或类别（抑制 lint）
    -W, --warn=NAME           禁止该规则或类别（发出警告）
    -D, --deny=NAME           禁止该规则或类别（发出错误）

启用/禁用插件
        --disable-unicorn-plugin  禁用默认开启的 unicorn 插件
        --disable-oxc-plugin  禁用默认开启的 oxc 特有规则
        --disable-typescript-plugin  禁用默认开启的 TypeScript 插件
        --import-plugin       启用 import 插件并检测 ESM 问题。
        --react-plugin        启用默认关闭的 react 插件
        --jsdoc-plugin        启用 jsdoc 插件并检测 JSDoc 问题
        --jest-plugin         启用 Jest 插件并检测测试问题
        --vitest-plugin       启用 Vitest 插件并检测测试问题
        --jsx-a11y-plugin     启用 JSX-a11y 插件并检测无障碍问题
        --nextjs-plugin       启用 Next.js 插件并检测 Next.js 问题
        --react-perf-plugin   启用 React 性能插件并检测渲染性能
                              问题
        --promise-plugin      启用 promise 插件并检测 promise 使用问题
        --node-plugin         启用 node 插件并检测 node 使用问题
        --vue-plugin          启用 vue 插件并检测 vue 使用问题

修复问题
        --fix                 尽可能修复问题。输出中只报告未修复的问题。
        --fix-suggestions     应用可自动修复的建议。可能会改变程序行为。
        --fix-dangerously     应用危险的修复和建议

忽略文件
        --ignore-path=PATH    指定用作 `.eslintignore` 的文件
        --ignore-pattern=PAT  指定要忽略的文件模式（在 `.eslintignore` 中的模式之外追加）
        --no-ignore           禁止根据 `.eslintignore` 文件、--ignore-path
                              标志和 --ignore-pattern 标志排除文件

处理警告
        --quiet               禁止报告警告，只报告错误
        --deny-warnings       确保警告产生非零退出代码
        --max-warnings=INT    指定警告阈值。如果项目中存在过多警告级别的规则违规，
                              可使用此选项强制以错误状态退出

输出
    -f, --format=ARG          使用特定的输出格式。可能的值：`checkstyle`、
                              `default`、`agent`、`github`、`gitlab`、`json`、`junit`、
                              `sarif`、`stylish`、`unix`
        --debug=OPTIONS       启用调试输出选项。选项以逗号分隔。可能的值：
                               * `files` - 打印将要进行 lint 的文件列表，然后退出。
                               * `timings` - 启用按规则统计的耗时信息。

其他
        --silent              不显示任何诊断信息
        --no-error-on-unmatched-pattern  当没有文件被选中进行 lint 时不以错误退出
                              （例如应用忽略模式后）
        --threads=INT         要使用的线程数。设置为 1 表示只使用 1 个 CPU 核心。
        --print-config        此选项输出将使用的配置。存在此选项时不会执行 lint，
                              且只有与配置相关的选项有效。

内联配置注释
        --report-unused-disable-directives  报告类似 `// oxlint-disable-line` 的指令注释，
                              即使该行本来不会报告任何错误
        --report-unused-disable-directives-severity=SEVERITY  与
                              `--report-unused-disable-directives` 相同，但允许你指定
                              所报告错误的严重级别。这两个选项一次只能使用一个。

可用的位置参数：
    PATH                      单个文件、单个路径或路径列表

可用选项：
        --rules               列出当前已注册的所有规则
        --lsp                 启动语言服务器
        --disable-nested-config  禁止自动加载嵌套配置文件
        --type-aware          启用需要类型信息的规则
        --type-check          启用实验性类型检查（包括 TypeScript 编译器诊断）
    -h, --help                打印帮助信息
    -V, --version             打印版本信息
```

## `vp build -h`

构建帮助信息

```
vp/<version>

用法：
  $ vp build [root]

选项：
  --target <target>             [string] 转译目标（默认：'baseline-widely-available'）
  --outDir <dir>                [string] 输出目录（默认：dist）
  --assetsDir <dir>             [string] 在 outDir 下放置资源的目录（默认：assets）
  --assetsInlineLimit <number>  [number] 静态资源 base64 内联阈值（字节）（默认：4096）
  --ssr [entry]                 [string] 为服务端渲染构建指定入口
  --sourcemap [output]          [boolean | "inline" | "hidden"] 为构建输出源映射（默认：false）
  --minify [minifier]           [boolean | "oxc" | "terser" | "esbuild"] 启用/禁用压缩，或指定要使用的压缩器（默认：oxc）
  --manifest [name]             [boolean | string] 输出构建清单 json
  --ssrManifest [name]          [boolean | string] 输出 ssr 清单 json
  --emptyOutDir                 [boolean] 当 outDir 位于 root 之外时强制清空 outDir
  -w, --watch                   [boolean] 磁盘上的模块发生更改时重新构建
  --app                         [boolean] 与 `builder: {}` 相同
  -c, --config <file>           [string] 使用指定的配置文件
  --base <path>                 [string] 公共基础路径（默认：/）
  -l, --logLevel <level>        [string] info | warn | error | silent
  --clearScreen                 [boolean] 允许/禁用日志记录时清屏
  --configLoader <loader>       [string] 使用 'bundle' 通过 Rolldown 打包配置，或使用 'runner'（实验性）即时处理，或使用 'native'（实验性）通过原生运行时加载（默认：bundle）
  -d, --debug [feat]            [string | boolean] 显示调试日志
  -f, --filter <filter>         [string] 过滤调试日志
  -m, --mode <mode>             [string] 设置环境模式
  -h, --help                    显示此消息
```

## `vp test -h`

测试帮助信息

```
vitest/4.1.10
 WARN: no options were found for your subcommands so we printed the whole output

Usage:
  $ vitest [...filters]

Commands:
  run [...filters]
  related [...filters]
  watch [...filters]
  dev [...filters]
  bench [...filters]
  init <project>
  list [...filters]
  [...filters]
  complete [shell]

For more info, run any command with the `--help` flag:
  $ vitest run --help
  $ vitest related --help
  $ vitest watch --help
  $ vitest dev --help
  $ vitest bench --help
  $ vitest init --help
  $ vitest list --help
  $ vitest --help
  $ vitest complete --help
  $ vitest --help --expand-help

Options:
  -v, --version                                              Display version number
  -r, --root <path>                                          Root path
  -c, --config <path>                                        Path to config file
  -u, --update [type]                                        Update snapshot (accepts boolean, "new", "all" or "none")
  -w, --watch                                                Enable watch mode
  -t, --testNamePattern <pattern>                            Run tests with full names matching the specified regexp pattern
  --dir <path>                                               Base directory to scan for the test files
  --ui                                                       Enable UI
  --open                                                     Open UI automatically (default: !process.env.CI)
  --api [port]                                               Specify server port. Note if the port is already being used, Vite will automatically try the next available port so this may not be the actual port the server ends up listening on. If true will be set to 51204. Use '--help --api' for more info.
  --silent [value]                                           Silent console output from tests. Use 'passed-only' to see logs from failing tests only.
  --hideSkippedTests                                         Hide logs for skipped tests
  --reporter <name>                                          Specify reporters (default, agent, minimal, blob, verbose, dot, json, tap, tap-flat, junit, tree, hanging-process, github-actions)
  --outputFile <filename/-s>                                 Write test results to a file when supporter reporter is also specified, use cac's dot notation for individual outputs of multiple reporters (example: --outputFile.tap=./tap.txt)
  --coverage                                                 Enable coverage report. Use '--help --coverage' for more info.
  --mode <name>                                              Override Vite mode (default: test or benchmark)
  --isolate                                                  Run every test file in isolation. To disable isolation, use --no-isolate (default: true)
  --globals                                                  Inject apis globally
  --dom                                                      Mock browser API with happy-dom
  --browser <name>                                           Run tests in the browser. Equivalent to --browser.enabled (default: false). Use '--help --browser' for more info.
  --pool <pool>                                              Specify pool, if not running in the browser (default: forks)
  --execArgv <option>                                        Pass additional arguments to node process when spawning worker_threads or child_process.
  --vmMemoryLimit <limit>                                    Memory limit for VM pools. If you see memory leaks, try to tinker this value.
  --fileParallelism                                          Should all test files run in parallel. Use --no-file-parallelism to disable (default: true)
  --maxWorkers <workers>                                     Maximum number or percentage of workers to run tests in
  --environment <name>                                       Specify runner environment, if not running in the browser (default: node)
  --passWithNoTests                                          Pass when no tests are found
  --logHeapUsage                                             Show the size of heap for each test when running in node
  --detectAsyncLeaks                                         Detect asynchronous resources leaking from the test file (default: false)
  --allowOnly                                                Allow tests and suites that are marked as only (default: !process.env.CI)
  --dangerouslyIgnoreUnhandledErrors                         Ignore any unhandled errors that occur
  --shard <shards>                                           Test suite shard to execute in a format of <index>/<count>
  --changed [since]                                          Run tests that are affected by the changed files (default: false)
  --sequence <options>                                       Options for how tests should be sorted. Use '--help --sequence' for more info.
  --inspect [[host:]port]                                    Enable Node.js inspector (default: 127.0.0.1:9229)
  --inspectBrk [[host:]port]                                 Enable Node.js inspector and break before the test starts
  --testTimeout <timeout>                                    Default timeout of a test in milliseconds (default: 5000). Use 0 to disable timeout completely.
  --hookTimeout <timeout>                                    Default hook timeout in milliseconds (default: 10000). Use 0 to disable timeout completely.
  --bail <number>                                            Stop test execution when given number of tests have failed (default: 0)
  --retry <times>                                            Retry the test specific number of times if it fails (default: 0). Use '--help --retry' for more info.
  --diff <path>                                              DiffOptions object or a path to a module which exports DiffOptions object. Use '--help --diff' for more info.
  --exclude <glob>                                           Additional file globs to be excluded from test
  --expandSnapshotDiff                                       Show full diff when snapshot fails
  --disableConsoleIntercept                                  Disable automatic interception of console logging (default: false)
  --typecheck                                                Enable typechecking alongside tests (default: false). Use '--help --typecheck' for more info.
  --project <name>                                           The name of the project to run if you are using Vitest workspace feature. This can be repeated for multiple projects: --project=1 --project=2. You can also filter projects using wildcards like --project=packages*, and exclude projects with --project=!pattern.
  --slowTestThreshold <threshold>                            Threshold in milliseconds for a test or suite to be considered slow (default: 300)
  --teardownTimeout <timeout>                                Default timeout of a teardown function in milliseconds (default: 10000)
  --cache                                                    Enable cache. Use '--help --cache' for more info.
  --maxConcurrency <number>                                  Maximum number of concurrent tests and suites during test file execution (default: 5)
  --expect                                                   Configuration options for expect() matches. Use '--help --expect' for more info.
  --printConsoleTrace                                        Always print console stack traces
  --includeTaskLocation                                      Collect test and suite locations in the location property
  --attachmentsDir <dir>                                     The directory where attachments from context.annotate are stored in (default: .vitest-attachments)
  --run                                                      Disable watch mode
  --no-color                                                 Removes colors from the console output (default: true)
  --clearScreen                                              Clear terminal screen when re-running tests during watch mode (default: true)
  --configLoader <loader>                                    Use bundle to bundle the config with esbuild or runner (experimental) to process it on the fly. This is only available in vite version 6.1.0 and above. (default: bundle)
  --standalone                                               Start Vitest without running tests. Tests will be running only on change. If browser mode is enabled, the UI will be opened automatically. This option is ignored when CLI file filters are passed. (default: false)
  --mergeReports [path]                                      Path to a blob reports directory. If this options is used, Vitest won't run any tests, it will only report previously recorded tests
  --listTags [type]                                          List all available tags instead of running tests. --list-tags=json will output tags in JSON format, unless there are no tags.
  --clearCache                                               Delete all Vitest caches, including experimental.fsModuleCache, without running any tests. This will reduce the performance in the subsequent test run.
  --tagsFilter <expression>                                  Run only tests with the specified tags. You can use logical operators && (and), || (or) and ! (not) to create complex expressions, see https://vitest.dev/guide/test-tags#syntax for more information.
  --strictTags                                               Should Vitest throw an error if test has a tag that is not defined in the config. (default: true)
  --experimental <features>                                  Experimental features.. Use '--help --experimental' for more info.
  -h, --help                                                 Display this message
```

## `vp preview -h`

preview 帮助信息

```
vp/<版本>

用法:
  $ vp preview [root]

选项:
  --host [host]            [字符串] 指定主机名
  --port <port>            [数字] 指定端口
  --strictPort             [布尔值] 如果指定的端口已被占用则退出
  --open [path]            [布尔值 | 字符串] 启动时打开浏览器
  --outDir <dir>           [字符串] 输出目录（默认值：dist）
  -c, --config <file>      [字符串] 使用指定的配置文件
  --base <path>            [字符串] 公共基础路径（默认值：/）
  -l, --logLevel <level>   [字符串] info | warn | error | silent
  --clearScreen            [布尔值] 允许/禁用日志记录时清屏
  --configLoader <loader>  [字符串] 使用 'bundle' 通过 Rolldown 打包配置，或使用 'runner'（实验性）即时处理配置，或使用 'native'（实验性）通过原生运行时加载（默认值：bundle）
  -d, --debug [feat]       [字符串 | 布尔值] 显示调试日志
  -f, --filter <filter>    [字符串] 筛选调试日志
  -m, --mode <mode>        [字符串] 设置环境模式
  -h, --help               显示此信息
```

## `vp dev -h`

dev 帮助信息

```
vp/<version>

用法：
  $ vp [root]

命令：
  [root]           启动开发服务器
  build [root]     构建生产版本
  optimize [root]  预构建依赖（已弃用，预构建过程会自动运行，无需调用）
  preview [root]   在本地预览生产构建

如需更多信息，请使用 `--help` 标志运行任意命令：
  $ vp --help
  $ vp build --help
  $ vp optimize --help
  $ vp preview --help

选项：
  --host [host]            [string] 指定主机名
  --port <port>            [number] 指定端口
  --open [path]            [boolean | string] 启动时打开浏览器
  --cors                   [boolean] 启用 CORS
  --strictPort             [boolean] 如果指定的端口已被占用则退出
  --force                  [boolean] 强制优化器忽略缓存并重新构建
  --experimentalBundle     [boolean] 使用实验性的完整构建模式（此功能高度实验性）
  -c, --config <file>      [string] 使用指定的配置文件
  --base <path>            [string] 公共基础路径（默认：/）
  -l, --logLevel <level>   [string] info | warn | error | silent
  --clearScreen            [boolean] 允许/禁用日志记录时清屏
  --configLoader <loader>  [string] 使用 'bundle' 通过 Rolldown 打包配置，或使用 'runner'（实验性）即时处理，或使用 'native'（实验性）通过原生运行时加载（默认：bundle）
  -d, --debug [feat]       [string | boolean] 显示调试日志
  -f, --filter <filter>    [string] 过滤调试日志
  -m, --mode <mode>        [string] 设置环境模式
  -h, --help               显示此信息
  -v, --version            显示版本号
```
