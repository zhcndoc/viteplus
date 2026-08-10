# command_tool_deep_help_delegation

带有额外参数的帮助请求将委托给底层工具。

## `vp test --help --coverage`

```
vitest/4.1.10

用法：
  $ vitest [...filters]

命令：
  run [...filters]
  related [...filters]
  watch [...filters]
  dev [...filters]
  bench [...filters]
  init <project>
  list [...filters]
  [...filters]
  complete [shell]

如需更多信息，请使用任意命令的 `--help` 标志：
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

选项：
  --coverage                                                 启用覆盖率报告。使用 '--help --coverage' 获取更多信息。
  --coverage.provider <name>                                 选择用于收集覆盖率的工具，可用值为："v8"、"istanbul" 和 "custom"
  --coverage.enabled                                         启用覆盖率收集。可使用 --coverage CLI 选项覆盖（默认值：false）
  --coverage.include <pattern>                               以 glob 模式指定要包含在覆盖率中的文件。使用多个模式时可以多次指定。默认情况下，仅包含被测试覆盖的文件。
  --coverage.exclude <pattern>                               要从覆盖率中排除的文件。使用多个扩展名时可以多次指定。
  --coverage.clean                                           在运行测试前清理覆盖率结果（默认值：true）
  --coverage.cleanOnRerun                                    在 watch 重新运行时清理覆盖率报告（默认值：true）
  --coverage.reportsDirectory <path>                         写入覆盖率报告的目录（默认值：./coverage）
  --coverage.reporter <name>                                 要使用的覆盖率报告器。访问 https://vitest.dev/config/coverage#coverage-reporter) 获取更多信息（默认值：["text", "html", "clover", "json"]
  --coverage.reportOnFailure                                 即使测试失败也生成覆盖率报告（默认值：false）
  --coverage.allowExternal                                   收集项目根目录外文件的覆盖率（默认值：false）
  --coverage.skipFull                                        不显示语句、分支和函数覆盖率均为 100% 的文件（默认值：false）
  --coverage.thresholds.100                                  将所有覆盖率阈值设置为 100 的快捷方式（默认值：false）
  --coverage.thresholds.perFile                              按文件检查阈值。实际阈值请参见 --coverage.thresholds.lines、--coverage.thresholds.functions、--coverage.thresholds.branches 和 --coverage.thresholds.statements（默认值：false）
  --coverage.thresholds.autoUpdate <boolean|function>        更新阈值：当当前覆盖率高于配置的阈值时，将 "lines"、"functions"、"branches" 和 "statements" 的阈值更新到配置文件中（默认值：false）
  --coverage.thresholds.lines <number>                       行阈值。访问 https://github.com/istanbuljs/nyc#coverage-thresholds 获取更多信息。自定义提供程序不支持此选项
  --coverage.thresholds.functions <number>                   函数阈值。访问 https://github.com/istanbuljs/nyc#coverage-thresholds 获取更多信息。自定义提供程序不支持此选项
  --coverage.thresholds.branches <number>                    分支阈值。访问 https://github.com/istanbuljs/nyc#coverage-thresholds 获取更多信息。自定义提供程序不支持此选项
  --coverage.thresholds.statements <number>                  语句阈值。访问 https://github.com/istanbuljs/nyc#coverage-thresholds 获取更多信息。自定义提供程序不支持此选项
  --coverage.ignoreClassMethods <name>                       要忽略覆盖率的类方法名称数组。访问 https://github.com/istanbuljs/nyc#ignoring-methods) 获取更多信息。此选项仅适用于 istanbul 提供程序（默认值：[]
  --coverage.processingConcurrency <number>                  处理覆盖率结果时使用的并发限制。（默认值为 20 与 CPU 数量中的较小值）
  --coverage.customProviderModule <path>                     指定自定义覆盖率提供程序模块的模块名称或路径。访问 https://vitest.dev/guide/coverage#custom-coverage-provider 获取更多信息。此选项仅适用于自定义提供程序
  --coverage.watermarks.statements <watermarks>              以 <high>,<low> 格式指定语句的高、低水位线
  --coverage.watermarks.lines <watermarks>                   以 <high>,<low> 格式指定行的高、低水位线
  --coverage.watermarks.branches <watermarks>                以 <high>,<low> 格式指定分支的高、低水位线
  --coverage.watermarks.functions <watermarks>               以 <high>,<low> 格式指定函数的高、低水位线
  --coverage.changed <commit/branch>                         仅收集自指定提交或分支以来发生更改的文件的覆盖率（例如 origin/main 或 HEAD~1）。默认继承 --changed 的值。
  --coverage.excludeAfterRemap                               在覆盖率重新映射到原始源文件后再次应用排除规则。（默认值：false）
  --coverage.htmlDir <path>                                  要在 UI 模式和 HTML 报告器中提供 HTML 覆盖率输出的目录。
```
