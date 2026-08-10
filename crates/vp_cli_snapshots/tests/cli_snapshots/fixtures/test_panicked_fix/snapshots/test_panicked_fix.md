# test_panicked_fix

## `vp lint --help`

打印帮助信息且不会发生 panic

```
VITE+ - Web 的统一工具链

用法：vp lint [PATH]... [OPTIONS]

检查代码。
选项会转发给 Oxlint。

可用的位置参数：
  [PATH]...  单个文件、单个路径或路径列表

基本配置：
  --tsconfig=<./tsconfig.json>  覆盖用于解析导入的 TypeScript 配置。Oxlint 会自动为每个文件查找相关的 `tsconfig.json`。仅当项目使用非标准的 tsconfig 名称或位置时使用此选项。

允许/拒绝多个检查规则：
  在命令行中从左到右累积规则和类别。
  例如 `-D correctness -A no-debugger` 或 `-A all -D no-debugger`。
  类别包括：
  * `correctness` - 明显错误或无用的代码（默认）
  * `suspicious`  - 最有可能错误或无用的代码
  * `pedantic`    - 相当严格或偶尔会产生误报的检查规则
  * `perf`        - 可以用更高性能的方式编写的代码
  * `style`       - 应以更符合惯用方式编写的代码
  * `restriction` - 禁止使用语言和库特性的检查规则
  * `nursery`     - 仍在开发中的新检查规则
  * `all`         - 上述除 `nursery` 外的所有类别。不自动启用插件。
  -A, --allow=NAME  允许规则或类别（抑制检查）
  -W, --warn=NAME   对规则或类别发出警告（产生警告）
  -D, --deny=NAME   拒绝规则或类别（产生错误）

启用/禁用插件：
  --disable-unicorn-plugin     禁用默认开启的 unicorn 插件
  --disable-oxc-plugin         禁用默认开启的 oxc 独有规则
  --disable-typescript-plugin  禁用默认开启的 TypeScript 插件
  --import-plugin              启用 import 插件并检测 ESM 问题。
  --react-plugin               启用默认关闭的 react 插件
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
  --ignore-pattern=PAT  指定要忽略的文件模式（在 `.eslintignore` 之外额外添加）
  --no-ignore           禁止根据 `.eslintignore` 文件、`--ignore-path` 标志和 `--ignore-pattern` 标志排除文件

处理警告：
  --quiet             禁止报告警告，只报告错误
  --deny-warnings     确保警告产生非零退出代码
  --max-warnings=INT  指定警告阈值，可用于在项目中存在过多警告级规则违规时强制以错误状态退出

输出：
  -f, --format=ARG  使用特定的输出格式。可用值：`checkstyle`、`default`、`agent`、`github`、`gitlab`、`json`、`junit`、`sarif`、`stylish`、`unix`
  --debug=OPTIONS   启用调试输出选项。选项以逗号分隔。可用值：
                     * `files` - 打印将要检查的文件列表，然后退出。
                     * `timings` - 启用每条规则的耗时信息。

其他：
  --silent                         不显示任何诊断信息
  --no-error-on-unmatched-pattern  未选择任何文件进行检查时不要以错误退出（例如应用忽略模式后）
  --threads=INT                    要使用的线程数。设置为 1 可仅使用 1 个 CPU 核心。
  --print-config                   此选项输出将要使用的配置。启用此选项时不会执行检查，且只有与配置相关的选项有效。

内联配置注释：
  --report-unused-disable-directives                    报告类似 `// oxlint-disable-line` 的指令注释，即使该行原本不会报告任何错误
  --report-unused-disable-directives-severity=SEVERITY  与 `--report-unused-disable-directives` 相同，但允许指定所报告错误的严重级别。两个选项不能同时使用。

可用选项：
  --rules       列出当前已注册的所有规则
  --type-aware  启用需要类型信息的规则
  --type-check  启用实验性类型检查（包括 TypeScript 编译器诊断）
  -h, --help    打印帮助信息

示例：
  vp lint
  vp lint src --fix
  vp lint --type-aware --tsconfig ./tsconfig.json

文档：https://viteplus.dev/guide/lint
```
