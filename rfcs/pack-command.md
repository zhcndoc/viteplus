# RFC：`vp pack` 命令

## 概要

`vp pack` 使用 tsdown（由 Rolldown 驱动的打包器）来打包 TypeScript/JavaScript 库。通过 `vite.config.ts` 中的 `pack` 键进行配置。

## 动机

将统一的库打包功能集成到 Vite+ 工具链中，替代独立使用 `tsdown` CLI。一个配置文件（`vite.config.ts`）即可管理所有工具——开发服务器、构建、测试、Lint，以及现在的打包。

### 当前痛点

```bash
# 独立的 tsdown 需要自己的配置文件
npx tsdown src/index.ts --format esm --dts

# 与 Vite 生态的其他部分分离的配置
# tsdown.config.ts vs vite.config.ts —— 工具链碎片化
```

### 提议的解决方案

```bash
# 集成到 vp CLI 中
vp pack src/index.ts --format esm --dts

# 配置与其他内容一起保存在 vite.config.ts 中
# vite.config.ts
export default {
  pack: { entry: 'src/index.ts', format: ['esm', 'cjs'], dts: true }
}
```

## 命令语法

```bash
vp pack [...files] [options]
```

### 使用示例

```bash
# 使用默认配置打包（ESM，node 平台）
vp pack src/index.ts

# 多种格式
vp pack src/index.ts --format esm --format cjs

# 带声明文件
vp pack src/index.ts --dts

# 带成功钩子的监听模式
vp pack src/index.ts --watch --on-success 'node dist/index.mjs'

# 工作区模式
vp pack --workspace --filter my-lib

# 打包为可执行文件（实验性，Node.js >= 25.7.0）
vp pack src/cli.ts --exe
```

## CLI 选项

### 输入

- `[...files]` — 要打包的入口文件
- `--config-loader <loader>` — 使用的配置加载器：`auto`、`native`、`unrun`（默认：`auto`）
- `--no-config` — 禁用配置文件
- `--from-vite [vitest]` — 复用来自 Vite 或 Vitest 的配置

### 输出

- `-f, --format <format>` — 打包格式：`esm`、`cjs`、`iife`、`umd`（默认：`esm`）
- `-d, --out-dir <dir>` — 输出目录（默认：`dist`）
- `--clean` — 清理输出目录，使用 `--no-clean` 可禁用
- `--sourcemap` — 生成源映射（默认：`false`）
- `--shims` — 启用 CJS 和 ESM shim（默认：`false`）
- `--minify` — 压缩输出

### 声明文件

- `--dts` — 生成 `.d.ts` 文件

### 平台与目标

- `--platform <platform>` — 目标平台：`node`、`browser`、`neutral`（默认：`node`）
- `--target <target>` — 打包目标，例如：`es2015`、`esnext`

### 依赖

- `--deps.never-bundle <module>` — 将依赖标记为 external
- `--treeshake` — 对 bundle 进行 tree-shaking（默认：`true`）

### 质量检查

- `--publint` — 启用 publint（默认：`false`）
- `--attw` — 启用 Are the types wrong 集成（默认：`false`）
- `--unused` — 启用未使用依赖检查（默认：`false`）

### 监听模式

- `-w, --watch [path]` — 监听模式
- `--ignore-watch <path>` — 在监听模式下忽略自定义路径
- `--on-success <command>` — 成功时运行的命令

### 环境

- `--env.* <value>` — 定义编译时环境变量
- `--env-file <file>` — 从文件加载环境变量（`--env` 中的变量优先）
- `--env-prefix <prefix>` — 注入到 bundle 中的环境变量前缀（默认：`VITE_PACK_,TSDOWN_`）

### 工作区

- `-W, --workspace [dir]` — 启用工作区模式
- `-F, --filter <pattern>` — 过滤配置（cwd 或名称），例如：`/pkg-name$/` 或 `pkg-name`

### 其他

- `--copy <dir>` — 将文件复制到输出目录
- `--public-dir <dir>` — `--copy` 的别名（已弃用）
- `--tsconfig <tsconfig>` — 设置 tsconfig 路径
- `--unbundle` — 取消打包模式
- `--report` — 大小报告（默认：`true`）
- `--exports` — 为 package.json 生成与导出相关的元数据（实验性）
- `--debug [feat]` — 显示调试日志
- `-l, --logLevel <level>` — 设置日志级别：`info`、`warn`、`error`、`silent`
- `--fail-on-warn` — 遇到警告即失败（默认：`true`）
- `--no-write` — 禁止将文件写入磁盘，与监听模式不兼容
- `--devtools` — 启用 devtools 集成

### 可执行文件（实验性）

- `--exe` — 作为 Node.js 单文件可执行应用程序（SEA）进行打包
  - 需要 Node.js >= 25.7.0
  - 仅支持单入口点
  - 默认使用 ESM 格式，默认禁用 DTS 生成
  - 在 macOS 上会自动应用临时代码签名。

## 配置

配置在 `vite.config.ts` 的 `pack` 键下指定：

```ts
// 单个配置
export default {
  pack: {
    entry: 'src/index.ts',
    format: ['esm', 'cjs'],
    dts: true,
  },
};

// 多个配置的数组
export default {
  pack: [
    { entry: 'src/index.ts', format: ['esm'], dts: true },
    { entry: 'src/cli.ts', format: ['cjs'] },
  ],
};
```

CLI 标志会覆盖配置文件中的值。当两者都提供时，CLI 标志优先。

## 架构

### 命令分发

```
Global CLI (Rust) ─── Category C delegation ───▸ Local CLI (pack-bin.ts) ───▸ tsdown
```

1. **全局 CLI**（`crates/vite_global_cli/src/cli.rs`）：`Pack` 命令变体使用 `trailing_var_arg` 捕获所有参数，然后无条件委托给本地 CLI。
2. **本地 CLI**（`packages/cli/src/pack-bin.ts`）：使用 `cac` 解析 CLI 选项，从 `vite.config.ts` 解析配置，并调用 tsdown 的 `resolveUserConfig` + `buildWithConfigs`。
3. **tsdown**：处理所有打包逻辑，包括新的 SEA/exe 功能。

### 配置解析

```
vite.config.ts (pack key) ──▸ merge with CLI flags ──▸ resolveUserConfig() ──▸ buildWithConfigs()
```

本地 CLI：

1. 通过 `resolveConfig()` 解析 Vite 配置，以找到 `vite.config.ts`
2. 读取 `pack` 键（对象或数组）
3. 将每个 pack 配置与 CLI 标志合并（CLI 优先）
4. 传递给 tsdown 的 `resolveUserConfig` 进行完整解析
5. 使用所有已解析的配置调用 `buildWithConfigs`

### 环境变量前缀

- 默认前缀：`VITE_PACK_`（主用）和 `TSDOWN_`（迁移兼容）
- 匹配这些前缀的变量会在编译时注入到 bundle 中
- 可通过 `--env-prefix` 自定义

### tsdown 集成

tsdown 被打包在 `@voidzero-dev/vite-plus-core/pack` 中：

- `packages/core/build.ts` 打包 tsdown 的 JS、CJS 依赖和类型
- `packages/core/package.json` 跟踪 `bundledVersions.tsdown`
- 通过 `packages/cli/src/pack.ts` 重新导出

`@tsdown/exe`（可执行文件）和 `@tsdown/css`（CSS 打包）扩展也与 tsdown 一起被打包，因此 `vp pack --exe` 和 CSS 打包可以在用户无需额外安装任何东西的情况下工作。参见 [tsdown 扩展](#bundled-tsdown-extensions)。

### 内置的 tsdown 扩展

这部分涵盖 `@tsdown/exe`（可执行文件）和 `@tsdown/css`（CSS 打包）扩展。

独立的 `@tsdown/exe` 和 `@tsdown/css` 对 `tsdown` 有硬性 peer 依赖，并导入 `tsdown/internal`。由于 Vite+ 在内部打包了 tsdown，而不是暴露一个可解析的顶层 `tsdown` 包，因此在项目级别安装它们会无法解析 `tsdown/internal`（`Failed to import module "@tsdown/exe"`）。参见 [issue #1586](https://github.com/voidzero-dev/vite-plus/issues/1586)。

为了解决这个问题，这两个扩展被打包进 core，而不是作为 peer 保留：

- `packages/core/build.ts`（`bundleTsdown`）将它们构建为稳定的命名入口 `dist/tsdown/tsdown-exe.js` 和 `dist/tsdown/tsdown-css.js`，从而使 `tsdown/internal` 在构建时能够解析到打包后的 tsdown。
- `wireBundledTsdownExtensions` 会重写打包后的 tsdown 调用点，使其加载本地 chunk（`importWithError("@tsdown/exe")` → `import("./tsdown-exe.js")`，`pkgExists("@tsdown/css")` → `true`，`import("@tsdown/css")` → `import("./tsdown-css.js")`）。
- `mergePackageJson` 会从发布的 `peerDependencies` 中移除 `@tsdown/exe`/`@tsdown/css`；它们的类型被内联到 `dist/tsdown/index-types.d.ts` 中。

`lightningcss`（`@tsdown/css` 用于 CSS 转换）是一个原生模块，不能被打包，因此保持外部依赖。它已经是 core 的 `dependency`（Vite 的 lightningcss 转换器也会使用它），所以打包后的 `@tsdown/css` 会自动解析它，CSS 打包无需额外安装即可工作。

## `--exe` 功能（实验性）

`--exe` 标志会将输出打包为 Node.js 单文件可执行应用程序（SEA）。

### 要求

- Node.js >= 25.7.0（使用 `node --build-sea` API）
- 仅支持单一入口点

### 行为

当传入 `--exe` 时：

1. tsdown 默认使用 ESM 格式
2. 默认禁用 DTS 生成
3. bundle 会被嵌入到 Node.js SEA blob 中
4. 在 macOS 上，会自动应用 ad-hoc 代码签名
5. 生成的可执行文件是一个独立二进制文件

### 错误处理

如果 Node.js 版本过旧：

```
Node.js 版本 v22.22.0 不支持 `exe` 选项。请升级到 Node.js 25.7.0 或更高版本。
```

## 与 `vp pm pack` 的关系

这是两个不同的命令：

| 命令         | 目的                              | 输出                |
| ------------ | --------------------------------- | ------------------- |
| `vp pack`    | 通过 tsdown 进行库打包             | `dist/` 目录        |
| `vp pm pack` | 通过 npm/pnpm/bun 创建 tarball    | `.tgz` 包文件       |

**注意：** 对于 tarball 创建，bun 使用 `bun pm pack`（而不是 `bun pack`）。它支持 `--destination` 和 `--dry-run` 标志。有关完整的命令映射，请参见 [pm-command-group RFC](./pm-command-group.md)。

## 设计决策

### 1. 配置放在 `vite.config.ts` 中（而不是 `tsdown.config.ts`）

**决策**：Pack 配置位于 `vite.config.ts` 的 `pack` 键下。

**理由**：

- 为整个 Vite+ 工具链提供单一配置文件
- 与 `vp build`、`vp test` 等的配置方式保持一致
- 减少项目中的配置文件扩散

### 2. `VITE_PACK_` 环境变量前缀（并保留 `TSDOWN_` 作为迁移兼容）

**决策**：默认环境变量前缀为 `VITE_PACK_`，并将 `TSDOWN_` 作为兼容迁移的回退选项。

**理由**：

- `VITE_PACK_` 符合 Vite+ 的命名约定
- `TSDOWN_` 确保从独立 tsdown 迁移过来的项目继续可用
- 用户可以通过 `--env-prefix` 覆盖

### 3. 将 tsdown 打包进核心

**决策**：tsdown 被打包进 `@voidzero-dev/vite-plus-core/pack`，而不是作为直接依赖使用。其 `@tsdown/exe` 和 `@tsdown/css` 扩展也以相同方式打包（见 [tsdown 扩展](#bundled-tsdown-extensions)）。

**理由**：

- 确保所有 vite-plus 用户使用一致的 tsdown 版本
- 避免 monorepo 中的版本冲突
- 核心构建流程会将 JS、CJS 依赖和类型一并打包
- 这些扩展依赖于 `tsdown`/`tsdown/internal`，而 Vite+ 并不将其作为顶层包暴露，因此打包它们是唯一可解析的方式（issue #1586）。只有 `lightningcss`（原生模块，无法打包）会保持外部依赖；它作为普通核心依赖发布。

### 4. C 类委派

**决策**：全局 CLI 会无条件将 `pack` 委派给本地 CLI。

**理由**：

- Pack 需要项目上下文（配置文件、依赖等）
- 遵循与 `build`、`test`、`lint` 相同的模式
- 对于打包而言，没有有意义的仅全局行为。

## CLI 帮助输出

```bash
$ vp pack -h
vp pack

用法：
  $ vp pack [...files]

命令：
  [...files]  打包文件

选项：
  --config-loader <loader>  要使用的配置加载器：auto、native、unrun（默认：auto）
  --no-config               禁用配置文件
  -f, --format <format>     打包格式：esm、cjs、iife、umd（默认：esm）
  --clean                   清理输出目录，使用 --no-clean 可禁用
  --deps.never-bundle <module>  将依赖标记为外部依赖
  --minify                  压缩输出
  --devtools                启用开发者工具集成
  --debug [feat]            显示调试日志
  --target <target>         打包目标，例如 "es2015"、"esnext"
  -l, --logLevel <level>    设置日志级别：info、warn、error、silent
  --fail-on-warn            遇到警告时失败（默认：true）
  --no-write                禁止将文件写入磁盘，与监视模式不兼容
  -d, --out-dir <dir>       输出目录（默认：dist）
  --treeshake               树摇打包（默认：true）
  --sourcemap               生成源映射（默认：false）
  --shims                   启用 cjs 和 esm shims（默认：false）
  --platform <platform>     目标平台（默认：node）
  --dts                     生成 dts 文件
  --publint                 启用 publint（默认：false）
  --attw                    启用 Are the types wrong 集成（默认：false）
  --unused                  启用未使用依赖检查（默认：false）
  -w, --watch [path]        监视模式
  --ignore-watch <path>     在监视模式下忽略自定义路径
  --from-vite [vitest]      复用 Vite 或 Vitest 的配置
  --report                  大小报告（默认：true）
  --env.* <value>           定义编译时环境变量
  --env-file <file>         从文件加载环境变量
  --env-prefix <prefix>     为注入到打包结果中的环境变量设置前缀
  --on-success <command>    成功时运行的命令
  --copy <dir>              复制文件到输出目录
  --public-dir <dir>        --copy 的别名，已弃用
  --tsconfig <tsconfig>     设置 tsconfig 路径
  --unbundle                非打包模式
  -W, --workspace [dir]     启用工作区模式
  -F, --filter <pattern>    过滤配置（cwd 或名称）
  --exports                 为 package.json 生成导出相关元数据（实验性）
  --exe                     使用 Node.js SEA 以可执行文件形式打包（实验性）
  -h, --help                显示此消息
```

## 快照测试

### 本地 CLI 测试：`command-pack`

**位置**：`packages/cli/snap-tests/command-pack/`

测试 `vp pack -h`（帮助输出包含所有选项，包括 `--exe`）以及 `vp run pack`（构建和缓存命中）。

### 本地 CLI 测试：`command-pack-css`

**位置**：`packages/cli/snap-tests/command-pack-css/`

测试在 CSS 入口上执行 `vp pack src/index.ts --minify`：捆绑的 `@tsdown/css` 加上 `lightningcss` 会转换 CSS（例如 `#ff0000` → `red`），证明在不安装 `@tsdown/css` 的情况下 CSS 捆绑也能正常工作（问题 #1586）。

### 本地 CLI 测试：`command-pack-tsdown-extensions`

**位置**：`packages/cli/snap-tests/command-pack-tsdown-extensions/`

加载捆绑的 `dist/tsdown/tsdown-exe.js` 和 `dist/tsdown/tsdown-css.js` 代码块，以证明它们会针对捆绑的 tsdown 解析 `tsdown/internal`，即使没有顶层 `tsdown` 包也是如此。这与 Node 版本无关（它不会运行 SEA 构建），因此它能在每个 CI Node 版本上捕获导入解析回归。

### 全局 CLI 测试：`command-pack-exe`

**位置**：`packages/cli/snap-tests-global/command-pack-exe/`

锁定 Node.js 25.7.0（`engines.node`），并端到端构建一个真实的 SEA 可执行文件（`vp pack --exe`，然后运行 `./build/index`），以测试捆绑的 `@tsdown/exe`。

### 全局 CLI 测试：`command-pack-exe-error`

**位置**：`packages/cli/snap-tests-global/command-pack-exe-error/`

测试当当前 Node.js 版本低于 25.7.0 时，`vp pack src/index.ts --exe` 的错误行为。

## 向后兼容性

此 RFC 记录了一个现有命令，且没有破坏性变更：

- 所有现有的 `vp pack` 选项继续可用
- 新的 `--exe` 标志仅是增量添加
- `vite.config.ts` 中的配置格式保持不变
- 打包 `@tsdown/exe`/`@tsdown/css` 是一项严格改进：之前已安装它们的项目仍可正常工作，并且不再需要安装它们。CSS 打包开箱即用，`lightningcss` 是工具链自带的核心依赖，因此无需额外安装任何内容。

## Exe 高级配置

### 程序化 `ExeOptions`

`exe` 选项接受一个对象用于高级配置：

<!-- prettier-ignore -->
```ts
export default {
  pack: {
    entry: 'src/cli.ts',
    exe: {
      seaConfig: {/* Node.js SEA 配置覆盖 */},
      fileName: 'my-cli',
      targets: [
        { platform: 'linux', arch: 'x64', nodeVersion: '25.7.0' },
        { platform: 'darwin', arch: 'arm64' },
      ],
    },
  },
};
```

### 跨平台可执行文件构建

跨平台构建由 `@tsdown/exe` 提供支持，它已内置到核心中（无需单独安装；参见 [tsdown 扩展](#bundled-tsdown-extensions)）。`targets` 选项接受一个 `{ platform, arch, nodeVersion }` 对象数组，用于从单一主机为不同平台构建可执行文件。

## 结论

`vp pack` 将基于 tsdown 的库打包集成到 Vite+ 工具链中。通过使用 `vite.config.ts` 进行配置并遵循 C 类委托模式，它与 `vp build`、`vp test` 和 `vp lint` 一起提供了一致的开发体验。新的 `--exe` 标志（实验性）可通过 SEA API 以独立 Node.js 可执行文件的形式进行打包。
