# 构建

`vp build` 用于为生产环境构建 Vite 应用程序。

## 概述

`vp build` 通过 Vite+ 运行标准的 Vite 生产构建。因为它是直接基于 Vite 的，所以构建管线和配置模型与 Vite 相同。有关 Vite 生产构建如何工作的更多信息，请参阅 [Vite 指南](https://vite.dev/guide/build)。请注意，Vite+ 使用 Vite 8 和 [Rolldown](https://rolldown.rs/) 进行构建。

::: info
`vp build` 始终运行内置的 Vite 生产构建。如果你的项目在 `package.json` 中也有一个 `build` 脚本，当你想运行该脚本时，请运行 `vp run build`。
:::

## 用法

```bash
vp build
vp build --watch
vp build --sourcemap
```

## 配置

在 `vite.config.ts` 中使用标准 Vite 配置。有关完整的配置参考，请参阅 [Vite 配置文档](https://vite.dev/config/)。

它可用于：

- [插件](https://vite.dev/guide/using-plugins)
- [别名](https://vite.dev/config/shared-options#resolve-alias)
- [`build`](https://vite.dev/config/build-options)
- [`preview`](https://vite.dev/config/preview-options)
- [环境模式](https://vite.dev/guide/env-and-mode)

## 预览

使用 `vp preview` 在执行 `vp build` 后本地提供生产构建。

```bash
vp build
vp preview
```
