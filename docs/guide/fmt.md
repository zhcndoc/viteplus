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

Vite+ 目前不支持嵌套的格式化配置。现在，请在根目录 `vite.config.ts` 中使用 [`fmt.overrides`](/guide/monorepo#format-overrides) 来配置特定文件或包的选项。长期行为仍在讨论中；[分享你的用例和期望](/guide/troubleshooting#nested-lint-or-format-config-is-not-applied)，帮助我们完善相关方案。

对于编辑器，请禁用嵌套的格式化程序配置，以便保存时格式化使用根目录 Vite+ 的 `fmt` 块：

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
