# 全局 CLI 回退

## `vp build -h`

应回退到全局 vite-plus 并显示构建帮助信息

```
VITE+ - Web 的统一工具链

用法：vp build [ROOT] [OPTIONS]

为生产环境构建。
选项将转发给 Vite。

参数：
  [ROOT]  项目根目录（默认：当前目录）

选项：
  --target <TARGET>             转译目标
  --outDir <DIR>                输出目录
  --assetsDir <DIR>             生成资源的目录
  --assetsInlineLimit <NUMBER>  静态资源内联阈值
  --ssr [ENTRY]                 为服务端渲染进行构建
  --sourcemap [MODE]            输出源映射
  --minify [MINIFIER]           启用或禁用压缩
  --manifest [NAME]             生成构建清单
  --ssrManifest [NAME]          生成 SSR 清单
  --emptyOutDir                 即使 outDir 位于根目录之外，也清空该目录
  -w, --watch                   文件发生更改时重新构建
  --app                         使用构建器 API 构建应用程序
  --base <PATH>                 公共基础路径
  -l, --logLevel <LEVEL>        设置日志级别
  --clearScreen                 允许或禁用清屏
  -d, --debug [FEAT]            显示调试日志
  -f, --filter <FILTER>         过滤调试日志
  -m, --mode <MODE>             设置环境模式
  -h, --help                    打印帮助信息

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
选项会传递给 Vite。

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
  --clearScreen           允许或禁止清屏
  -d, --debug [FEAT]      显示调试日志
  -f, --filter <FILTER>   筛选调试日志
  -m, --mode <MODE>       设置环境模式
  -h, --help              显示帮助信息

示例：
  vp dev
  vp dev --open
  vp dev --host localhost --port 5173

文档：https://viteplus.dev/guide/dev
```

## `vp test -h`

应回退到全局 vite-plus 并显示测试帮助信息

```
VITE+ - Web 统一工具链

用法：vp test [COMMAND] [FILTERS]... [OPTIONS]

默认运行一次测试。
选项将传递给 Vitest。

命令：
  run      运行一次测试
  watch    以监听模式运行测试
  dev      以开发模式运行测试
  related  运行与已更改文件相关的测试
  bench    运行基准测试
  list     列出匹配的测试

参数：
  [FILTERS]...  测试文件筛选器

选项：
  -r, --root <PATH>                   根路径
  -u, --update [TYPE]                 更新快照（接受布尔值、"new"、"all" 或 "none"）
  -w, --watch                         启用监听模式
  -t, --testNamePattern <PATTERN>     运行完整名称匹配指定正则表达式模式的测试
  --dir <PATH>                        扫描测试文件的基础目录
  --ui                                启用 UI
  --open                              自动打开 UI（默认：!process.env.CI）
  --api [PORT]                        指定服务器端口；如果为 true，则默认为 51204
  --silent [VALUE]                    静默测试中的控制台输出。使用 'passed-only' 仅查看失败测试的日志
  --hideSkippedTests                  隐藏跳过测试的日志
  --reporter <NAME>                   指定报告器（default、agent、minimal、blob、verbose、dot、json、tap、tap-flat、junit、tree、hanging-process、github-actions）
  --outputFile <FILENAME/-S>          将测试结果写入文件；对于多个报告器的单独输出，请使用点号表示法（例如：--outputFile.tap=./tap.txt）
  --coverage                          启用覆盖率报告
  --mode <NAME>                       覆盖 Vite 模式（默认：test 或 benchmark）
  --isolate                           单独运行每个测试文件。使用 --no-isolate 禁用（默认：true）
  --globals                           全局注入 API
  --dom                               使用 happy-dom 模拟浏览器 API
  --browser <NAME>                    在浏览器中运行测试；等同于 --browser.enabled（默认：false）
  --pool <POOL>                       指定不在浏览器中运行时使用的池（默认：forks）
  --execArgv <OPTION>                 在生成工作线程或子进程时向 Node.js 传递其他参数
  --vmMemoryLimit <LIMIT>             VM 池的内存限制
  --fileParallelism                   并行运行测试文件。使用 --no-file-parallelism 禁用（默认：true）
  --maxWorkers <WORKERS>              运行测试的最大工作线程数或百分比
  --environment <NAME>                指定运行环境（默认：node）
  --passWithNoTests                   未找到测试时仍通过
  --logHeapUsage                      在 Node.js 中运行时显示每个测试的堆大小
  --detectAsyncLeaks                  检测测试文件中的异步资源泄漏（默认：false）
  --allowOnly                         允许运行标记为 only 的测试和测试套件（默认：!process.env.CI）
  --dangerouslyIgnoreUnhandledErrors  忽略所有未处理的错误
  --shard <SHARDS>                    要执行的测试套件分片，格式为 <index>/<count>
  --changed [SINCE]                   运行受已更改文件影响的测试（默认：false）
  --sequence <OPTIONS>                配置测试排序
  --inspect [[HOST:]PORT]             启用 Node.js 检查器（默认：127.0.0.1:9229）
  --inspectBrk [[HOST:]PORT]          启用 Node.js 检查器，并在测试开始前暂停
  --testTimeout <TIMEOUT>             默认测试超时时间（以毫秒为单位）（默认：5000；0 表示禁用）
  --hookTimeout <TIMEOUT>             默认钩子超时时间（以毫秒为单位）（默认：10000；0 表示禁用）
  --bail <NUMBER>                     在失败次数达到指定数量后停止执行测试（默认：0）
  --retry <TIMES>                     重试失败的测试（默认：0）
  --diff <PATH>                       DiffOptions 对象或导出该对象的模块路径
  --exclude <GLOB>                    要从测试中排除的其他文件 glob
  --expandSnapshotDiff                快照失败时显示完整差异
  --disableConsoleIntercept           禁用对控制台日志的自动拦截（默认：false）
  --typecheck                         启用与测试并行的类型检查（默认：false）
  --project <NAME>                    按名称或通配符选择一个或多个 Vitest 工作区项目
  --slowTestThreshold <THRESHOLD>     将测试或测试套件视为慢速的阈值（默认：<duration>）
  --teardownTimeout <TIMEOUT>         默认清理超时时间（以毫秒为单位）（默认：10000）
  --cache                             启用缓存
  --maxConcurrency <NUMBER>           并发测试和测试套件的最大数量（默认：5）
  --expect                            配置 expect 匹配器
  --printConsoleTrace                 始终打印控制台堆栈跟踪
  --includeTaskLocation               收集测试和测试套件位置，并写入 location 属性
  --attachmentsDir <DIR>              使用 context.annotate 创建的附件目录（默认：.vitest-attachments）
  --run                               禁用监听模式
  --no-color                          移除控制台输出中的颜色（默认：true）
  --clearScreen                       监听模式下重新运行测试时清空终端（默认：true）
  --standalone                        启动 Vitest，在文件发生更改前不运行测试（默认：false）
  --mergeReports [PATH]               合并之前记录的 blob 报告，而不运行测试
  --listTags [TYPE]                   列出可用标签；--list-tags=json 输出 JSON
  --clearCache                        删除所有 Vitest 缓存而不运行测试
  --tagsFilter <EXPRESSION>           仅运行与标签表达式匹配的测试
  --strictTags                        测试使用未定义标签时出错（默认：true）
  --experimental <FEATURES>           启用实验性功能
  -h, --help                          显示此帮助信息

基准测试选项：
  --compare <FILENAME>     要进行比较的基准测试输出文件
  --outputJson <FILENAME>  基准测试输出文件

列表选项：
  --json [TRUE/PATH]                将收集的测试打印为 JSON 或写入文件（默认：false）
  --filesOnly                       仅打印测试文件，不显示测试用例
  --staticParse                     静态解析文件，而不是运行文件（默认：false）
  --staticParseConcurrency <LIMIT>  并发处理的测试文件数量

示例：
  vp test
  vp test src/foo.test.ts
  vp test watch --coverage

文档：https://viteplus.dev/guide/test
```
