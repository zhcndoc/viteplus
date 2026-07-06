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
vp check --fix             # 格式化并运行自动修复器。
vp check --no-fmt          # 跳过格式化；运行 lint（如果启用了类型检查，则也运行类型检查）。
vp check --no-lint         # 跳过 lint 规则；启用时保留类型检查。
vp check --no-fmt --no-lint # 仅类型检查（需要启用 `typeCheck`）。
```

## 配置

`vp check` 使用你已经为 Lint 和格式化定义的相同配置：

- [`lint`](/guide/lint#配置) 块（在 `vite.config.ts` 中）
- [`fmt`](/guide/fmt#配置) 块（在 `vite.config.ts` 中）
- 用于类型感知 Lint 的 TypeScript 项目结构和 tsconfig 文件

推荐的 Lint 基础配置：

```ts [vite.config.ts]
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

### 默认禁用某个步骤

如果想让 `vp check` 在不每次都传入标志的情况下跳过格式化或 linting，可以在 `vite.config.ts` 中设置 [`check`](/config/check) 块。当项目需要工具链的其他部分，但不需要例如格式化时，这很方便：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  check: {
    fmt: false, // `vp check` 会进行 lint（以及类型检查），但不会格式化
  },
});
```

这些选项只影响 `vp check`；单独运行的 `vp fmt` 和 `vp lint` 仍会正常执行。如果在配置中禁用了某个步骤，或者传入了匹配的 `--no-fmt` / `--no-lint` 标志，则该步骤会被跳过。由于这些默认值会应用于每次 `vp check` 运行，因此调用 `vp check` 的 pre-commit hook 也会跳过被禁用的步骤。完整参考请参阅 [Check config](/config/check)。
