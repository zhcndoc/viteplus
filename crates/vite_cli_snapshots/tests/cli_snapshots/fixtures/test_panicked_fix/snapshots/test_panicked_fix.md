# 测试恐慌修复

## `vp lint --help`

打印帮助信息且不发生崩溃

```
VITE+ - 面向 Web 的统一工具链

用法：vp lint [路径]... [选项]

检查代码。
选项将传递给 Oxlint。

参数：
  [路径]...  要检查的文件或目录

基本配置：
  --tsconfig <路径>  覆盖用于导入解析的 TypeScript 配置

规则严重级别：
  -A, --allow <名称>  允许某条规则或类别
  -W, --warn <名称>   对某条规则或类别发出警告
  -D, --deny <名称>   对某条规则或类别报错

插件：
  --disable-unicorn-plugin     禁用默认启用的 unicorn 插件
  --disable-oxc-plugin         禁用默认启用的 Oxc 特定规则
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
  --vue-plugin                启用 Vue 插件

修复问题：
  --fix              在可能的情况下修复问题
  --fix-suggestions  应用可自动修复的建议
  --fix-dangerously  应用危险修复和建议

忽略文件：
  --ignore-path <路径>        使用指定的 .eslintignore 文件
  --ignore-pattern <模式>     添加要忽略的文件模式
  --no-ignore                 禁用基于忽略规则的文件排除

处理警告：
  --quiet               仅报告错误
  --deny-warnings       报告警告时以非零状态退出
  --max-warnings <整数>  设置以非零状态退出前的警告阈值

输出：
  -f, --format <格式>  设置输出格式：checkstyle、default、agent、github、gitlab、json、junit、sarif、stylish 或 unix
  --debug <选项>       启用以逗号分隔的调试输出选项：files 或 timings

其他：
  --silent                         不显示诊断信息
  --no-error-on-unmatched-pattern  未选择文件进行检查时不要以错误退出
  --threads <整数>                 要使用的线程数；设置为 1 以使用一个 CPU 核心
  --print-config                   打印解析后的配置而不执行检查

内联配置：
  --report-unused-disable-directives                      报告未使用的 oxlint-disable 指令
  --report-unused-disable-directives-severity <严重级别>  以指定的严重级别报告未使用的禁用指令

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
