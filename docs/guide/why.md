# 为什么要使用 Vite+？

在今天的 JavaScript 生态系统中，开发人员需要一个运行时（如 Node.js）、一个包管理器（如 pnpm）、一个开发服务器、一个 linter、一个格式化工具、一个测试运行器、一个打包器、一个任务运行器，以及越来越多的配置文件。

Vite 表明，前端工具链可以通过重新思考架构而不是接受现状来变得显著更快。Vite+ 将同样的理念应用于本地开发工作流的其他部分，并将它们统一到一个包中，以加快并简化开发。

## Vite+ 解决的问题

JavaScript 工具链生态系统经历了相当程度的分化和波动。Web 应用程序不断变得更大，因此工具链的性能、复杂性和不一致性已成为项目增长的真实瓶颈。

这些瓶颈在拥有多个团队、每个团队使用不同工具栈的组织中被放大。依赖项管理、构建基础设施和代码质量成为分散的责任，由各个团队分别处理，且通常无人将其作为优先事项。结果导致依赖项不同步，构建速度变慢，代码质量下降。事后修复这些问题需要付出更多努力，拖慢所有人的进度，并使团队无法专注于交付产品。

## Vite+ 包含的内容

Vite+ 将现代 Web 开发所需的工具整合到一个统一的工具链中。无需组装和维护自定义工具链，Vite+ 提供了一致的入口点，统一管理运行时、依赖项、开发服务器、代码质量检查、测试和构建。

- **[Vite](https://vite.dev/)** 和 **[Rolldown](https://rolldown.rs/)** 用于开发和应用程序构建  
- **[Vitest](https://vitest.dev/)** 用于测试  
- **[Oxlint](https://oxc.rs/docs/guide/usage/linter.html)** 和 **[Oxfmt](https://oxc.rs/docs/guide/usage/formatter.html)** 用于代码检查和格式化  
- **[tsdown](https://tsdown.dev/)** 用于库构建或独立可执行文件  
- **[Vite Task](https://github.com/voidzero-dev/vite-task)** 用于任务编排  

实际上，这意味着开发人员只需与一个一致的工作流程交互：`vp dev`、`vp check`、`vp test` 和 `vp build`。

这种统一的工具链减少了配置开销，提升了性能，并使团队更容易在项目之间保持一致的工具设置。

## 默认情况下快速且可扩展

Vite+ 构建在 Vite、Rolldown、Oxc、Vitest 和 Vite Task 等现代工具之上，确保随着代码库增长，你的项目依然保持快速和可扩展。通过使用 Rust，我们可以将常见任务的速度提升 [10 倍甚至 100 倍](https://voidzero.dev/posts/announcing-vite-plus-alpha#performance-scale)。然而，许多基于 Rust 的工具链与现有工具不兼容，或无法使用 JavaScript 扩展。

Vite+ 通过 [NAPI-RS](https://napi.rs/) 将 Rust 与 JavaScript 连接起来，使其能够在 JavaScript 环境中提供熟悉、易于配置且可扩展的接口，并拥有良好的生态系统兼容的开发者体验。

统一工具链带来的性能优势不仅仅在于单独使用更快的工具。例如，许多开发人员会为 linter 设置“类型感知”工具，这要求在 linting 阶段运行完整的类型检查。使用 `vp check`，你可以在一次通过中完成格式化、lint 检查和类型检查，相比分别运行类型感知 lint 规则和类型检查，静态检查速度可提升 2 倍。

## 完全开源

Vite+ 完全开源，并非新的框架或封闭平台。Vite+ 与现有的 Vite 生态系统以及在其之上构建的框架（包括 React、Vue、Svelte 等）集成。它可以使用 pnpm、npm、yarn 或 Bun 作为包管理器，并为你管理 Node.js 运行时。

我们始终欢迎社区的贡献。请查看我们的 [贡献指南](https://github.com/voidzero-dev/vite-plus/blob/main/CONTRIBUTING.md) 参与其中。
