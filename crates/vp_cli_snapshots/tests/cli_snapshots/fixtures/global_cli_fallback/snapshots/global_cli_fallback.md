# global_cli_fallback

## `vp build -h`

应回退到全局 vite-plus 并显示构建帮助

```
VITE+ - Web 的统一工具链

用法：vp build [ROOT] [OPTIONS]

构建生产版本。
选项将转发给 Vite。

参数：
  [ROOT]  项目根目录（默认：当前目录）

选项：
  --target <target>             [string] 转译目标（默认：'baseline-widely-available'）
  --outDir <dir>                [string] 输出目录（默认：dist）
  --assetsDir <dir>             [string] 用于放置资源的 outDir 下的目录（默认：assets）
  --assetsInlineLimit <number>  [number] 静态资源以内联 Base64 的字节阈值（默认：4096）
  --ssr [entry]                 [string] 为服务端渲染构建指定入口
  --sourcemap [output]          [boolean | "inline" | "hidden"] 为构建输出源映射（默认：false）
  --minify [minifier]           [boolean | "oxc" | "terser" | "esbuild"] 启用/禁用压缩，或指定要使用的压缩器（默认：oxc）
  --manifest [name]             [boolean | string] 输出构建清单 JSON
  --ssrManifest [name]          [boolean | string] 输出 SSR 清单 JSON
  --emptyOutDir                 [boolean] 当 outDir 位于根目录之外时强制清空
  -w, --watch                   [boolean] 磁盘上的模块发生变化时重新构建
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

## `vp dev -h`

应回退到全局 vite-plus 并显示 dev 帮助信息

```
VITE+ - Web 的统一工具链

用法：vp dev [ROOT] [OPTIONS]

运行开发服务器。
选项将转发给 Vite。

参数：
  [ROOT]  项目根目录（默认：当前目录）

选项：
  --host [host]           [字符串] 指定主机名
  --port <port>           [数字] 指定端口
  --open [path]           [布尔值 | 字符串] 启动时打开浏览器
  --cors                  [布尔值] 启用 CORS
  --strictPort            [布尔值] 如果指定端口已被占用则退出
  --force                 [布尔值] 强制优化器忽略缓存并重新打包
  --experimentalBundle    [布尔值] 使用实验性的完整打包模式（此功能具有高度实验性）
  --base <path>           [字符串] 公共基础路径（默认：/）
  -l, --logLevel <level>  [字符串] info | warn | error | silent
  --clearScreen           [布尔值] 允许/禁用日志记录时清屏
  -d, --debug [feat]      [字符串 | 布尔值] 显示调试日志
  -f, --filter <filter>   [字符串] 过滤调试日志
  -m, --mode <mode>       [字符串] 设置环境模式
  -h, --help              显示此消息

示例：
  vp dev
  vp dev --open
  vp dev --host localhost --port 5173

文档：https://viteplus.dev/guide/dev
```

## `vp test -h`

应回退到全局 vite-plus 并显示测试帮助信息

```
VITE+ - Web 的统一工具链

用法：vp test [COMMAND] [FILTERS]... [OPTIONS]

默认运行一次测试。
选项会传递给 Vitest。

命令：
  run      运行一次测试
  watch    以监听模式运行测试
  dev      以开发模式运行测试
  related  运行与已更改文件相关的测试
  bench    运行基准测试
  list     列出匹配的测试

参数：
  [FILTERS]...  测试文件过滤器

选项：
  -r, --root <path>                   根路径
  -u, --update [type]                 更新快照（接受布尔值、"new"、"all" 或 "none"）
  -w, --watch                         启用监听模式
  -t, --testNamePattern <pattern>     运行完整名称匹配指定正则表达式模式的测试
  --dir <path>                        扫描测试文件的基础目录
  --ui                                启用 UI
  --open                              自动打开 UI（默认：!process.env.CI）
  --api [port]                        指定服务器端口。注意，如果端口已被使用，Vite 会自动尝试下一个可用端口，因此该端口可能不是服务器最终监听的实际端口。如果为 true，则会设置为 51204。使用 '--help --api' 获取更多信息。
  --silent [value]                    静默测试的控制台输出。使用 'passed-only' 仅查看失败测试的日志。
  --hideSkippedTests                  隐藏跳过测试的日志
  --reporter <name>                   指定报告器（default、agent、minimal、blob、verbose、dot、json、tap、tap-flat、junit、tree、hanging-process、github-actions）
  --outputFile <filename/-s>          将测试结果写入文件（同时指定 supporter reporter 时），使用 cac 的点号表示法指定多个报告器的单独输出（例如：--outputFile.tap=./tap.txt）
  --coverage                          启用覆盖率报告。使用 '--help --coverage' 获取更多信息。
  --mode <name>                       覆盖 Vite 模式（默认：test 或 benchmark）
  --isolate                           在隔离环境中运行每个测试文件。要禁用隔离，请使用 --no-isolate（默认：true）
  --globals                           全局注入 API
  --dom                               使用 happy-dom 模拟浏览器 API
  --browser <name>                    在浏览器中运行测试。等同于 --browser.enabled（默认：false）。使用 '--help --browser' 获取更多信息。
  --pool <pool>                       指定池（不在浏览器中运行时）（默认：forks）
  --execArgv <option>                 生成 worker_threads 或 child_process 时向 node 进程传递其他参数。
  --vmMemoryLimit <limit>             VM 池的内存限制。如果发现内存泄漏，请尝试调整此值。
  --fileParallelism                   是否并行运行所有测试文件。使用 --no-file-parallelism 禁用（默认：true）
  --maxWorkers <workers>              运行测试的最大工作线程数或百分比
  --environment <name>                指定运行环境（不在浏览器中运行时）（默认：node）
  --passWithNoTests                   未找到测试时仍通过
  --logHeapUsage                      在 node 中运行时显示每个测试的堆大小
  --detectAsyncLeaks                  检测测试文件中的异步资源泄漏（默认：false）
  --allowOnly                         允许运行标记为 only 的测试和测试套件（默认：!process.env.CI）
  --dangerouslyIgnoreUnhandledErrors  忽略所有未处理的错误
  --shard <shards>                    要执行的测试套件分片，格式为 <index>/<count>
  --changed [since]                   运行受已更改文件影响的测试（默认：false）
  --sequence <options>                测试排序方式的选项。使用 '--help --sequence' 获取更多信息。
  --inspect [[host:]port]             启用 Node.js 检查器（默认：127.0.0.1:9229）
  --inspectBrk [[host:]port]          启用 Node.js 检查器，并在测试开始前暂停
  --testTimeout <timeout>             测试的默认超时时间（以毫秒为单位）（默认：5000）。使用 0 可完全禁用超时。
  --hookTimeout <timeout>             钩子的默认超时时间（以毫秒为单位）（默认：10000）。使用 0 可完全禁用超时。
  --bail <number>                     当失败的测试达到指定数量时停止测试执行（默认：0）
  --retry <times>                     测试失败时重试指定次数（默认：0）。使用 '--help --retry' 获取更多信息。
  --diff <path>                       DiffOptions 对象，或导出 DiffOptions 对象的模块路径。使用 '--help --diff' 获取更多信息。
  --exclude <glob>                    要从测试中排除的其他文件 glob
  --expandSnapshotDiff                快照失败时显示完整差异
  --disableConsoleIntercept           禁用对控制台日志的自动拦截（默认：false）
  --typecheck                         启用与测试同时进行的类型检查（默认：false）。使用 '--help --typecheck' 获取更多信息。
  --project <name>                    如果使用 Vitest workspace 功能，要运行的项目名称。可重复指定多个项目：--project=1 --project=2。也可以使用通配符过滤项目，例如 --project=packages*，并使用 --project=!pattern 排除项目。
  --slowTestThreshold <threshold>     将测试或测试套件视为运行缓慢的阈值（以毫秒为单位）（默认：300）
  --teardownTimeout <timeout>         teardown 函数的默认超时时间（以毫秒为单位）（默认：10000）
  --cache                             启用缓存。使用 '--help --cache' 获取更多信息。
  --maxConcurrency <number>           测试文件执行期间并发测试和测试套件的最大数量（默认：5）
  --expect                            expect() 匹配的配置选项。使用 '--help --expect' 获取更多信息。
  --printConsoleTrace                 始终打印控制台堆栈跟踪
  --includeTaskLocation               收集测试和测试套件的位置，并存储在 location 属性中
  --attachmentsDir <dir>              存储 context.annotate 生成的附件的目录（默认：.vitest-attachments）
  --run                               禁用监听模式
  --no-color                          移除控制台输出中的颜色（默认：true）
  --clearScreen                       在监听模式下重新运行测试时清除终端屏幕（默认：true）
  --standalone                        启动 Vitest 而不运行测试。只有发生更改时才会运行测试。如果启用了浏览器模式，UI 将自动打开。传入 CLI 文件过滤器时，此选项会被忽略。（默认：false）
  --mergeReports [path]               blob 报告目录的路径。如果使用此选项，Vitest 不会运行任何测试，只会报告之前记录的测试
  --listTags [type]                   列出所有可用标签，而不是运行测试。--list-tags=json 将以 JSON 格式输出标签，除非没有标签。
  --clearCache                        删除所有 Vitest 缓存，包括 experimental.fsModuleCache，但不运行任何测试。这会降低后续测试运行的性能。
  --tagsFilter <expression>           仅运行带有指定标签的测试。可以使用逻辑运算符 &&（与）、||（或）和 !（非）创建复杂表达式，详情请参阅 https://vitest.dev/guide/test-tags#syntax。
  --strictTags                        如果测试包含配置中未定义的标签，Vitest 是否应抛出错误。（默认：true）
  --experimental <features>           实验性功能。使用 '--help --experimental' 获取更多信息。
  -h, --help                          显示此消息

基准测试选项：
  --compare <filename>     要进行比较的基准测试输出文件
  --outputJson <filename>  基准测试输出文件

列表选项：
  --json [true/path]                将收集的测试打印为 JSON 或写入文件（默认：false）
  --filesOnly                       仅打印测试文件，不包含测试用例
  --staticParse                     静态解析文件，而不是运行文件来收集测试（默认：false）
  --staticParseConcurrency <limit>  同时处理的测试数量（默认：os.availableParallelism()）

示例：
  vp test
  vp test src/foo.test.ts
  vp test watch --coverage

文档：https://viteplus.dev/guide/test
```
