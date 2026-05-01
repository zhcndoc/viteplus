# 提交钩子

使用 `vp config` 安装提交钩子，使用 `vp staged` 对暂存文件运行检查。

## 概述

Vite+ 支持提交钩子和暂存文件检查，无需额外工具。

使用：

- `vp config` 设置项目钩子和相关集成
- `vp staged` 对当前 Git 暂存的文件运行检查

如果你使用 [`vp create`](/guide/create) 或 [`vp migrate`](/guide/migrate)，Vite+ 会提示你自动为项目设置此功能。

## 命令

### `vp config`

`vp config` 为当前项目配置 Vite+。它会安装 Git 钩子、设置钩子目录，并可以处理相关的项目集成，例如代理设置。默认情况下，钩子会写入 `.vite-hooks`：

```bash
vp config
vp config --hooks-dir .vite-hooks
```

### `vp staged`

`vp staged` 使用 `vite.config.ts` 中的 `staged` 配置运行暂存文件检查。如果你已设置 Vite+ 来处理提交钩子，它会在你提交本地更改时自动运行。

```bash
vp staged
vp staged --verbose
vp staged --fail-on-changes
```

## 配置

在 `vite.config.ts` 的 `staged` 块中定义暂存文件检查：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*.{js,ts,tsx,vue,svelte}': 'vp check --fix',
  },
});
```

这是 Vite+ 的默认方法，应该在大多数项目中取代单独的 `lint-staged` 配置。因为 `vp staged` 从 `vite.config.ts` 读取配置，所以你的暂存文件检查与你的 lint、格式化、测试、构建和任务运行器配置保持在同一位置。
