# 命令工具帮助

基于工具的命令帮助由本地 vite-plus CLI 渲染。

## `vp dev --help`

```
VITE+ - Web 统一工具链

用法: vp dev [ROOT] [OPTIONS]

运行开发服务器。
选项将传递给 Vite。

参数:
  [ROOT]  项目根目录（默认：当前目录）

选项:
  --host [host]           [string] 指定主机名
  --port <port>           [number] 指定端口
  --open [path]           [boolean | string] 启动时打开浏览器
  --cors                  [boolean] 启用 CORS
  --strictPort            [boolean] 如果指定端口已被占用则退出
  --force                 [boolean] 强制优化器忽略缓存并重新打包
  --experimentalBundle    [boolean] 使用实验性的完整打包模式（此功能高度实验性）
  --base <path>           [string] 公共基础路径（默认：/）
  -l, --logLevel <level>  [string] info | warn | error | silent
  --clearScreen           [boolean] 允许/禁用日志记录时清屏
  -d, --debug [feat]      [string | boolean] 显示调试日志
  -f, --filter <filter>   [string] 筛选调试日志
  -m, --mode <mode>       [string] 设置环境模式
  -h, --help              显示此消息

示例:
  vp dev
  vp dev --open
  vp dev --host localhost --port 5173

文档：https://viteplus.dev/guide/dev
```

## `vp build --help`

```
VITE+ - Web 的统一工具链

用法：vp build [ROOT] [OPTIONS]

构建生产版本。
选项将传递给 Vite。

参数：
  [ROOT]  项目根目录（默认：当前目录）

选项：
  --target <target>             [string] 转译目标（默认：'baseline-widely-available'）
  --outDir <dir>                [string] 输出目录（默认：dist）
  --assetsDir <dir>             [string] 在 outDir 下放置资源的目录（默认：assets）
  --assetsInlineLimit <number>  [number] 静态资源 Base64 内联阈值（单位：字节，默认：4096）
  --ssr [entry]                 [string] 构建指定的服务端渲染入口
  --sourcemap [output]          [boolean | "inline" | "hidden"] 为构建输出源映射（默认：false）
  --minify [minifier]           [boolean | "oxc" | "terser" | "esbuild"] 启用/禁用压缩，或指定要使用的压缩器（默认：oxc）
  --manifest [name]             [boolean | string] 输出构建清单 JSON
  --ssrManifest [name]          [boolean | string] 输出 SSR 清单 JSON
  --emptyOutDir                 [boolean] 当 outDir 位于根目录之外时强制清空
  -w, --watch                   [boolean] 磁盘上的模块发生更改时重新构建
  --app                         [boolean] 等同于 `builder: {}`
  --base <path>                 [string] 公共基础路径（默认：/）
  -l, --logLevel <level>        [string] info | warn | error | silent
  --clearScreen                 [boolean] 允许/禁止记录日志时清屏
  -d, --debug [feat]            [string | boolean] 显示调试日志
  -f, --filter <filter>         [string] 筛选调试日志
  -m, --mode <mode>             [string] 设置环境模式
  -h, --help                    显示此消息

示例：
  vp build
  vp build --watch
  vp build --sourcemap

文档：https://viteplus.dev/guide/build
```

## `vp preview --help`

```
VITE+ - Web 统一工具链

用法：vp preview [ROOT] [OPTIONS]

预览生产构建。
选项将传递给 Vite。

参数：
  [ROOT]  项目根目录（默认：当前目录）

选项：
  --host [host]           [string] 指定主机名
  --port <port>           [number] 指定端口
  --strictPort            [boolean] 如果指定的端口已被占用则退出
  --open [path]           [boolean | string] 启动时打开浏览器
  --outDir <dir>          [string] 输出目录（默认：dist）
  --base <path>           [string] 公共基础路径（默认：/）
  -l, --logLevel <level>  [string] info | warn | error | silent
  --clearScreen           [boolean] 允许/禁用日志记录时清屏
  -d, --debug [feat]      [string | boolean] 显示调试日志
  -f, --filter <filter>   [string] 筛选调试日志
  -m, --mode <mode>       [string] 设置环境模式
  -h, --help              显示此消息

示例：
  vp preview
  vp preview --port 4173

文档：https://viteplus.dev/guide/build
```

## `vp test --help`

```
VITE+ - Web 的统一工具链

用法：vp test [COMMAND] [FILTERS]... [OPTIONS]

默认运行一次测试。
选项会传递给 Vitest。

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
  -r, --root <path>                   根路径
  -u, --update [type]                 更新快照（接受 boolean、"new"、"all" 或 "none"）
  -w, --watch                         启用监视模式
  -t, --testNamePattern <pattern>     运行完整名称匹配指定正则表达式模式的测试
  --dir <path>                        扫描测试文件的基础目录
  --ui                                启用 UI
  --open                              自动打开 UI（默认：!process.env.CI）
  --api [port]                        指定服务器端口。注意，如果该端口已被占用，Vite 将自动尝试下一个可用端口，因此服务器最终监听的端口可能并非此端口。如果为 true，将设置为 51204。使用 '--help --api' 获取更多信息。
  --silent [value]                    静默测试的控制台输出。使用 'passed-only' 仅查看失败测试的日志。
  --hideSkippedTests                  隐藏跳过测试的日志
  --reporter <name>                   指定报告器（default、agent、minimal、blob、verbose、dot、json、tap、tap-flat、junit、tree、hanging-process、github-actions）
  --outputFile <filename/-s>          将测试结果写入文件；同时指定 supporter reporter 时，使用 cac 的点号表示法指定多个报告器的单独输出（示例：--outputFile.tap=./tap.txt）
  --coverage                          启用覆盖率报告。使用 '--help --coverage' 获取更多信息。
  --mode <name>                       覆盖 Vite 模式（默认：test 或 benchmark）
  --isolate                           在隔离环境中运行每个测试文件。要禁用隔离，请使用 --no-isolate（默认：true）
  --globals                           全局注入 API
  --dom                               使用 happy-dom 模拟浏览器 API
  --browser <name>                    在浏览器中运行测试。等同于 --browser.enabled（默认：false）。使用 '--help --browser' 获取更多信息。
  --pool <pool>                       指定池；不在浏览器中运行时有效（默认：forks）
  --execArgv <option>                 在生成 worker_threads 或 child_process 时向 node 进程传递其他参数。
  --vmMemoryLimit <limit>             VM 池的内存限制。如果发现内存泄漏，可以尝试调整此值。
  --fileParallelism                   是否并行运行所有测试文件。使用 --no-file-parallelism 禁用（默认：true）
  --maxWorkers <workers>              运行测试的最大 worker 数量或百分比
  --environment <name>                指定运行环境；不在浏览器中运行时有效（默认：node）
  --passWithNoTests                   找不到测试时也视为通过
  --logHeapUsage                      在 node 中运行时显示每个测试的堆大小
  --detectAsyncLeaks                  检测从测试文件中泄漏的异步资源（默认：false）
  --allowOnly                         允许运行标记为 only 的测试和测试套件（默认：!process.env.CI）
  --dangerouslyIgnoreUnhandledErrors  忽略发生的所有未处理错误
  --shard <shards>                    以 <index>/<count> 格式执行测试套件分片
  --changed [since]                   运行受已更改文件影响的测试（默认：false）
  --sequence <options>                测试排序方式的选项。使用 '--help --sequence' 获取更多信息。
  --inspect [[host:]port]             启用 Node.js 检查器（默认：127.0.0.1:9229）
  --inspectBrk [[host:]port]          启用 Node.js 检查器，并在测试开始前暂停
  --testTimeout <timeout>             测试的默认超时时间（以毫秒为单位）（默认：5000）。使用 0 可完全禁用超时。
  --hookTimeout <timeout>             hook 的默认超时时间（以毫秒为单位）（默认：10000）。使用 0 可完全禁用超时。
  --bail <number>                     给定数量的测试失败后停止测试执行（默认：0）
  --retry <times>                     测试失败时重试指定次数（默认：0）。使用 '--help --retry' 获取更多信息。
  --diff <path>                       DiffOptions 对象，或导出 DiffOptions 对象的模块路径。使用 '--help --diff' 获取更多信息。
  --exclude <glob>                    要从测试中排除的其他文件 glob
  --expandSnapshotDiff                快照失败时显示完整差异
  --disableConsoleIntercept           禁用对控制台日志的自动拦截（默认：false）
  --typecheck                         启用与测试同时进行的类型检查（默认：false）。使用 '--help --typecheck' 获取更多信息。
  --project <name>                    如果使用 Vitest workspace 功能，则指定要运行的项目名称。可以重复指定多个项目：--project=1 --project=2。也可以使用通配符筛选项目，例如 --project=packages*，并使用 --project=!pattern 排除项目。
  --slowTestThreshold <threshold>     将测试或测试套件视为运行缓慢的阈值（以毫秒为单位）（默认：300）
  --teardownTimeout <timeout>         teardown 函数的默认超时时间（以毫秒为单位）（默认：10000）
  --cache                             启用缓存。使用 '--help --cache' 获取更多信息。
  --maxConcurrency <number>           测试文件执行期间测试和测试套件的最大并发数（默认：5）
  --expect                            expect() 匹配的配置选项。使用 '--help --expect' 获取更多信息。
  --printConsoleTrace                 始终打印控制台堆栈跟踪
  --includeTaskLocation               收集测试和测试套件的位置，并存储在 location 属性中
  --attachmentsDir <dir>              存储 context.annotate 附件的目录（默认：.vitest-attachments）
  --run                               禁用监视模式
  --no-color                          从控制台输出中移除颜色（默认：true）
  --clearScreen                       在监视模式下重新运行测试时清除终端屏幕（默认：true）
  --standalone                        启动 Vitest，但不运行测试。只有发生更改时才会运行测试。如果启用了浏览器模式，UI 将自动打开。传入 CLI 文件筛选器时，此选项会被忽略。（默认：false）
  --mergeReports [path]               blob 报告目录的路径。如果使用此选项，Vitest 不会运行任何测试，只会报告之前记录的测试
  --listTags [type]                   列出所有可用标签，而不是运行测试。--list-tags=json 将以 JSON 格式输出标签；如果没有标签则除外。
  --clearCache                        删除所有 Vitest 缓存，包括 experimental.fsModuleCache，但不运行任何测试。这会降低后续测试运行的性能。
  --tagsFilter <expression>           仅运行带有指定标签的测试。可以使用逻辑运算符 &&（与）、||（或）和 !（非）创建复杂表达式，更多信息请参阅 https://vitest.dev/guide/test-tags#syntax。
  --strictTags                        如果测试包含配置中未定义的标签，是否应让 Vitest 抛出错误。（默认：true）
  --experimental <features>           实验性功能。使用 '--help --experimental' 获取更多信息。
  -h, --help                          显示此消息

基准测试选项：
  --compare <filename>     要比较的基准测试输出文件
  --outputJson <filename>  基准测试输出文件

列表选项：
  --json [true/path]                将收集到的测试打印为 JSON，或写入文件（默认：false）
  --filesOnly                       仅打印测试文件，不包括测试用例
  --staticParse                     静态解析文件，而不是运行文件来收集测试（默认：false）
  --staticParseConcurrency <limit>  同时处理的测试数量（默认：os.availableParallelism()）

示例：
  vp test
  vp test src/foo.test.ts
  vp test watch --coverage

文档：https://viteplus.dev/guide/test
```

## `vp pack --help`

```
VITE+ - Web 统一工具链

用法：vp pack [...files] [OPTIONS]

构建库。
选项将转发给 Vite+ Pack。

参数：
  [...files]  打包文件

选项：
  --no-config                   禁用配置文件
  -f, --format <format>         打包格式：esm、cjs、iife、umd（默认：esm）
  --clean                       清理输出目录，使用 --no-clean 禁用
  --deps.never-bundle <module>  将依赖项标记为外部依赖
  --minify                      压缩输出
  --devtools                    启用 devtools 集成
  --debug [feat]                显示调试日志
  --target <target>             打包目标，例如 "es2015"、"esnext"
  -l, --logLevel <level>        设置日志级别：info、warn、error、silent
  --fail-on-warn                遇到警告时失败（默认：true）
  --no-write                    禁止将文件写入磁盘，与监视模式不兼容（默认：true）
  -d, --out-dir <dir>           输出目录（默认：dist）
  --treeshake                   对打包结果执行 Tree-shaking（默认：true）
  --sourcemap                   生成源映射（默认：false）
  --shims                       启用 cjs 和 esm 垫片（默认：false）
  --platform <platform>         目标平台（默认：node）
  --dts                         生成 dts 文件
  --publint                     启用 publint（默认：false）
  --attw                        启用 Are the types wrong 集成（默认：false）
  --unused                      启用未使用依赖项检查（默认：false）
  -w, --watch [path]            监视模式
  --ignore-watch <path>         忽略自定义监视路径
  --from-vite [vitest]          复用 Vite 或 Vitest 配置
  --report                      大小报告（默认：true）
  --env.* <value>               定义编译时环境变量
  --env-file <file>             从文件加载环境变量，与 --env 一起使用时，--env 中的变量优先级更高
  --env-prefix <prefix>         注入打包结果的环境变量前缀（默认：TSDOWN_）
  --on-success <command>        成功时运行的命令
  --copy <dir>                  将文件复制到输出目录
  --public-dir <dir>            --copy 的别名，已弃用
  --tsconfig <tsconfig>         设置 tsconfig 路径
  --unbundle                    非打包模式
  --root <dir>                  输入文件的根目录
  --exe                         打包为可执行文件
  -W, --workspace [dir]         启用工作区模式
  --concurrency <count>         可并行运行的 Rolldown 构建最大数量
  -F, --filter <pattern>        筛选配置（cwd 或名称），例如 /pkg-name$/ 或 pkg-name
  --exports                     为 package.json 生成与导出相关的元数据（实验性）
  -h, --help                    显示此消息

示例：
  vp pack
  vp pack src/index.ts --dts
  vp pack --watch

文档：https://viteplus.dev/guide/pack
```

## `vp cache --help`

```
VITE+ - Web 统一工具链

用法：vp cache <COMMAND>

管理任务缓存。

命令：
  clean  清理所有缓存

选项：
  -h, --help  显示帮助

文档：https://viteplus.dev/guide/cache
```
