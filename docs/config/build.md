# 构建配置

`vp dev`、`vp build` 和 `vp preview` 使用标准的 [Vite 配置](https://vite.dev/config/)，包括 [插件](https://vite.dev/guide/using-plugins)、[别名](https://vite.dev/config/shared-options#resolve-alias)、[`server`](https://vite.dev/config/server-options)、[`build`](https://vite.dev/config/build-options) 和 [`preview`](https://vite.dev/config/preview-options) 字段。

## 示例

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  server: {
    port: 3000,
  },
  build: {
    sourcemap: true,
  },
  preview: {
    port: 4173,
  },
});
```
