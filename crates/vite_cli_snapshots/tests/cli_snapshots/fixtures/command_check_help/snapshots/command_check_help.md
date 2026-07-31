# 命令检查帮助

## `vp check -h`

```
VITE+ - Web 的统一工具链

用法：vp check [选项] [路径]...

运行格式化、代码检查和类型检查。

选项：
  --fix                            自动修复格式和代码检查问题
  --no-fmt                         跳过格式检查
  --no-lint                        跳过代码检查规则；当 `lint.options.typeCheck` 为 true 时仍会运行类型检查
  --no-error-on-unmatched-pattern  当模式不匹配时不要退出并报错
  -h, --help                       显示帮助信息

示例：
  vp check
  vp check --fix
  vp check --no-lint src/index.ts

文档：https://viteplus.dev/guide/check
```

## `vp check --help`

```
VITE+ - Web 的统一工具链

用法：vp check [选项] [路径]...

运行格式化、代码检查和类型检查。

选项：
  --fix                            自动修复格式和代码检查问题
  --no-fmt                         跳过格式检查
  --no-lint                        跳过代码检查规则；当 `lint.options.typeCheck` 为 true 时仍会运行类型检查
  --no-error-on-unmatched-pattern  当模式未匹配时不退出并报错
  -h, --help                       显示帮助

示例：
  vp check
  vp check --fix
  vp check --no-lint src/index.ts

文档：https://viteplus.dev/guide/check
```

## `vp help check`

```
VITE+ - Web 统一工具链

用法：vp check [选项] [路径]...

运行格式化、代码检查和类型检查。

选项：
  --fix                            自动修复格式和代码检查问题
  --no-fmt                         跳过格式检查
  --no-lint                        跳过 lint 规则；当 `lint.options.typeCheck` 为 true 时仍会运行类型检查
  --no-error-on-unmatched-pattern  当模式不匹配时不以错误退出
  -h, --help                       显示帮助信息

示例：
  vp check
  vp check --fix
  vp check --no-lint src/index.ts

文档：https://viteplus.dev/guide/check
```
