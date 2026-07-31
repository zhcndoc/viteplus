# bin_oxlint_wrapper

## `node ../node_modules/vite-plus/bin/oxlint`

应拒绝非 LSP 用法

**退出代码：** 1

```
此 oxlint 包装器仅供 IDE 扩展使用（--lsp 模式）。
要检查你的代码，请运行：vp lint
```

## `node ../node_modules/vite-plus/bin/oxlint --help`

应拒绝非 LSP 用法

**退出代码：** 1

```
此 oxlint 包装器仅供 IDE 扩展使用（--lsp 模式）。
要检查代码，请运行：vp lint
```

## `node ../node_modules/vite-plus/bin/oxlint --lsp --help`

应测试导入路径

```
用法：[-c=<./.oxlintrc.json>] [PATH]...

基本配置
    -c, --config=<./.oxlintrc.json>  Oxlint 配置文件
                              * `.json` 和 `.jsonc` 配置文件在所有运行时中均受支持
                              * JavaScript/TypeScript 配置文件为实验性功能，需要通过 Node.js
                              运行
                              * 配置文件中可以使用注释。
                              * 尝试与 ESLint v8 的格式兼容
        --tsconfig=<./tsconfig.json>  覆盖用于导入解析的 TypeScript 配置。
                              Oxlint 会自动为每个文件发现相关的 `tsconfig.json`。仅当项目使用
                              非标准的 tsconfig 名称或位置时才使用此选项。
        --init                使用默认值初始化 oxlint 配置

允许/禁止多个 lint 规则
   在命令行中从左到右累积规则和类别。
   例如 `-D correctness -A no-debugger` 或 `-A all -D no-debugger`。
   类别如下：
   * `correctness` - 明显错误或无用的代码（默认）
   * `suspicious`  - 很可能错误或无用的代码
   * `pedantic`    - 相当严格或偶尔会产生误报的 lint
   * `perf`        - 可以用更高性能的方式编写的代码
   * `style`       - 应以更符合惯用方式编写的代码
   * `restriction` - 禁止使用语言和库功能的 lint
   * `nursery`     - 仍在开发中的新 lint
   * `all`         - 上述除 `nursery` 外的所有类别。不会自动启用插件。
    -A, --allow=NAME          允许规则或类别（抑制 lint）
    -W, --warn=NAME           禁止规则或类别（发出警告）
    -D, --deny=NAME           禁止规则或类别（发出错误）

启用/禁用插件
        --disable-unicorn-plugin  禁用默认开启的 unicorn 插件
        --disable-oxc-plugin  禁用默认开启的 oxc 特有规则
        --disable-typescript-plugin  禁用默认开启的 TypeScript 插件
        --import-plugin       启用 import 插件并检测 ESM 问题。
        --react-plugin        启用默认关闭的 react 插件
        --jsdoc-plugin        启用 jsdoc 插件并检测 JSDoc 问题
        --jest-plugin         启用 Jest 插件并检测测试问题
        --vitest-plugin       启用 Vitest 插件并检测测试问题
        --jsx-a11y-plugin     启用 JSX-a11y 插件并检测可访问性问题
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
        --ignore-pattern=PAT  指定要忽略的文件模式（除 `.eslintignore` 中的模式外）
        --no-ignore           禁止从 `.eslintignore` 文件、--ignore-path
                              标志和 --ignore-pattern 标志中排除文件

处理警告
        --quiet               禁止报告警告，仅报告错误
        --deny-warnings       确保警告产生非零退出代码
        --max-warnings=INT    指定警告阈值；如果项目中存在过多警告级别的规则违规，
                              可使用此选项强制以错误状态退出

输出
    -f, --format=ARG          使用特定的输出格式。可用值：`checkstyle`、
                              `default`、`agent`、`github`、`gitlab`、`json`、`junit`、`sarif`、
                              `stylish`、`unix`
        --debug=OPTIONS       启用调试输出选项。选项以逗号分隔。可用值：
                               * `files` - 打印将要进行 lint 的文件列表，然后退出。
                               * `timings` - 启用逐规则计时信息。

其他
        --silent              不显示任何诊断信息
        --no-error-on-unmatched-pattern  未选择任何文件进行 lint 时不要以错误退出
                              （例如应用忽略模式后）
        --threads=INT         要使用的线程数。设置为 1 可仅使用 1 个 CPU 核心。
        --print-config        此选项输出将使用的配置。指定此选项时，不执行 lint，
                              且仅配置相关选项有效。

内联配置注释
        --report-unused-disable-directives  报告类似 `// oxlint-disable-line` 的指令注释，
                              即使该行本来不会报告任何错误
        --report-unused-disable-directives-severity=SEVERITY  与
                              `--report-unused-disable-directives` 相同，但允许指定所报告
                              错误的严重级别。这两个选项不能同时使用。

可用的位置参数：
    PATH                      单个文件、单个路径或路径列表

可用选项：
        --rules               列出当前已注册的所有规则
        --lsp                 启动语言服务器
        --disable-nested-config  禁用自动加载嵌套配置文件
        --type-aware          启用需要类型信息的规则
        --type-check          启用实验性的类型检查（包括 TypeScript 编译器诊断）
    -h, --help                打印帮助信息
    -V, --version             打印版本信息
```
