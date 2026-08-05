# 配置 Vite+

Vite+ 将项目配置集中在一个地方：`vite.config.ts`，允许你将多个顶层配置文件合并到一个文件中。你可以继续使用原有的 Vite 配置，如 `server` 或 `build`，并为其余工作流添加 Vite+ 模块：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  server: {},
  build: {},
  preview: {},

  create: {},
  run: {},
  fmt: {},
  lint: {},
  check: {},
  test: {},
  pack: {},
  staged: {},
});
```

## Vite+ 专属配置

Vite+ 通过以下扩展增强了基础 Vite 配置：

- [`create`](/config/create) 用于项目和模板脚手架默认配置
- [`run`](/config/run) 用于 Vite 任务
- [`fmt`](/config/fmt) 用于 Oxfmt
- [`lint`](/config/lint) 用于 Oxlint
- [`check`](/config/check) 用于 `vp check` 默认配置
- [`test`](/config/test) 用于 Vitest
- [`pack`](/config/pack) 用于 tsdown
- [`staged`](/config/staged) 用于暂存文件检查
- [`defaultPackage`](#defaultpackage) 用于工作区根目录下无参数应用命令的默认目标

## defaultPackage

当你在包含配置文件的目录中直接执行 `vp dev` / `vp build` / `vp preview` / `vp pack` 时，用于指定默认目标目录，相当于隐式执行 [`vp -C <dir>`](/guide/monorepo#app-commands)：

```ts [vite.config.ts]
export default {
  defaultPackage: './frontend',
};
```

vp 会在不执行配置文件的情况下读取这些值，因此即使仓库根目录没有 vite-plus 依赖，`defaultPackage` 也同样有效（例如 Laravel 或 Rails 仓库的 Vite 应用位于 `frontend/` 中，而 vite-plus 仅安装在该目录下）。正因为采用静态读取，这些值必须保持为普通字符串字面量，而不能使用表达式。显式指定的 `-C` 或位置参数目标始终优先于配置文件。
