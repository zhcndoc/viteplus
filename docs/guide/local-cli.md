# 项目本地 CLI

不同于[全局 `vp` CLI](/guide/global-cli)，`vite-plus` 是一个 npm 包，其中包含项目本地的 `vp` CLI 和集成的前端工具链。当你希望在项目的 manifest 和 lockfile 中记录工具链版本，或不想安装独立的全局 CLI 时，可以将其作为开发依赖安装。

本地包包含 Vite、Rolldown、Vitest、Oxlint、Oxfmt、tsdown、Vite+ 任务运行器和包管理器命令。它需要一个现有的 Node.js 运行时和包管理器。

## 安装

对于大多数使用场景，我们建议使用 Vite+ CLI 在项目中安装，或创建一个新项目。详情请参阅[创建项目](/guide/create)和[迁移到 Vite+](/guide/migrate)。

::: code-group

```bash [pnpm]
pnpm dlx --package=vite-plus vp create
```

```bash [npm]
npx --package=vite-plus vp create
```

```bash [Yarn]
yarn dlx --package vite-plus vp create
```

```bash [Bun]
bunx --package vite-plus vp create
```

:::

通过你的包管理器运行其二进制文件。例如：

```bash
./node_modules/.bin/vp migrate --help
./node_modules/.bin/vp check
```

为便于阅读，文档使用不带前缀的 `vp` 命令。如果没有全局 CLI，请使用包管理器的本地二进制执行器为交互式命令添加前缀，例如 `pnpm exec`。

### 手动安装

如果你要手动将项目迁移到 Vite+，请先安装这些开发依赖：

```bash
vp install -D vite-plus
```

你需要向包管理器添加 overrides，使其他包解析到 Vite+ 的版本：将 `vite` 别名指向 `@voidzero-dev/vite-plus-core`，并将 `vitest` 固定为 Vite+ 打包的版本（运行 `vp --version`），这样整个项目就能与 `vp test` 共享单一的 Vitest 副本。如果不固定 `vitest`，依赖或工作区包可能会拉取与打包运行器不同的 Vitest，从而拆分 Vitest 的内部组件（mocks、`expect`、运行器状态）：

::: code-group

```yaml [pnpm-workspace.yaml]
overrides:
  vite: npm:@voidzero-dev/vite-plus-core@latest
  vitest: 4.1.11
```

```json [npm / Bun package.json]
"overrides": {
  "vite": "npm:@voidzero-dev/vite-plus-core@latest",
  "vitest": "4.1.11"
}
```

```json [Yarn package.json]
"resolutions": {
  "vite": "npm:@voidzero-dev/vite-plus-core@latest",
  "vitest": "4.1.11"
}
```

:::

::: details 为什么需要这些设置？

依赖和插件可以直接导入 `vite` 或 `vitest`，即使你自己的代码是从 `vite-plus` 导入的。这些 overrides 会使它们的依赖与 Vite+ 使用的工具链保持一致：

- `vite` 别名会将这些导入指向 Vite+ 的核心包。不同的 Vite 实例可能会破坏运行时身份检查：[issue #1391](https://github.com/voidzero-dev/vite-plus/issues/1391) 报告了 TanStack Start 返回 404 的问题，原因是 `instanceof` 检查跨越了两个副本。[PR #2617](https://github.com/voidzero-dev/vite-plus/pull/2617) 通过使用相同的别名共享 Vite，从 CLI 侧解决了这一问题
- 精确固定 `vitest` 可以让依赖和 `vp test` 使用相同的 Vitest 版本，避免出现不同的 mocks、`expect` 实例和运行器状态。[PR #2365](https://github.com/voidzero-dev/vite-plus/pull/2365) 记录了手动安装时的这一要求

升级时，请让核心别名与你安装的 `vite-plus` 版本保持一致，并更新 Vitest 固定版本，使其与打包的版本匹配。[Issue #2356](https://github.com/voidzero-dev/vite-plus/issues/2356) 介绍了依赖机器人可能独立更新这些包，导致不兼容的版本被同时安装的情况

:::

## 最佳实践

我们建议将[全局 CLI](/guide/global-cli)与项目本地 CLI 结合使用。全局 CLI 会让你可以直接在终端中使用 `vp`，并将 `vp dev`、`vp build` 和 `vp test` 等开发命令委托给项目中已安装的 `vite-plus` 包。这样既能方便地使用工具链，又能让其版本由项目控制。当然，如果你愿意，也可以只使用项目本地 CLI。

对于开源项目或任何有协作者的项目，我们建议在 `package.json` 中添加调用 `vp` 的 scripts，无论你使用两个 CLI 还是只使用项目本地 CLI。在 scripts 中，`vp` 会自动从 `node_modules/.bin` 解析：

```json [package.json]
{
  "scripts": {
    "dev": "vp dev",
    "check": "vp check",
    "test": "vp test",
    "build": "vp build"
  }
}
```

安装项目依赖后，贡献者可以通过包管理器运行这些 scripts，例如 `pnpm run dev` 或 `npm run dev`，无需安装全局 CLI。

## 包含内容

项目本地 CLI 可以独立用于：

- 使用 Vite 和 Rolldown 执行 [`vp dev`](/guide/dev)、[`vp build`](/guide/build) 和 [`vp preview`](/guide/build)
- 使用 Oxc 执行 [`vp check`](/guide/check)、[`vp lint`](/guide/lint) 和 [`vp fmt`](/guide/fmt)
- 使用 Vitest 执行 [`vp test`](/guide/test)
- 使用 tsdown 执行 [`vp pack`](/guide/pack)
- 使用 [`vp toolchain`](/guide/upgrade#show-the-toolchain) 检查项目本地包中捆绑的版本
- 使用 [`vp run`](/guide/run) 并在工作区之间缓存任务
- 使用当前已在 shell 中激活的 Node.js 运行时执行[包管理器命令](/guide/install)
- 执行 [`vp create`](/guide/create)、[`vp migrate`](/guide/migrate) 和项目配置命令

本地包无法管理机器级别的 Vite+ 安装。`vp env`、`vp upgrade` 和 `vp implode` 命令需要[全局 CLI](/guide/global-cli)。请通过包管理器升级或移除仅本地安装。

## 稍后添加全局 CLI

你可以随时安装全局 CLI，而无需更改项目依赖。`vp dev`、`vp build` 和 `vp test` 等命令仍会继续使用项目中已安装的 `vite-plus` 版本。

请参阅[同时使用两个 CLI](/guide/global-cli#use-both-clis-together)了解选择规则。
