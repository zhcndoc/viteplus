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

- [`lint`](/config/lint) for Oxlint
- [`fmt`](/config/fmt) for Oxfmt
- [`test`](/config/test) for Vitest
- [`run`](/config/run) for Vite Task
- [`pack`](/config/pack) for tsdown
- [`staged`](/config/staged) for staged-file checks
