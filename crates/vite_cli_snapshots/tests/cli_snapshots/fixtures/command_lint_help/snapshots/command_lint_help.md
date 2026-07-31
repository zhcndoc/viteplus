# 命令检查帮助

## `vp lint -h`

```
VITE+ - Web 统一工具链

用法：vp lint [PATH]... [OPTIONS]

检查代码。
选项会传递给 Oxlint。

选项：
  --tsconfig <PATH>  TypeScript tsconfig 路径
  --fix              尽可能修复问题
  --type-aware       启用需要类型信息的规则
  --import-plugin    启用 import 插件
  --rules            列出已注册的规则
  -h, --help         显示帮助

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

选项：
  --tsconfig <路径>  TypeScript tsconfig 路径
  --fix              在可能的情况下修复问题
  --type-aware       启用需要类型信息的规则
  --import-plugin    启用导入插件
  --rules            列出已注册的规则
  -h, --help         显示帮助

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

选项：
  --tsconfig <PATH>  TypeScript tsconfig 路径
  --fix              尽可能修复问题
  --type-aware       启用需要类型信息的规则
  --import-plugin    启用导入插件
  --rules            列出已注册的规则
  -h, --help         显示帮助

示例：
  vp lint
  vp lint src --fix
  vp lint --type-aware --tsconfig ./tsconfig.json

文档：https://viteplus.dev/guide/lint
```
