# 命令检查帮助

## `vp lint -h`

```
VITE+ - Web 统一工具链

用法：vp lint [PATH]... [OPTIONS]

检查代码。
选项会传递给 Oxlint。

参数：
  [PATH]...  要检查的文件或目录

基本配置：
  --tsconfig <PATH>  覆盖用于解析导入的 TypeScript 配置

规则严重级别：
  -A, --allow <NAME>  允许某条规则或类别
  -W, --warn <NAME>   对某条规则或类别发出警告
  -D, --deny <NAME>   对某条规则或类别报告错误

插件：
  --disable-unicorn-plugin     禁用默认启用的 unicorn 插件
  --disable-oxc-plugin         禁用默认启用的 Oxc 专属规则
  --disable-typescript-plugin  禁用默认启用的 TypeScript 插件
  --import-plugin              启用 import 插件
  --react-plugin               启用 React 插件
  --jsdoc-plugin               启用 JSDoc 插件
  --jest-plugin                启用 Jest 插件
  --vitest-plugin              启用 Vitest 插件
  --jsx-a11y-plugin            启用 JSX 无障碍插件
  --nextjs-plugin              启用 Next.js 插件
  --react-perf-plugin          启用 React 性能插件
  --promise-plugin             启用 promise 插件
  --node-plugin                启用 Node.js 插件
  --vue-plugin                 启用 Vue 插件

修复问题：
  --fix              在可能的情况下修复问题
  --fix-suggestions  应用可自动修复的建议
  --fix-dangerously  应用危险的修复和建议

忽略文件：
  --ignore-path <PATH>        使用指定的 .eslintignore 文件
  --ignore-pattern <PATTERN>  添加要忽略的文件模式
  --no-ignore                 禁用基于忽略规则的文件排除

处理警告：
  --quiet               仅报告错误
  --deny-warnings       报告警告时以非零状态退出
  --max-warnings <INT>  设置以非零状态退出前的警告阈值

输出：
  -f, --format <FORMAT>  设置输出格式：checkstyle、default、agent、github、gitlab、json、junit、sarif、stylish 或 unix
  --debug <OPTIONS>      启用以逗号分隔的调试输出选项：files 或 timings

其他：
  --silent                         不显示诊断信息
  --no-error-on-unmatched-pattern  未选择任何文件进行检查时不要以错误退出
  --threads <INT>                  要使用的线程数；设置为 1 以使用一个 CPU 核心
  --print-config                   输出解析后的配置，但不执行代码检查

内联配置：
  --report-unused-disable-directives                      报告未使用的 oxlint-disable 指令
  --report-unused-disable-directives-severity <SEVERITY>  以指定的严重级别报告未使用的 disable 指令

选项：
  --rules       列出所有已注册的规则
  --type-aware  启用需要类型信息的规则
  --type-check  启用实验性的类型检查和编译器诊断
  -h, --help    输出帮助信息

示例：
  vp lint
  vp lint src --fix
  vp lint --type-aware --tsconfig ./tsconfig.json

文档：https://viteplus.dev/guide/lint
```

## `vp lint --help`

```
VITE+ - Web 的统一工具链

用法：vp lint [路径]... [选项]

检查代码。
选项会传递给 Oxlint。

参数：
  [PATH]...  要检查的文件或目录

基本配置：
  --tsconfig <PATH>  覆盖用于解析导入的 TypeScript 配置

规则严重性：
  -A, --allow <NAME>  允许某条规则或某个类别
  -W, --warn <NAME>   对某条规则或某个类别发出警告
  -D, --deny <NAME>   对某条规则或某个类别发出错误

插件：
  --disable-unicorn-plugin     禁用默认启用的 unicorn 插件
  --disable-oxc-plugin         禁用默认启用的 Oxc 专用规则
  --disable-typescript-plugin  禁用默认启用的 TypeScript 插件
  --import-plugin              启用 import 插件
  --react-plugin               启用 React 插件
  --jsdoc-plugin               启用 JSDoc 插件
  --jest-plugin                启用 Jest 插件
  --vitest-plugin              启用 Vitest 插件
  --jsx-a11y-plugin            启用 JSX 可访问性插件
  --nextjs-plugin              启用 Next.js 插件
  --react-perf-plugin          启用 React 性能插件
  --promise-plugin             启用 promise 插件
  --node-plugin                启用 Node.js 插件
  --vue-plugin                 启用 Vue 插件

修复问题：
  --fix              在可能的情况下修复问题
  --fix-suggestions  应用可自动修复的建议
  --fix-dangerously  应用危险的修复和建议

忽略文件：
  --ignore-path <PATH>        使用指定的 .eslintignore 文件
  --ignore-pattern <PATTERN>  添加要忽略的文件模式
  --no-ignore                 禁用基于忽略规则的文件排除

处理警告：
  --quiet               仅报告错误
  --deny-warnings       报告警告时以非零状态退出
  --max-warnings <INT>  设置退出前允许的警告数量阈值

输出：
  -f, --format <FORMAT>  设置输出格式：checkstyle、default、agent、github、gitlab、json、junit、sarif、stylish 或 unix
  --debug <OPTIONS>      启用以逗号分隔的调试输出选项：files 或 timings

其他：
  --silent                         不显示诊断信息
  --no-error-on-unmatched-pattern  未选择任何文件进行检查时不以错误退出
  --threads <INT>                  要使用的线程数；设置为 1 可使用一个 CPU 核心
  --print-config                   输出解析后的配置，但不执行代码检查

内联配置：
  --report-unused-disable-directives                      报告未使用的 oxlint-disable 指令
  --report-unused-disable-directives-severity <SEVERITY>  以指定的严重性报告未使用的禁用指令

选项：
  --rules       列出所有已注册的规则
  --type-aware  启用需要类型信息的规则
  --type-check  启用实验性的类型检查和编译器诊断
  -h, --help    显示帮助信息

示例：
  vp lint
  vp lint src --fix
  vp lint --type-aware --tsconfig ./tsconfig.json

文档：https://viteplus.dev/guide/lint
```

## `vp help lint`

```
VITE+ - Web 统一工具链

用法：vp lint [PATH]... [OPTIONS]

检查代码。
选项将传递给 Oxlint。

参数：
  [PATH]...  要检查的文件或目录

基本配置：
  --tsconfig <PATH>  覆盖用于导入解析的 TypeScript 配置

规则严重性：
  -A, --allow <NAME>  允许某条规则或类别
  -W, --warn <NAME>   对某条规则或类别发出警告
  -D, --deny <NAME>   对某条规则或类别报告错误

插件：
  --disable-unicorn-plugin     禁用默认启用的 unicorn 插件
  --disable-oxc-plugin         禁用默认启用的 Oxc 特定规则
  --disable-typescript-plugin  禁用默认启用的 TypeScript 插件
  --import-plugin              启用 import 插件
  --react-plugin               启用 React 插件
  --jsdoc-plugin               启用 JSDoc 插件
  --jest-plugin                启用 Jest 插件
  --vitest-plugin              启用 Vitest 插件
  --jsx-a11y-plugin            启用 JSX 无障碍插件
  --nextjs-plugin              启用 Next.js 插件
  --react-perf-plugin          启用 React 性能插件
  --promise-plugin             启用 promise 插件
  --node-plugin                启用 Node.js 插件
  --vue-plugin                 启用 Vue 插件

修复问题：
  --fix              在可能的情况下修复问题
  --fix-suggestions  应用可自动修复的建议
  --fix-dangerously  应用具有潜在风险的修复和建议

忽略文件：
  --ignore-path <PATH>        使用指定的 .eslintignore 文件
  --ignore-pattern <PATTERN>  添加要忽略的文件模式
  --no-ignore                 禁用基于忽略规则的文件排除

处理警告：
  --quiet               仅报告错误
  --deny-warnings       报告警告时以非零状态退出
  --max-warnings <INT>  设置以非零状态退出前的警告阈值

输出：
  -f, --format <FORMAT>  设置输出格式：checkstyle、default、agent、github、gitlab、json、junit、sarif、stylish 或 unix
  --debug <OPTIONS>      启用以逗号分隔的调试输出选项：files 或 timings

其他：
  --silent                         不显示诊断信息
  --no-error-on-unmatched-pattern  未选择任何文件进行检查时不以错误退出
  --threads <INT>                  使用的线程数；设置为 1 可使用一个 CPU 核心
  --print-config                   输出解析后的配置，不执行代码检查

内联配置：
  --report-unused-disable-directives                      报告未使用的 oxlint-disable 指令
  --report-unused-disable-directives-severity <SEVERITY>  以指定的严重性报告未使用的 disable 指令

选项：
  --rules       列出所有已注册的规则
  --type-aware  启用需要类型信息的规则
  --type-check  启用实验性的类型检查和编译器诊断
  -h, --help    打印帮助信息

示例：
  vp lint
  vp lint src --fix
  vp lint --type-aware --tsconfig ./tsconfig.json

文档：https://viteplus.dev/guide/lint
```
