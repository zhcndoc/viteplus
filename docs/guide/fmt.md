# 格式

`vp fmt` 使用 Oxfmt 格式化代码。

## 概述

`vp fmt` 基于 [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) 构建，Oxfmt 是 Oxc 的格式化工具。Oxfmt 完全兼容 Prettier，并设计为快速且可直接替代 Prettier。

使用 `vp fmt` 来格式化你的项目，使用 `vp check` 可以一次性完成格式化、 lint 和类型检查。

## 用法

```bash
vp fmt
vp fmt --check
vp fmt . --write
```

## 配置

将格式化配置直接放在 `vite.config.ts` 中的 `fmt` 块，这样所有配置都保持在一个地方。我们不建议在 Vite+ 中使用 `.oxfmtrc.json`。

对于编辑器，将格式化配置路径指向 `./vite.config.ts`，这样保存时格式化会使用相同的 `fmt` 块：

```json
{
  "oxc.fmt.configPath": "./vite.config.ts"
}
```

关于上游格式化程序的行为和配置参考，请参阅 [Oxfmt 文档](https://oxc.rs/docs/guide/usage/formatter.html)。

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {
    singleQuote: true,
  },
});
```
