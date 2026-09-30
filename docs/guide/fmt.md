# 格式

`vp fmt` 使用 Oxfmt 格式化代码。

## 概述

`vp fmt` 基于 [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) 构建，Oxfmt 是 Oxc 的格式化工具。Oxfmt 完全兼容 Prettier，并设计为快速且可直接替代 Prettier。

使用 `vp fmt` 来格式化你的项目，使用 `vp check` 可以一次性完成格式化、lint 和类型检查。

## 用法

```bash
vp fmt
vp fmt --check
vp fmt . --write
```

## 配置

将格式化配置直接放在根目录 `vite.config.ts` 的 `fmt` 块中，以便将所有配置集中在一处。我们不建议在 Vite+ 中使用 `.oxfmtrc.json`。

`vp fmt` 会从工作目录查找配置，因此从包目录运行时，如果包配置中没有自己的 `fmt` 块，就会使用根配置。相对文件参数的含义保持不变。请使用 [`fmt.overrides`](/guide/monorepo#format-overrides) 设置特定文件或包的选项，不要在包配置中添加 `fmt` 块。

如果工作区根目录存在 `fmt` 块，`vp check` 会使用该配置，即使命令是在包目录中运行。包配置不能替换 `vp check` 的这些格式设置。

显式使用 `vp fmt -c <path>` 或 `vp fmt --config <path>` 可选择其他配置。否则，Oxfmt 会查找最近的、包含 `fmt` 块的 `vite.config.*` 文件。支持的扩展名包括 `.js`、`.mjs`、`.ts`、`.cjs`、`.mts` 和 `.cts`。嵌套配置不会覆盖单个文件的设置。

对于编辑器，请禁用嵌套的格式化程序配置，避免其覆盖单个文件的设置：

```json [.vscode/settings.json]
{
  "oxc.fmt.disableNestedConfig": true
}
```

关于上游格式化程序的行为和配置参考，请参阅 [Oxfmt 文档](https://oxc.rs/docs/guide/usage/formatter.html)。

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    singleQuote: true,
  },
});
```
