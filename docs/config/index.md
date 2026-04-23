# 配置 Vite+

Vite+ 将项目配置集中在一个地方：`vite.config.ts`，允许你将多个顶层配置文件合并到一个文件中。你可以继续使用原有的 Vite 配置，如 `server` 或 `build`，并为其余工作流添加 Vite+ 模块：

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  server: {},
  build: {},
  preview: {},

  test: {},
  lint: {},
  fmt: {},
  run: {},
  pack: {},
  staged: {},
});
```

## Vite+ 专属配置

Vite+ 通过以下扩展增强了基础 Vite 配置：

- [`lint`](/config/lint) 用于 Oxlint
- [`fmt`](/config/fmt) 用于 Oxfmt
- [`test`](/config/test) 用于 Vitest
- [`run`](/config/run) 用于 Vite Task
- [`pack`](/config/pack) 用于 tsdown
- [`staged`](/config/staged) 用于 staged-file checks
