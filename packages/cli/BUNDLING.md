# CLI 包构建架构

本文档说明 `vite-plus` 是如何构建的，以及它如何从 `@voidzero-dev/vite-plus-core`（打包后的 vite/rolldown/tsdown）和上游 `vitest` 进行重新导出，以作为 `vite` 的直接替代品使用。

## 概览

CLI 包使用一个 **4 步构建流程**：

1. **tsdown 构建** - 通过 tsdown 打包所有 CLI 入口
2. **NAPI 绑定构建** - 将 Rust 代码编译为原生 Node.js 绑定
3. **核心包导出同步** - 将 `@voidzero-dev/vite-plus-core` 以 `./client`、`./types/*` 等路径重新导出
4. **测试包导出同步** - 将上游 `vitest` 以 `./test/*` 路径重新导出

这种架构允许用户从单个包（`vite-plus`）中导入所有内容，作为 `vite` 的直接替代品，而无需了解单独的 `@voidzero-dev/vite-plus-core` 打包产物或 `vitest`。

## 构建步骤

### 第 1 步：tsdown 构建（`buildWithTsdown`）

使用 tsdown 打包所有 CLI 入口点（在 `tsdown.config.ts` 中配置）。该配置定义了两个构建：

**ESM 构建** — 将所有入口点打包到 `dist/`：

- 公共 API 入口：`bin`、`index`、`define-config`、`fmt`、`lint`、`pack`、`pack-bin`
- 全局命令入口：`create`、`migrate`、`version`、`config`、`mcp`、`staged`
- 所有第三方依赖都会在构建时内联
- 只有必须在运行时解析的包会保持 external（NAPI 绑定、`@voidzero-dev/vite-plus-core`、`vitest`、`oxfmt`、`oxlint`）
- 代码分割会为多个入口共享的代码创建公共 chunk
- 为所有入口生成 DTS（`.d.ts`）文件

**CJS 构建** — 为以下内容生成双格式输出：

- `define-config.ts` → `dist/define-config.cjs`
- `index.cts` → `dist/index.cjs`

**输入**：`src/**/*.ts`、`src/**/*.cts`
**输出**：`dist/*.js`、`dist/*.cjs`、`dist/*.d.ts`、`dist/*-<hash>.js`（共享 chunk）

### 第 2 步：NAPI 绑定构建（`buildNapiBinding`）

使用 `@napi-rs/cli` 构建原生 Rust 绑定：

```typescript
const cli = new NapiCli();
await cli.build({
  packageJsonPath: '../package.json',
  cwd: 'binding',
  platform: true,
  release: process.env.VP_CLI_DEBUG !== '1',
  esm: true,
});
```

**输入**：`binding/*.rs`（Rust 源码）
**输出**：`binding/*.node`（平台相关二进制文件）

该构建会生成平台特定的原生二进制文件，并使用 `oxfmt` 格式化生成的 JavaScript 包装器。

### 第 3 步：核心包导出同步（`syncCorePackageExports`）

创建 shim 文件，从 `@voidzero-dev/vite-plus-core` 重新导出，使该包能够作为上游 `vite` 的直接替代品。这对于与现有 Vite 插件和配置保持兼容性至关重要。

**前置条件**：核心包必须先构建完成（其 `dist/vite/` 目录必须存在）。关于核心包如何打包 vite、rolldown 和 tsdown 的详细信息，请参见 [核心包打包](../core/BUNDLING.md)。

**创建的导出路径**：

| 导出路径             | 类型       | 描述                                                                                 |
| -------------------- | ---------- | ------------------------------------------------------------------------------------ |
| `./client`           | 仅类型     | 用于环境类型声明（CSS 模块、资源导入等）的三斜杠引用                                   |
| `./module-runner`    | JS + 类型  | 重新导出 Vite module runner，用于 SSR/环境                                           |
| `./internal`         | JS + 类型  | 重新导出 Vite 内部 API                                                             |
| `./dist/client/*`    | JS         | 客户端运行时文件（`.mjs`、`.cjs`）                                                   |
| `./types/*`          | 仅类型     | 使用 `export type *` 的仅类型重新导出                                                |
| `./types/internal/*` | 被阻止     | 设为 `null` 以阻止访问内部类型                                                        |

**Shim 文件示例**：

```typescript
// dist/client.d.ts（用于环境类型的三斜杠引用）
/// <reference types="@voidzero-dev/vite-plus-core/client" />

// dist/module-runner.js
export * from '@voidzero-dev/vite-plus-core/module-runner';

// dist/types/importMeta.d.ts（仅类型导出）
export type * from '@voidzero-dev/vite-plus-core/types/importMeta.d.ts';
```

**关于导出顺序的说明**：在 `package.json` 中，`./types/internal/*` 导出（设为 `null`）必须出现在 `./types/*` 之前，以确保正确的优先级。更具体的模式必须排在通配符之前。

### 第 4 步：测试包导出同步（`syncTestPackageExports`）

读取 vitest 的导出以及三个 `@vitest/browser-*` provider 包，并创建 shim 文件，将所有内容重新导出到 `./test/*` 下：

```typescript
// 对于每个 vitest 导出，例如 "./node"
// 创建一个 shim 文件：dist/test/node.js
export * from 'vitest/node';

// 对于每个 @vitest/browser-* provider，会投影出两个 shim 表面：
//   dist/test/browser-playwright.js          （匹配旧的包装路径）
//   dist/test/browser/providers/playwright.js（别名路径）
export * from '@vitest/browser-playwright';
```

provider 的 `.d.ts` shim **不是**简单的裸重新导出——请参见下方关于 [Provider 类型身份](#why-provider-dts-shims-are-inlined) 的说明。

**输入**：通过 `createRequire` 解析得到的 `vitest/package.json` 导出，以及每个 `@vitest/browser-*` 包的导出
**输出**：`dist/test/*.js`、`dist/test/*.d.ts`、更新后的 `package.json` 导出

---

## 输出结构

```
packages/cli/
├── dist/
│   ├── bin.js                # CLI 入口点（已打包）
│   ├── index.js              # 主入口（ESM，已打包）
│   ├── index.cjs             # 主入口（CJS）
│   ├── index.d.ts            # 类型声明
│   ├── define-config.js      # 配置辅助工具（ESM）
│   ├── define-config.cjs     # 配置辅助工具（CJS）
│   ├── define-config.d.ts
│   ├── fmt.js                # 重新导出 oxfmt
│   ├── lint.js               # 重新导出 oxlint 类型
│   ├── pack.js               # 重新导出 vite-plus-core/pack
│   ├── pack-bin.js           # `vp pack` 的 tsdown CLI
│   ├── create.js             # 全局命令：vp create
│   ├── migrate.js            # 全局命令：vp migrate
│   ├── version.js            # 全局命令：vp --version
│   ├── config.js             # 全局命令：vp config
│   ├── mcp.js                # 全局命令：vp mcp
│   ├── staged.js             # 全局命令：vp staged
│   ├── *-<hash>.js           # 共享 chunk（代码分割）
│   ├── versions.js           # 生成的工具版本
│   ├── client.d.ts           # ./client 类型（三斜杠引用）
│   ├── module-runner.js      # ./module-runner shim
│   ├── internal.js           # ./internal shim
│   ├── client/               # 同步后的客户端运行时文件
│   ├── types/                # 同步后的类型定义
│   └── test/                 # 同步后的测试导出
├── binding/
│   ├── index.js              # NAPI 绑定 JS 包装器
│   ├── index.d.ts            # NAPI 类型声明
│   └── *.node                # 平台相关二进制文件
└── bin/
    └── vp                    # Shell 入口点
```

---

## NAPI 目标

CLI 会为以下平台目标构建原生绑定：

| 目标                        | 平台     | 架构   | 输出文件                           |
| --------------------------- | -------- | ------ | ---------------------------------- |
| `aarch64-apple-darwin`      | macOS    | ARM64  | `vite-plus.darwin-arm64.node`     |
| `x86_64-apple-darwin`       | macOS    | x64    | `vite-plus.darwin-x64.node`       |
| `aarch64-unknown-linux-gnu` | Linux    | ARM64  | `vite-plus.linux-arm64-gnu.node`  |
| `x86_64-unknown-linux-gnu`  | Linux    | x64    | `vite-plus.linux-x64-gnu.node`    |
| `aarch64-pc-windows-msvc`   | Windows  | ARM64  | `vite-plus.win32-arm64-msvc.node` |
| `x86_64-pc-windows-msvc`    | Windows  | x64    | `vite-plus.win32-x64-msvc.node`   |

这些目标在 `package.json` 的 `napi.targets` 字段下定义。

---

## Rolldown 原生绑定集成

CLI 包在原生绑定层面集成了 Rolldown，使得 vite-plus 可以作为一个自包含的包发布，而无需用户单独安装 `@rolldown/binding-*` 包。

### 条件编译

Rolldown 绑定通过 Cargo feature 标志被 **可选地** 编译进 vite-plus 原生模块。

**在 `binding/Cargo.toml` 中**：

```toml
[dependencies]
rolldown_binding = { workspace = true, optional = true }

[features]
rolldown = ["dep:rolldown_binding"]
```

**在 `binding/src/lib.rs` 中**：

```rust
#[cfg(feature = "rolldown")]
pub extern crate rolldown_binding;
```

### 构建时特性激活

只有在发布构建期间才会启用 rolldown 特性：

```typescript
// 在 build.ts 中
await cli.build({
  features: process.env.RELEASE_BUILD ? ['rolldown'] : void 0,
  release: process.env.VP_CLI_DEBUG !== '1',
});
```

**当 `RELEASE_BUILD=1` 时**：

1. 启用 `rolldown` Cargo feature
2. 将 `rolldown_binding` 编译进 `.node` 文件
3. 从 rolldown 的 package.json 中提取 `napi.dtsHeader` 用于类型定义
4. 将自定义类型定义前置到生成的 `.d.ts` 文件中

### 为什么要条件编译？

| 构建类型                  | rolldown 特性 | 使用场景                         |
| ------------------------- | ------------- | -------------------------------- |
| 开发（`pnpm build`）      | 禁用          | 更快的构建，更小的二进制文件       |
| 发布（`RELEASE_BUILD=1`） | 启用          | 带有内置 rolldown 的完整发行版    |

### 模块标识符重写

在发布构建期间，核心包会将所有 `@rolldown/binding-*` 导入重写为指向 `vite-plus/binding`：

```typescript
// 在 packages/core/build.ts 中
if (process.env.RELEASE_BUILD) {
  // @rolldown/binding-darwin-arm64 → vite-plus/binding
  source = source.replace(/@rolldown\/binding-([a-z0-9-]+)/g, 'vite-plus/binding');
}
```

**转换示例**：

| 原始导入                          | 重写后              |
| ---------------------------------- | ------------------- |
| `@rolldown/binding-darwin-arm64`   | `vite-plus/binding` |
| `@rolldown/binding-linux-x64-gnu`  | `vite-plus/binding` |
| `@rolldown/binding-win32-x64-msvc` | `vite-plus/binding` |

这意味着：

1. 打包后的 rolldown 代码位于 `@voidzero-dev/vite-plus-core/rolldown`，并从 `vite-plus/binding` 解析原生绑定
2. 用户无需单独安装 `@rolldown/binding-*` 平台包
3. 单个 `.node` 文件同时包含 vite-plus task runner 和 rolldown 绑定

### 原生绑定内容

当使用 `RELEASE_BUILD=1` 编译时，`.node` 文件包含：

| 组件               | 来源                                   | 用途                         |
| ------------------ | -------------------------------------- | ---------------------------- |
| `vite_task`        | `packages/cli/binding/src/lib.rs`      | 任务运行器会话管理           |
| `rolldown_binding` | `rolldown/crates/rolldown_binding`     | Rolldown 打包器 NAPI 绑定    |

### 导出链路

```
用户导入 'vite-plus/rolldown'
  → packages/cli 从 @voidzero-dev/vite-plus-core/rolldown 重新导出
    → packages/core/dist/rolldown/index.mjs
      → 原生绑定：vite-plus/binding（由 @rolldown/binding-* 重写而来）
        → binding/vite-plus.darwin-arm64.node（包含 rolldown_binding）
```

### 按平台发布

原生绑定会以独立的平台包形式发布，以获得最佳安装体积：

| 平台      | 发布的包                                  |
| --------- | ----------------------------------------- |
| macOS ARM64 | `@voidzero-dev/vite-plus-darwin-arm64`    |
| macOS x64   | `@voidzero-dev/vite-plus-darwin-x64`      |
| Linux ARM64 | `@voidzero-dev/vite-plus-linux-arm64-gnu` |
| Linux x64   | `@voidzero-dev/vite-plus-linux-x64-gnu`   |
| Windows x64 | `@voidzero-dev/vite-plus-win32-x64-msvc`  |

这些包会根据用户的平台，通过 `optionalDependencies` 自动安装。

有关发布流程，请参见 `publish-native-addons.ts`。

## 核心包导出同步细节

### 为什么要使用 Shim 文件？

CLI 包会创建轻量的 shim 文件，从 `@voidzero-dev/vite-plus-core` 重新导出内容，而不是打包实际代码。这样做有以下好处：

1. **支持即插即用替换** - 用户可以在不修改导入语句的情况下，将 `vite` 替换为 `vite-plus`
2. **保持包同步** - 核心包变更时无需重新构建 CLI
3. **减少重复** - 不需要复制文件，只做重新导出
4. **保留模块解析行为** - Node.js 会解析到实际的核心包

**注意**：`@voidzero-dev/vite-plus-core` 包本身会打包多个上游项目（vite、rolldown、tsdown、vitepress）。详情请参见[核心包打包](../core/BUNDLING.md)。

### 导出映射（核心）

| 上游 Vite 导出        | CLI 包导出              | 描述                           |
| --------------------- | ----------------------- | ------------------------------ |
| `vite/client`        | `vite-plus/client`      | HMR、CSS 模块、资源的环境类型 |
| `vite/module-runner` | `vite-plus/module-runner` | SSR/环境模块运行器             |
| `vite/internal`      | `vite-plus/internal`    | 内部 API                        |
| `vite/dist/client/*` | `vite-plus/dist/client/*` | 客户端运行时代码文件           |
| `vite/types/*`       | `vite-plus/types/*`      | 类型定义                        |

### 仅类型导出

对于 `./types/*` 导出，shim 文件使用 `export type *` 语法（TypeScript 5.0+），以确保只重新导出类型信息：

```typescript
// dist/types/importMeta.d.ts
export type * from '@voidzero-dev/vite-plus-core/types/importMeta.d.ts';
```

这一点很重要，因为 `./types/*` 只暴露 `.d.ts` 文件，绝不应包含运行时代码。

### 内部类型阻止访问

`./types/internal/*` 导出在 package.json 中被设置为 `null`，以阻止访问内部类型定义：

```json
"./types/internal/*": null,
"./types/*": { "types": "./dist/types/*" }
```

`syncTypesDir()` 辅助函数在创建 shim 时会跳过顶层的 `internal` 目录，因为访问已在 exports 层级被阻止。

### 客户端类型（三斜杠引用）

`./client` 导出使用三斜杠引用，而不是普通导出，因为 Vite 的 `client.d.ts` 包含环境类型声明（例如 CSS 模块、资源等），这些声明应当全局可用：

```typescript
// dist/client.d.ts
/// <reference types="@voidzero-dev/vite-plus-core/client" />
```

这使 TypeScript 能够获取诸如 `import.meta.hot`、CSS 模块类型以及资源导入等类型，而无需显式导入。

---

## 测试包导出同步细节

### 为什么要使用 Shim 文件？

我们不复制 vitest 的 dist 文件，而是创建轻量的 shim 文件，从 `vitest` 重新导出内容。这样做有以下好处：

1. **保持包同步** - vitest 升级时无需重新构建 CLI
2. **减少重复** - 不需要复制文件，只做重新导出
3. **保留模块解析行为** - Node.js 会解析到实际安装的 vitest

### 导出映射（测试）

vitest 自身 `exports` 下的每个入口都会在 `./test/*` 下生成 shim（会跳过通配符导出和 `./package.json`）。这些 shim 纯粹是重新导出——`vite-plus/test` 及其相关路径只是上游 `vitest` 对应子路径的别名。示例：

| Vitest 导出       | CLI 包导出                |
| ----------------- | ------------------------- |
| `vitest`          | `vite-plus/test`          |
| `vitest/browser`  | `vite-plus/test/browser`  |
| `vitest/node`     | `vite-plus/test/node`     |
| `vitest/config`   | `vite-plus/test/config`   |
| `vitest/reporters` | `vite-plus/test/reporters` |

完整集合会在每次构建时根据上游 vitest 的 `package.json` 重新生成，因此精确列表会跟随 vitest 本身变化。

除了 vitest 自身的导出外，三个 `@vitest/browser-*` provider 包也会被投射到两个并行的访问面上，以便在删除 `@voidzero-dev/vite-plus-test` 包装器后，现有用户代码仍能正常解析：

| Provider 包                   | CLI 包导出                                                                 |
| ---------------------------- | -------------------------------------------------------------------------- |
| `@vitest/browser-playwright` | `vite-plus/test/browser-playwright`, `vite-plus/test/browser/providers/playwright` |
| `@vitest/browser-preview`    | `vite-plus/test/browser-preview`, `vite-plus/test/browser/providers/preview`     |
| `@vitest/browser-webdriverio` | `vite-plus/test/browser-webdriverio`, `vite-plus/test/browser/providers/webdriverio` |

每个 provider 自己的子路径（例如 `./context`）都会在这两个别名前缀下镜像。

> **注意 — webdriverio 和 playwright 是可选安装的。** `@vitest/browser`（基础包）和 `@vitest/browser-preview` 仍作为 `vite-plus` 的捆绑式 **运行时依赖**（并在迁移时从用户的 manifests 中移除），因为它们都不携带重量级的非可选 peer 依赖。`@vitest/browser-webdriverio` 和 `@vitest/browser-playwright` 现在是 vite-plus 的 **devDependencies + optional peerDependencies**——它们保留为 devDependency，以便构建时的 shim 生成仍能输出 `./test/browser-webdriverio*` / `./test/browser-playwright*` 导出（上面的导出/shim 形态保持不变），但二者都不是捆绑式运行时依赖。它们之所以是可选 peer，是因为它们各自会带入一个非可选的框架 peer（`webdriverio` / `playwright`），而非浏览器消费者不应被迫安装这些依赖。面向某个 provider 的用户应通过 `vp migrate` 将其**保留**在自己项目的**依赖**中（固定到捆绑的 vitest 版本，并确保其框架 peer 已满足），这样他们重写后的 `vite-plus/test/browser-webdriverio` / `vite-plus/test/browser-playwright` 导入就能正常解析。

#### 为什么 provider 的 d.ts shim 要内联

provider 的 `.d.ts` shim **不是**简单的 `export * from '@vitest/browser-playwright'` 重新导出——它们会将上游 `.d.ts` 内容内联，并把 `vitest/node` / `vitest/browser` / `@vitest/browser*` 的裸 specifier 重写为 `dist/test/` 内的相对路径。两个私有 shim `dist/test/_at-vitest-browser.d.ts` 和 `dist/test/_at-vitest-browser/context.d.ts` 会重新导出 `@vitest/browser`/`@vitest/browser/context`，并在这些重写中被引用。

这样可以避免 pnpm-edge 的类型身份分裂：当通过引用加载上游 `.d.ts`（`export * from '@vitest/browser-playwright'`）时，TypeScript 会通过 provider 包自身的 pnpm-edge 解析其中的 `import { BrowserProvider } from 'vitest/node'`，而这可能与用户 `vite.config.ts` 通过 `vite-plus` 看到的 vitest 不是同一个副本。这个不匹配会生成两个结构相同但名义上不同的 `BrowserProvider` 类型，因此 `provider: playwright()` 会导致用户的类型检查失败。通过重写 specifier，所有类型导入都会经由 vite-plus 自己的子路径 shim 路由，从而保证用户整个配置中只有一个 vitest 身份。

### 条件导出处理

同步逻辑会处理带有 `import`/`require`/`node`/`types` 条件的复杂条件导出。

**Vitest 的主导出**（`"."`）：

```json
".": {
  "import": { "types": "...", "node": "...", "default": "..." },
  "require": { "types": "...", "default": "..." }
}
```

**变为 CLI 包导出**（`"./test"`）：

```json
"./test": {
  "import": {
    "types": "./dist/test/index.d.ts",
    "node": "./dist/test/index.js",
    "default": "./dist/test/index.js"
  },
  "require": {
    "types": "./dist/test/index.d.cts",
    "default": "./dist/test/index.cjs"
  }
}
```

针对每种条件，都会创建相应的 shim 文件：

- `.js` 用于 ESM 导入
- `.cjs` 用于 CommonJS require
- `.d.ts` / `.d.cts` 用于类型声明

### Shim 文件内容

**ESM shim**（`dist/test/browser.js`）：

```javascript
export * from 'vitest/browser';
```

**CJS shim**（`dist/test/index.cjs`）：

```javascript
module.exports = require('vitest');
```

**类型 shim**（`dist/test/browser.d.ts`）：

```typescript
import 'vitest/browser';
export * from 'vitest/browser';
```

注意：类型 shim 包含一个副作用导入，以保留模块增强（例如 `Assertion` 接口上的 `toMatchSnapshot`）。

---

## 构建依赖

| 包名            | 用途                         |
| -------------- | ---------------------------- |
| `@napi-rs/cli` | Rust 的 NAPI 构建工具链       |
| `oxfmt`        | 生成的 JS 代码格式化          |
| `tsdown`       | TypeScript 打包               |

---

## 调试模式

使用调试（未优化）的 Rust 绑定进行构建：

```bash
VP_CLI_DEBUG=1 pnpm build
```

这会在 NAPI 构建选项中设置 `release: false`，生成更大但编译更快的调试二进制文件。

---

## 构建命令

```bash
# 构建 CLI 包（需要先构建核心包）
pnpm -C packages/cli build

# 从 monorepo 根目录构建（先构建所有依赖）
pnpm build --filter vite-plus

# 调试构建
VP_CLI_DEBUG=1 pnpm -C packages/cli build
```

---

## 包导出

构建完成后，CLI 包导出如下内容：

| 导出路径                 | 描述                             |
| ------------------------ | -------------------------------- |
| `.`                      | 主入口（CLI 工具）                |
| `./client`               | 客户端类型（环境声明）            |
| `./module-runner`        | 用于 SSR 的 Vite 模块运行器       |
| `./internal`             | Vite 内部 API                    |
| `./dist/client/*`        | 客户端运行时代码文件               |
| `./types/*`              | 类型定义                         |
| `./bin`                  | CLI 二进制入口                    |
| `./binding`              | NAPI 原生绑定                    |
| `./test`                 | 测试包主入口                      |
| `./test/browser`         | 浏览器测试工具                    |
| `./test/browser-playwright` | Playwright 集成                |
| `./test/plugins/*`       | 用于 pnpm 覆盖的插件 shim        |
| `./package.json`         | 包元数据                         |

完整导出列表请参见 `package.json`。

## 技术参考

### 构建流程

```
1. buildWithTsdown()         tsdown bundle -> dist/*.js, dist/*.d.ts
2. buildNapiBinding()        Rust -> binding/*.node (per platform)
3. syncCorePackageExports()  Read core pkg dist -> dist/client/, dist/types/
   ├── createClientShim()        Triple-slash reference for ./client
   ├── createModuleRunnerShim()  JS + types for ./module-runner
   ├── createInternalShim()      JS + types for ./internal
   ├── syncClientDir()           Shims for ./dist/client/*
   └── syncTypesDir()            Type-only shims for ./types/*
4. syncTestPackageExports()  Read test pkg exports -> dist/test/*
   ├── createShimForExport()     Generate shim files
   ├── createConditionalShim()   Handle import/require conditions
   └── updateCliPackageJson()    Update exports in package.json
```

### 关键常量

```typescript
// 用于 Vite 兼容导出的核心包名称
const CORE_PACKAGE_NAME = '@voidzero-dev/vite-plus-core';

// 用于重新导出的测试包名称（vitest 本身，而不是打包后的包装器）
const TEST_PACKAGE_NAME = 'vitest';
```

### package.json 导出管理

`package.json` 中的 `exports` 字段分为两类：**手动** 和 **自动**。

#### 手动导出

所有非 `./test*` 导出都在 `package.json` 中手动维护。这些导出分为两组：

**CLI 原生导出** — 指向 CLI 自身通过 tsdown 构建的 TypeScript 打包产物（由 `buildWithTsdown()` 构建）：

| Export           | Description                |
| ---------------- | -------------------------- |
| `.`              | 主入口（CLI 工具） |
| `./bin`          | CLI 二进制入口点     |
| `./binding`      | NAPI 原生绑定        |
| `./lint`         | Lint 工具             |
| `./pack`         | Pack 工具             |
| `./package.json` | 包元数据           |

**核心 shim 导出** — 指向由 `syncCorePackageExports()` 自动生成的 shim 文件，这些文件会从 `@voidzero-dev/vite-plus-core` 重新导出。shim 文件会在每次构建时重新生成，但 `package.json` 中的条目本身是手动维护的：

| Export               | Description                                                             |
| -------------------- | ----------------------------------------------------------------------- |
| `./client`           | 用于环境类型声明（CSS modules 等）的三斜杠引用 |
| `./module-runner`    | 用于 SSR/环境的 Vite 模块运行器                                 |
| `./internal`         | Vite 内部 API                                                      |
| `./dist/client/*`    | 客户端运行时文件                                                    |
| `./types/internal/*` | 已阻止（`null`），以防止访问内部类型                    |
| `./types/*`          | 仅类型重新导出                                                    |

**注意**：核心包自身的导出（也就是这些 shim 指向的目标）由上游的 `packages/tools/src/sync-remote-deps.ts` 生成。详情请参见 [Core Package Bundling](../core/BUNDLING.md)。

#### 自动导出（`./test/*`）

所有 `./test*` 导出都由 `syncTestPackageExports()` 全权管理。构建脚本会：

1. 读取 vitest 的 `package.json` 导出配置（通过 `createRequire` 解析）
2. 在 `dist/test/` 中创建 shim 文件
3. 从 `package.json` 中移除旧的 `./test*` 导出
4. 合并新生成的测试导出
5. 确保 `dist/test` 在 `files` 数组中
