# 故障排除

当 Vite+ 的行为不符合预期时，请使用本页面。

::: warning
Vite+ 仍处于 Alpha 阶段。我们正在频繁更新、快速添加功能，并希望收到反馈以帮助改进。
:::

## 支持的工具版本

Vite+ 期望使用现代的上游工具版本。

- Vite 8 或更高版本
- Vitest 4.1 或更高版本

如果你正在迁移一个现有项目，并且它仍然依赖旧版本的 Vite 或 Vitest，请先升级这些依赖，然后再采用 Vite+。

## `vp check` 未运行类型感知 lint 规则或类型检查

- 确认 `lint.options.typeAware` 和 `lint.options.typeCheck` 在 `vite.config.ts` 中已启用
- 检查你的 `tsconfig.json` 是否使用了 `compilerOptions.baseUrl`

由 `tsgolint` 驱动的 Oxlint 类型检查器不支持 `baseUrl`，因此当该设置存在时，Vite+ 会跳过 `typeAware` 和 `typeCheck`。

## `vp lint` / `vp fmt` 可能无法读取 `vite.config.ts`

`vp lint`、`vp fmt` 以及 Oxc VS Code 扩展都会从 `vite.config.ts` 中读取 `lint` / `fmt` 配置块。目前该支持存在重要限制。

### 当前支持的内容

- 静态对象导出：
  - `export default { ... }`
  - `export default defineConfig({ ... })`

### 当前集成中可能失败的情况

- 函数式或异步配置：
  - `defineConfig((env) => ({ ... }))`
  - `defineConfig(async (env) => ({ ... }))`
- 依赖 Vite 转换/打包行为来执行的配置文件。

在问题 #930 中报告的某些场景下，读取 `vite.config.ts` 的 Oxc 侧集成可能更接近原生 ESM 加载行为（类似于 Vite 的 `--configLoader native`），而不是 Vite 的默认打包加载器。这意味着依赖打包/转换的配置可能无法为 lint/fmt/编辑器路径加载成功。请参见：https://github.com/voidzero-dev/vite-plus/issues/930

### 解决方法

- 当需要在 `vite.config.ts` 中使用 `lint` / `fmt` 时，优先使用静态的 `defineConfig({ ... })` 导出。
- 避免在 lint/fmt 使用的配置代码中使用 Node 特定全局变量（如 ESM 中的 `__dirname`）、未解析的 TS 专用导入，或没有导入属性的 JSON 导入。
- 如果需要，可将 `.oxlintrc.*` / `.oxfmtrc.*` 作为临时回退文件保留（尽管我们通常不推荐这样做），[尽管在此期间我们不建议这样做](/guide/lint##configuration)，直到此集成行为得到改进。

### VS Code 多根工作区注意事项

如果 VS Code 同时打开了多个文件夹，共享的 Oxc 语言服务器可能会选择与预期不同的工作区。这可能导致看起来像是缺少 `vite.config.ts` 支持。

- 确认扩展正在使用预期的工作区。
- 确认工作区解析为最新的 Oxc/Oxlint/Oxfmt 工具链。

## `vp build` 未运行我的构建脚本

与包管理器不同，内置命令无法被覆盖。如果你试图运行 `package.json` 中的脚本，请使用 `vp run build` 替代。

例如：

- `vp build` 始终运行内置的 Vite 构建
- `vp test` 始终运行内置的 Vitest 命令
- `vp run build` 和 `vp run test` 则运行 `package.json` 中的脚本

::: info
你还可以在 `vite.config.ts` 中定义自定义任务，并完全迁移出 `package.json` 脚本。
:::

## 分阶段检查与提交钩子

如果 `vp staged` 失败或预提交钩子未运行：

- 确保 `vite.config.ts` 包含 `staged` 块
- 运行 `vp config` 以安装钩子
- 检查是否因 `VITE_GIT_HOOKS=0` 而有意跳过了钩子安装

一个最小的分阶段配置示例如下：

```ts
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
});
```

## 请求帮助

如果你遇到困难，请联系我们：

- [Discord](https://discord.gg/cAnsqHh5PX) 用于实时讨论和故障排除帮助
- [GitHub](https://github.com/voidzero-dev/vite-plus) 用于问题、讨论和错误报告

在报告问题时，请包含：

- `vp env current` 和 `vp --version` 的完整输出
- 项目使用的包管理器
- 复现问题的具体步骤以及你的 `vite.config.ts`
- 最小的可重现仓库或可运行沙箱
