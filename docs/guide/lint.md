# Lint

`vp lint` 使用 Oxlint 对代码进行 lint 检查。

## 概述

`vp lint` 基于 [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) 构建，Oxlint 是 Oxc 的 linter。它被设计为大多数前端项目中 ESLint 的快速替代方案，内置支持核心 ESLint 规则和许多流行的社区规则。

使用 `vp lint` 对项目进行 lint 检查，使用 `vp check` 可以同时完成格式化、lint 检查和类型检查。

## 用法

```bash
vp lint
vp lint --fix
vp lint --type-aware
```

## 配置

将 lint 配置直接放置在 `vite.config.ts` 中的 `lint` 块中，这样你的所有配置都集中在一个地方。我们不推荐在 Vite+ 中使用 `oxlint.config.ts` 或 `.oxlintrc.json`。

对于上游规则集、选项和兼容性详情，请参阅 [Oxlint 文档](https://oxc.rs/docs/guide/usage/linter.html)。

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  lint: {
    ignorePatterns: ['dist/**'],
    options: {
      typeAware: true,
      typeCheck: true,
    },
  },
});
```

## 类型感知型 Lint 检查

我们建议在 `lint` 块中同时启用 `typeAware` 和 `typeCheck`：

- `typeAware: true` 启用需要 TypeScript 类型信息的规则
- `typeCheck: true` 在 lint 检查期间启用完整的类型检查

此功能基于 TypeScript Go 工具链上的 [tsgolint](https://github.com/oxc-project/tsgolint) 实现。它使 Oxlint 能够获取类型信息，并允许通过 `vp lint` 和 `vp check` 直接进行类型检查。

## JavaScript 插件

如果你正在从 ESLint 迁移，并且仍然依赖一些关键的基于 JavaScript 的 ESLint 插件，Oxlint 支持 [JS 插件](https://oxc.rs/docs/guide/usage/linter/js-plugins)，可以帮助你在迁移完成前继续使用这些插件。
