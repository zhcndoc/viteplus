# 检查

`vp check` 会同时运行格式检查、Lint 检查和类型检查。

## 概述

`vp check` 是 Vite+ 中用于快速静态检查的默认命令。它整合了以下工具的功能：
- 通过 [Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html) 进行格式化
- 通过 [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) 进行 Lint 检查
- 通过 [tsgolint](https://github.com/oxc-project/tsgolint) 进行 TypeScript 类型检查

当在 `vite.config.ts` 的 `lint.options` 块中同时启用 `typeAware` 和 `typeCheck` 时，`vp check` 还会通过 TypeScript Go 工具链和 [tsgolint](https://github.com/oxc-project/tsgolint) 支持的 Oxlint 类型感知路径运行 TypeScript 类型检查。`vp create` 和 `vp migrate` 默认同时启用 `typeAware` 和 `typeCheck`。

我们建议同时启用 `typeAware` 和 `typeCheck`，使 `vp check` 成为开发期间执行静态检查的单一命令。

我们建议开启 `typeCheck`，这样 `vp check` 就成为开发过程中用于静态检查的单一命令。

## 用法

```bash
vp check
vp check --fix              # Format and run autofixers.
vp check --fix-dangerously  # Format and apply lint fixes, including dangerous fixes and suggestions.
vp check --continue-on-error # Report all enabled checks, even if formatting fails.
vp check --quiet            # Hide lint warnings; still report and fail on errors.
vp check --deny-warnings    # Treat lint warnings as errors.
vp check --no-fmt           # Skip format; run lint (and type-check if enabled).
vp check --no-lint          # Skip lint rules; keep type-check when enabled.
vp check --no-fmt --no-lint # Type-check only (requires both `typeAware` and `typeCheck` enabled).
```

如果格式化失败，`vp check` 会停止，不再运行 lint 和类型检查。要修复格式问题并应用可用的 lint 修复，请运行 `vp check --fix`。此命令会修改文件。要跳过格式化并运行其余已启用的检查，请运行 `vp check --no-fmt`。

使用 `vp check --fix-dangerously` 还会应用有风险的 lint 修复和建议。此选项会启用格式化修复，无需同时指定 `--fix`。有风险的 lint 修复可能改变程序行为，提交前请先检查变更。两个标志同时传入时，`--fix-dangerously` 对 lint 修复优先。和 `--fix` 一样，它也支持 `--no-fmt` 与 `--continue-on-error`；通过 `--no-lint` 或 `check.lint: false` 禁用 lint 规则时会跳过 lint 修复。类型诊断不会自动修复。

使用 `vp check --continue-on-error` 可在一次调用中运行所有已启用的检查，并报告格式化、lint 和类型错误，且不会修改文件。类型检查仍要求已启用 `lint.options.typeAware` 和 `lint.options.typeCheck`。只要任一检查失败，命令就会返回非零状态，即使后续检查通过也是如此。不使用 `--continue-on-error` 时，仍保持原有的快速失败行为。

`--continue-on-error` 也可与 `--fix` 一起使用：某个工具报告失败后仍会继续检查，并在 lint 修复后再次运行格式化。命令会保留首次失败的退出状态。`--no-fmt`、`--no-lint`、`--quiet` 和 `--deny-warnings` 等选项仍按原有方式生效。配置加载或命令启动错误仍会中止命令。

请将 `vp check` 标志放在文件路径之前。例如，使用 `vp check --fix src/index.ts`。第一个路径之后的参数会传给格式化和 lint 工具，而不是 `vp check`。

## 配置

`vp check` 使用你已经为 Lint 和格式化定义的相同配置：

- [`lint`](/guide/lint#配置) 块（在 `vite.config.ts` 中）
- [`fmt`](/guide/fmt#配置) 块（在 `vite.config.ts` 中）
- 用于类型感知 Lint 的 TypeScript 项目结构和 tsconfig 文件

推荐的 Lint 基础配置：

从工作区包目录运行时，`vp check` 使用工作区根目录的 `lint` 和 `fmt` 配置块。包配置不能替换根配置中的格式设置、lint 规则或类型检查选项。文件路径和 TypeScript 项目仍以包的工作目录为基准解析。

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

这些选项只影响 `vp check`；单独运行的 `vp fmt` 和 `vp lint` 仍会正常执行。如果在配置中禁用了某个步骤，或者传入了匹配的 `--no-fmt` / `--no-lint` 标志，则该步骤会被跳过。由于这些默认值会应用于每次 `vp check` 运行，因此调用 `vp check` 的 pre-commit hook 也会跳过被禁用的步骤。完整参考请参阅 [检查配置](/config/check)。
