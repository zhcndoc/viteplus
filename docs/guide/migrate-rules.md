# 迁移规则

This reference describes exactly what `vp migrate` does to a project: how it updates dependencies, rewrites source imports and package scripts, and adjusts package-manager configuration. See the [migration guide](./migrate.md) for the command overview and workflow.

Except for [Before You Migrate](#before-you-migrate), which lists steps you take yourself, everything below describes automatic behavior.

## 迁移前

1. 运行 `vp upgrade`，以便全局 CLI 使用最新的迁移规则。过时的本地 `vite-plus` 并不会阻止迁移：当项目的本地副本版本较旧时，迁移会委托给全局 CLI。
2. 在必要时将项目升级到 Vite 8+ 和 Vitest 4.1+。
3. 从工作区根目录运行 `vp migrate`。在自动化环境中使用 `--no-interactive`。
4. 检查每个发生变更的清单、包管理器配置、源码重写结果和生成的锁文件。
5. 使用 `vp install`、`vp check`、`vp test` 和 `vp build` 进行验证。

迁移具有幂等性：成功迁移后再次运行，不应产生新的差异。

## 升级 vs. 完整设置

对于已经依赖 `vite-plus` 的项目，`vp migrate` 只执行升级：它会更新依赖和包管理器配置，并完成导入。它不会修改项目设置。

- `--full` 还会运行设置操作：Git hooks、编辑器配置、代理文件、ESLint 和 Prettier 迁移、框架 shim、tsconfig 的 `baseUrl` 修复，以及从 `.nvmrc`/Volta 到 `.node-version` 的转换。
- `--hooks`、`--agent` 和 `--editor` 可在不使用 `--full` 的情况下选择单个设置操作。
- 当默认升级跳过了本应执行的设置操作时，它会提示运行 `vp migrate --full`。全新的（非 Vite+）项目始终会运行完整迁移。

## Pack 配置

`vp migrate` 会更新 `vite.config.*` 中的静态 `pack` 对象，以及 `tsdown.config.*` 中导出的对象，以适配 [tsdown 0.23](https://github.com/rolldown/tsdown/releases/tag/v0.23.0)。对于已有的 Vite+ 项目，即使不使用 `--full` 也会执行此操作，包括工作区包。支持数组和由 `defineConfig` 回调返回的直接对象。JSON tsdown 配置会在合并到 `vite.config.ts` 后接收相同的更新。

| 之前的选项                                                       | 更新后的选项                                                                           |
| ---------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `bundle: false`                                                  | `unbundle: true`                                                                       |
| `bundle: true`                                                   | 移除；打包仍然是默认行为                                                               |
| `outExtension`                                                   | `outExtensions`                                                                        |
| `publicDir`                                                      | `copy`                                                                                 |
| `removeNodeProtocol: true`                                       | `nodeProtocol: 'strip'`                                                                |
| `injectStyle`                                                    | `css.inject`                                                                           |
| `inlineOnly` / `deps.onlyAllowBundle`                            | `deps.onlyBundle`                                                                      |
| `noExternal`                                                     | `deps.alwaysBundle`                                                                    |
| `skipNodeModulesBundle: true` / `deps.skipNodeModulesBundle: true` | `deps.neverBundle: true`                                                               |
| `dts.tsgo` / `dts.oxc`                                           | 使用 `dts.generator` 选择；保留生成器选项对象并移除布尔标志                             |
| `dts.cjsReexport`                                                | 移除；tsdown 会单独生成 CJS 声明                                                         |
| `tsdown` 或 `vp pack` 脚本中的 `--public-dir`                    | `--copy`                                                                               |

当缺少 `deps.resolveDepSubpath` 时，迁移会将其设置为 `true`，以保留之前的默认行为。如果已启用 ATTW 检查且未设置 profile，则会添加 `profile: 'strict'`。显式值（包括 `false`）保持不变。

`noExternal` 会移动到 `deps.alwaysBundle`，并保留匹配器表达式、引用和回调方法。现有的 `deps.alwaysBundle` 值保持不变。

当 `external` 与任一种 `skipNodeModulesBundle` 形式同时存在时，静态匹配器和对本地常量的引用会在设置 `deps.neverBundle` 之前移动到 `inputOptions.external`。常量声明和引用保持不变。这会保留原始的匹配规则，包括外部文件路径。不支持的匹配器、冲突的 `inputOptions` 以及特定于声明的依赖规则会使 pack 对象保持不变，并产生手动迁移警告。

转换过程不会执行配置代码。包含展开属性、计算键或重复键的对象，以及冲突的新旧选项，都需要手动检查。动态布尔选择器保持不变。不相关的 Vite 和插件选项保持不变。迁移后运行 `vp pack` 检查结果。Node.js 要求、TypeScript 模块解析和程序化 `build()` 返回值需要单独检查。

## 依赖规则

一目了然地看各个工具链依赖会发生什么：

| 依赖                           | 会发生什么                                                                                                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `vite-plus`                    | 在迁移包的位置添加；普通范围会被重新固定为具体目标，直接固定或通过目录。                                                                                               |
| `vite`                         | 保留现有声明并指向核心别名。在 pnpm 下，在需要的任何位置作为直接 dev 依赖添加（见 [Vite 和 Overrides](#vite-and-overrides)）。                                         |
| `vitest`                       | 在常见的 node 模式下移除，因为 `vite-plus` 会间接提供它。仅在[直接需要时](#when-vitest-is-directly-required)保留或添加。                                             |
| `@vitest/*`                    | 直接安装与捆绑的 Vitest 版本保持一致的锁步包（见 [Vitest 生态包](#vitest-ecosystem-packages)）。                                                                       |
| `@voidzero-dev/vite-plus-test` | 在所有地方移除：dependencies、overrides、resolutions 和 catalog 别名。导入会重写为当前的 `vite-plus/test*` 接口。                                                   |

### 版本选择

- `vite-plus` 固定为执行迁移的 CLI 的具体版本，绝不会使用 `latest` dist-tag。
- `vite` 别名指向同一 Vite+ 版本中的 `@voidzero-dev/vite-plus-core`。
- 基于 catalog 的清单可能包含 `catalog:` 或命名 catalog 引用。迁移会保留该引用，并将所引用的 catalog 值更新为具体的工具链目标版本。
- 有意指定的协议固定会被保留：`workspace:`、`file:`、`link:`、`npm:`、`github:`、Git URL 和 HTTP URL。
- 迁移会协调每个工作区包，而不只是根清单。共享的 overrides 和 catalogs 保留在工作区根目录；提供 peer 的依赖属于每个需要它的包。

### Vite 和 Overrides

包管理器的 overrides 本身不会创建依赖边。在 pnpm 下，如果某个包在 `dependencies` 或 `devDependencies` 中列出 `vite-plus`，但在任何位置（`dependencies`、`devDependencies`、`optionalDependencies` 或 `peerDependencies`）都没有 `vite` 条目，pnpm 会自动安装上游 Vite，以满足 Vitest 所需的 `vite` peer，从而使项目分裂为独立的 Vite+、Vite 和 Vitest 实例。为防止这种情况，`vp migrate` 会将缺失的 `vite` 条目添加到每个此类包的 `devDependencies` 中；工作区 override 随后会将其重定向到 Vite+ core。

相关规则：

- 仅仅因为根 override 存在，直接的 `vite` 声明也绝不会被移除。
- 普通别名或过时别名会被规范化；命名 catalog 引用会被保留。
- 在 pnpm 下，受管理的 override 键使用显式的 `@*` 范围（`vite@*`、`vitest@*`）。pnpm 会通过替换每个清单（包括 importer 清单）中声明的 spec 来应用 override。裸键会匹配任意 spec，包括 `catalog:`，随后 `vp up` 会将该引用重写为具体版本。`@*` 范围会使 override 作用于传递依赖和 peer 声明所使用的 semver 范围，同时将 `catalog:` 引用留给 catalog，因为 catalog 已经会将它们解析到 Vite+ core。对于仍然使用裸键的项目，迁移会重新设置其键，并保留其命名 catalog 选择。
- 上述直接条目规则仅适用于 pnpm。Bun 会将其 core 别名镜像为直接依赖，以供其 peer resolver 使用；而 npm 的浏览器提供程序布局可能需要顶层 `vite` 边，以便嵌套的 Vitest 包解析 `vite`。

### 何时直接需要 Vitest

当满足以下任一条件时，迁移会以精确的捆绑版本保留或添加包本地的 `vitest`：

- 已安装的依赖具有非可选的 `vitest` peer，无论是精确版本还是范围；
- 该包使用 Vitest 浏览器模式或选择加入的浏览器提供程序；
- 源码或 TypeScript 配置保留了上游 `vitest` 引用；
- 该包声明了 `@nuxt/test-utils`；或
- 依赖元数据不可用，且已有的直接 `vitest` 可能正在满足未知的必需 peer。

检测会读取已安装的 peer 元数据，因此即使 `vite-plugin-gherkin` 这类集成的名称不包含 `vitest`，也能正确处理。

当某个包符合条件时，迁移会：

- 将 `vitest` 添加到该包，而不是不加区分地添加到每个工作区包；
- 在支持时使用现有的 catalog 引用，否则使用精确的捆绑版本；并且
- 保留匹配的工作区 override 或 resolution，使依赖图解析为单一的 Vitest 版本。

仅有 peer 声明并不会安装 Vitest。如果保留下来的 `peerDependencies.vitest` 使用了迁移将移除的 catalog 条目，则会先将其解析为公开的 peer 范围。

### Vitest 生态包

官方当前的 `@vitest/*` 包通常与 Vitest 同步发布。迁移会对项目直接安装的包进行版本对齐，包括 `@vitest/coverage-v8`、`@vitest/coverage-istanbul`、`@vitest/ui` 和 `@vitest/web-worker`：

- 当包管理器支持 catalogs 时，会通过工具链 catalog 引用它们：保留现有的 `catalog:` / `catalog:<name>` 引用，为缺少 catalog 的包添加 catalog 条目，并将每个条目更新为捆绑的 Vitest 版本；
- 当不支持 catalogs 时（npm、独立的 bun 项目，或预 catalog 版本的 pnpm/Yarn），会直接写入具体的捆绑版本。

**不会**对齐的包：

- `@vitest/eslint-plugin` 遵循自己的版本线；
- `@vitest/coverage-c8` 停留在较早版本，没有 Vitest 4 版本；以及
- 第三方 `vitest-*` 集成保留各自兼容的版本，但它们所需的 Vitest peer 仍可能触发[直接提供](#when-vitest-is-directly-required)。

对于浏览器模式，基础的 `@vitest/browser` runtime 和 `@vitest/browser-preview` 由 Vite+ 捆绑，并作为直接依赖移除。Playwright 和 WebdriverIO 提供程序仍需选择加入：保留或注入的提供程序会通过首选工具链 catalog 以捆绑的 Vitest 版本引用（不支持 catalogs 时则具体写入），并且其 `playwright` 或 `webdriverio` peer 会一并安装。

在重写导入之前会检测提供程序。这涵盖了将 `vitest` 别名指向 `@voidzero-dev/vite-plus-test` 的旧项目，以及从 `vitest/browser-<provider>`、`vitest/browser/providers/<provider>` 或 `vitest/plugins/browser-<provider>` 导入的项目：这些导入仍会安装相应的 `@vitest/browser-playwright` 或 `@vitest/browser-webdriverio` 依赖及其框架 peer。

对象值的嵌套 npm 和 Bun overrides 会被保留：它们是用户定义的作用域，而不是标量版本固定。

## 源码重写规则

### `vite` 导入

`vite` 和 `vite/*` 导入仅在配置入口文件中重写为 `vite-plus`：`vite.config.*`、`vitest.config.*` 以及迁移解析出的任何配置文件。其他所有文件都会保留其 `vite` 导入，原因有二：

- `vite-plus` 并不保证是 Vite 暴露接口的超集。它只拥有 `defineConfig`、`defineProject` 和 `lazyPlugins`，因此重写诸如 `createBuilder` 或 `loadConfigFromFile` 这样的透传符号（包括 `typeof import('vite')` 类型位置中的符号）可能导致破坏。
- 未重写的 `vite` 导入仍会通过 Vite+ 项目中的 `@voidzero-dev/vite-plus-core` 别名解析。

插件包（以 `vite-plugin-` 或 `unplugin-` 开头的非 scoped 名称，或在 `peerDependencies`/`dependencies` 中包含 `vite` 的包）即使位于配置文件中，也会跳过重写。此规则仅适用于 `vite` specifier。

`declare module 'vite'` 扩展遵循相同规则，并在配置文件之外保留。通过 core 别名，它们会到达同一个 `@voidzero-dev/vite-plus-core` 模块；该模块的 `UserConfig` 类型会从 `vite-plus` 获取 `defineConfig`，因此迁移后仍可正常工作；`vite-plus` 自身不导出 `UserConfig` 符号，因此重写后的 `declare module 'vite-plus'` 扩展将无法合并到任何内容。针对 `vite-plus` 自身接口的扩展需要手动针对 `vite-plus` 编写。

### `vitest` 和浏览器导入

- 普通的 `vitest` 和 `vitest/*` 导入会重写为 `vite-plus/test*`。
- 旧版 Playwright 和 WebdriverIO 提供程序导入会在此次重写之前检测，以免丢失其可选提供程序依赖。
- scoped 的 `@vitest/browser*` 导入会重写为对应的 `vite-plus/test/browser*` 导出，并在需要时提供选择加入的提供程序。
- 已有的 `vite-plus/test*` 导入保持不变。

### Oxlint JS Plugin 导入

Vite+ 捆绑了 Oxlint，因此迁移会移除独立的 `oxlint` 依赖。你自己的 Oxlint JS 插件会按名称导入 authoring API。当该依赖消失后，此导入将无法解析。随后 `vp lint` 会加载插件失败。

迁移会将这些导入重新指向 Vite+：

- 它会将 `@oxlint/plugins` 重写为 `vite-plus/lint/plugins`。
- 它会将 `oxlint/plugins-dev` 重写为 `vite-plus/lint/plugins-dev`。
- 当 `oxlint` 导入命名的是 authoring API 中的绑定（例如 `defineRule`、`definePlugin` 或 `Context`）时，会将其重写为 `vite-plus/lint/plugins`。旧版 Oxlint 从主入口暴露该 API。现在它位于 `@oxlint/plugins` 中。

通过 Vite+ 导入始终匹配 Vite+ 捆绑的 Oxlint 版本。你无需再固定第二个包。该导入也能从任何已经依赖 `vite-plus` 的包中解析。

迁移会保留以下三种形式：

- 仅命名配置接口的 `oxlint` 导入，例如 `defineConfig`、`OxlintConfig` 或 `OxlintOverride`。这些导入仍会针对独立包解析。
- 默认和 namespace `oxlint` 导入。它们没有命名绑定，因此迁移无法区分这两个接口。
- 裸副作用 `oxlint` 导入，原因相同。

如果某个包在 `dependencies` 或 `peerDependencies` 中声明了 `oxlint` 或 `@oxlint/plugins`，或者在 `optionalDependencies` 中声明了 `@oxlint/plugins`，迁移也会跳过该包。这些依赖可以提供已发布的 Oxlint 插件，而使用它们的消费者可能不会运行 Vite+。

当源码、包导入别名或构建后的插件仍引用 `@oxlint/plugins` 时，清理过程会保留对 `@oxlint/plugins` 的开发依赖。这包括 `dist`、`build` 和 `out` 等目录中被忽略的输出。

### 永远不会重写的内容

- `declare module 'vitest'` 和 `declare module '@vitest/browser*'`：模块扩展必须保留上游模块身份。
- 保留下来的引用，例如 `compilerOptions.types`、`require.resolve`、`import.meta.resolve` 和 `vitest/package.json`，需要包本地的 Vitest（见[何时直接需要 Vitest](#when-vitest-is-directly-required)）。
- 在声明了 `@nuxt/test-utils` 的包中，所有 `vitest` 和 `vitest/*` 模块 specifier 都会在整个包范围内保留：Nuxt 转换需要上游身份，否则可能注入重复的 `vi` 导入。此例外不适用于同级包，也不适用于 scoped 的 `@vitest/browser*` 导入。

`prefer-vite-plus-imports` lint 规则遵循相同的 Nuxt 例外，因此 lint 自动修复也会保留这些导入。

## 包脚本重写规则

迁移会重写 `package.json` 脚本中由 Vite+ 工具链提供的命令，同时保留其参数：

| 之前          | 之后                                        |
| ------------- | ------------------------------------------- |
| `vite`        | `vp dev`，或对应的 `vp` 子命令             |
| `vitest`      | `vp test`                                   |
| `oxlint`      | `vp lint`                                   |
| `oxfmt`       | `vp fmt`                                    |
| `tsdown`      | `vp pack`                                   |
| `lint-staged` | `vp staged`                                 |
| `eslint`      | `vp lint`，当其可选迁移运行时               |
| `prettier`    | `vp fmt`，当其可选迁移运行时                |
| `tsup`        | `vp pack`，当其可选迁移运行时               |

对于通过 `bunx` 启动的命令，迁移会保留 `bunx` 及其 `--bun` 标志（保留用户选择的 runtime），只重写受管理的命令。当 `bunx` 位于 `run` 或 `--` 等命令启动器分隔符之后时，同样有效：

| 之前                                                    | 之后                                                     |
| ------------------------------------------------------- | -------------------------------------------------------- |
| `bunx --bun vite build`                                 | `bunx --bun vp build`                                    |
| `bunx --bun vitest run`                                 | `bunx --bun vp test run`                                 |
| `portless --tailscale run bunx --bun vite`              | `portless --tailscale run bunx --bun vp dev`             |
| `dotenv -e .env.test -- bunx --bun oxlint --type-aware` | `dotenv -e .env.test -- bunx --bun vp lint --type-aware` |

不相关的 `bunx` 命令以及其他包执行器形式保持不变。

## 持续集成规则

迁移会将 `.github` 下 GitHub Actions 工作流和复合操作中的精确 `voidzero-dev/setup-vp@v1` 引用替换为该 Vite+ 版本已知的最新精确 `setup-vp` 版本。冻结的 `v1` 标签不会接收新版本。已有的精确版本和 commit SHA 保持不变。

## Node.js 版本规则

迁移会将旧版 Node.js 版本管理器文件转换为 `.node-version`，这是 Vite+ 读取的格式。对于已有的 Vite+ 项目，此转换属于完整设置范围，因此会通过 `vp migrate --full` 运行；全新迁移则会无条件运行。

- `.nvmrc` 和 Volta 的 `volta.node` 固定会转换为 `.node-version`。已有的 `.node-version` 会被保留。
- 移除 `.nvmrc` 时，`.github/workflows/*.{yml,yaml}` 以及 `.github` 下复合操作（`.github/**/action.{yml,yaml}`）中的任何 `actions/setup-node` `node-version-file: .nvmrc` 引用都会改指向 `.node-version`，以免 CI 因“node version file ... does not exist”而失败。

## 包管理器规则

### pnpm

**根设置位置。** pnpm 10.6.2+ 使用 `pnpm-workspace.yaml` 作为受支持根设置的唯一来源。迁移会将已识别的 `package.json#pnpm` 字段移动到该文件中，包括 overrides、peer 规则、patch 设置、包扩展、架构和构建策略、审计/更新配置以及配置依赖。迁移会在 `pnpm` 对象为空时移除它，并保留可能属于其他工具的未知键。

- 当两个文件定义了相同的迁移设置时，会递归合并对象条目并保留不重复的数组条目。在冲突的标量叶节点上，`package.json#pnpm` 中的值优先，同时保留仅存在于工作区文件中的同级条目。
- 在 pnpm 10.6.2 之前，这些设置保留在 `package.json#pnpm` 中。（工作区设置支持是逐步加入的：一般设置从 10.5.0 开始，overrides 从 10.5.1 开始，`peerDependencyRules` 从 10.6.2 开始。pnpm 11 不再读取旧版 `package.json` 设置。）

**Catalogs。** Catalogs 是从 pnpm 9.5.0 开始支持的独立功能，与上述设置边界无关。即使在 10.6.2 以下的版本中，overrides 仍保留在 `package.json#pnpm`，迁移也会将工作区 catalog 从过时的 wrapper 别名中重写出来，并将 `catalog:` overrides 保留为引用，而不是内联为具体版本。

- 依赖引用、默认和命名 catalogs、overrides 以及 `peerDependencyRules` 会彼此保持一致。
- pnpm 接受顶层 `catalog` 或 `catalogs.default` 作为逻辑默认 catalog，但不能同时使用二者。迁移会保留现有形式，不会在其旁边创建另一种形式。
- 当已有的命名 catalog 已拥有 `vite-plus`、`vite` 或 `vitest` 时，迁移会复用该受管理的工具链 catalog，用于新添加的依赖和 overrides。只有在没有可复用的受管理或默认 catalog 时，才会创建顶层默认 catalog。

**其他规则。**

- 每个声明 `vite-plus` 的包也会获得直接的 `vite` dev 依赖（见 [Vite 和 Overrides](#vite-and-overrides)）。
- 不相关的选择器形式和对象值 overrides 会被保留。

### npm

- 在添加匹配的 override 之前，会先规范化直接别名，以免 npm 因 `EOVERRIDE` 失败。
- 当真实的 Vite 安装切换为 core 别名时，会先移除过时的 Vite 安装和锁文件状态，然后再重新安装。
- 当嵌套的 Vitest 包无法解析 `vite` 时，选择加入的浏览器提供程序布局会获得顶层的 `vite` 边。

### Yarn

- Vite+ 不支持 Plug'n'Play。迁移会检测显式和隐式 PnP，并将项目转换为 `nodeLinker: node-modules`，同时保留所有不相关的 `.yarnrc.yml` 设置。`--no-interactive` 会接受此转换；进程级别的 `YARN_NODE_LINKER=pnp` 必须由调用方修复。
- Catalog 引用和用户的 hoisting 设置会被保留。
- 为避免工作区 hoisting 隔离下出现多个 Vitest 副本，迁移会在可能时应用包级修复；当无法安全更改隔离时则发出警告。

### Bun

- Bun catalogs 仅能在工作区内解析（根 `package.json` 中包含非空的 `workspaces`）。在 bun 工作区中，现有的顶层或工作区 catalog 位置以及命名 catalog 引用都会被保留。独立的（单包）bun 项目会保留具体 spec，并且不会获得 catalog 字段，因为 `bun install` 无法在工作区之外解析 `catalog:`。
- core 别名会被镜像为直接的 `vite` 依赖，使 Bun 在应用 overrides 之前能够看到 peer provider。

## 迁移后

- 每个 Vite 配置都会检查是否存在与 Rolldown 不兼容的模式（例如 `manualChunks`）。发现的任何内容都会作为警告报告；配置不会被修改。
- 依赖会重新安装一次，以刷新锁文件。如果安装失败，迁移会报告错误并以非零状态退出。
- 成功迁移后，`vp fmt` 会运行于迁移过程中发生变更的文件上，但会排除 Git 工作区中原本就处于脏状态的路径。Oxfmt 会选择受支持的格式；非 Git 项目会保留全项目格式化。项目仍使用 Prettier 时会跳过格式化。格式化失败会作为警告报告，因此迁移结果和手动格式化命令仍然可用。
