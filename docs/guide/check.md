# 检查

`vp check` 会同时运行格式检查、Lint 检查和类型检查。

## 概述

`vp check` 是 Vite+ 中用于快速静态检查的默认命令。它整合了以下工具的功能：
- 通过 [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) 进行格式化
- 通过 [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) 进行 Lint 检查
- 通过 [tsgolint](https://github.com/oxc-project/tsgolint) 进行 TypeScript 类型检查

通过将这些任务合并到单个命令中，`vp check` 比单独运行格式化、Lint 和类型检查工具更快。

当在 `vite.config.ts` 的 `lint.options` 块中启用 `typeCheck` 时，`vp check` 还会通过 TypeScript Go 工具链和 [tsgolint](https://github.com/oxc-project/tsgolint) 支持的类型感知路径运行 TypeScript 类型检查。`vp create` 和 `vp migrate` 默认同时启用 `typeAware` 和 `typeCheck`。

我们建议开启 `typeCheck`，这样 `vp check` 就成为开发过程中用于静态检查的单一命令。

## 用法

```bash
vp check
vp check --fix # 格式化并运行自动修复。
```

## 配置

`vp check` 使用你已经为 Lint 和格式化定义的相同配置：

- [`lint`](/guide/lint#配置) 块（在 `vite.config.ts` 中）
- [`fmt`](/guide/fmt#配置) 块（在 `vite.config.ts` 中）
- 用于类型感知 Lint 的 TypeScript 项目结构和 tsconfig 文件

推荐的 Lint 基础配置：

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
```
