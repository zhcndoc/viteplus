# 迁移规则

本文档准确描述了 `vp migrate` 对项目所做的操作：它如何更新依赖项、重写源代码导入和 package 脚本，以及调整包管理器配置。有关命令概览和工作流程，请参阅 [迁移指南](./migrate.md)。

除 [迁移前](#before-you-migrate) 外，该部分列出了需要你自己执行的步骤，下面的所有内容都描述自动化行为。

## 迁移前

1. 运行 `vp upgrade`，以便全局 CLI 拥有最新的迁移规则。过时的本地 `vite-plus` 不会成为阻碍：当项目的本地副本更旧时，迁移会委托给全局 CLI。
2. 在必要时，将项目升级到 Vite 8+ 和 Vitest 4.1+。
3. 从工作区根目录运行 `vp migrate`。在自动化环境中使用 `--no-interactive`。
4. 检查每个已更改的清单文件、包管理器配置、源代码重写，以及生成的锁定文件。
5. 使用 `vp install`、`vp check`、`vp test` 和 `vp build` 进行验证。

迁移是幂等的：在成功迁移后再次运行它，不应产生另一份 diff。

## 升级 vs. 完整设置

对于一个已经依赖 `vite-plus` 的项目，`vp migrate` 只执行升级：它会更新依赖和包管理器配置，并完成导入的收尾工作。它不会触及项目设置。

- `--full` 还会执行设置相关操作：git hooks、编辑器配置、agent 文件、ESLint 和 Prettier 迁移、框架 shim、tsconfig 的 `baseUrl` 修复，以及将 `.nvmrc`/Volta 转换为 `.node-version`。
- `--hooks`、`--agent` 和 `--editor` 可在不使用 `--full` 的情况下启用单个设置操作。

当默认升级跳过了本应适用的设置操作时，它会提示运行 `vp migrate --full`。新的（非 Vite+）项目始终会执行完整迁移。

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

- `vite-plus` 会固定为执行迁移的 CLI 所运行的具体版本，绝不会是 `latest` dist-tag。
- `vite` 别名指向同一 Vite+ 发布中的 `@voidzero-dev/vite-plus-core`。
- 支持目录的 manifest 可能包含 `catalog:` 或命名的目录引用。迁移会保留该引用，并将被引用的目录值更新为具体的工具链目标。
- 有意的协议固定会被保留：`workspace:`、`file:`、`link:`、`npm:`、`github:`、Git URL 和 HTTP URL。
- 迁移会协调每个工作区包，而不仅仅是根 manifest。共享的 overrides 和目录保留在工作区根；提供 peer 的依赖应放在需要它们的每个包中。

### Vite 和 Overrides

包管理器的 overrides 本身不会创建依赖边。在 pnpm 下，任何在 `dependencies` 或 `devDependencies` 中列出 `vite-plus`、但在任何位置都没有 `vite` 条目（`dependencies`、`devDependencies`、`optionalDependencies` 或 `peerDependencies`）的包，都会让 pnpm 自动安装上游 Vite，以满足 Vitest 所需的 `vite` peer，从而把项目拆分成独立的 Vite+、Vite 和 Vitest 实例。为防止这种情况，`vp migrate` 会把缺失的 `vite` 条目添加到所有此类包的 `devDependencies` 中；随后工作区 override 会将其重定向到 Vite+ core。

相关规则：

- 直接的 `vite` 声明绝不会仅仅因为存在根 override 而被移除。
- 普通别名或过时别名会被规范化；命名的目录引用会被保留。
- 在 pnpm 下，受管理的 override 键使用显式的 `@*` 范围（`vite@*`、`vitest@*`）。pnpm 会通过替换每个 manifest（包括导入方 manifest）中声明的 spec 来应用 override。裸键会匹配任何 spec，包括 `catalog:`，而 `vp up` 随后会将该引用重写为具体版本。`@*` 范围会将 override 保持在传递依赖和 peer 声明所使用的 semver 范围上。它会将 `catalog:` 引用保留为目录引用，而该目录已经会将其解析到 Vite+ core。对于仍保留裸键的项目，迁移会重新设置键，并保留其命名目录选择。
- 上述直接条目规则仅适用于 pnpm。Bun 会将其 core 别名镜像为直接依赖，以供其 peer resolver 使用；而 npm 的 browser-provider 布局可能需要顶层 `vite` 依赖边，以便嵌套的 Vitest 包能够解析 `vite`。

### 何时直接需要 Vitest

当满足以下任一条件时，迁移会在包本地保留或添加精确的捆绑版本 `vitest`：

- 已安装的依赖具有非可选的 `vitest` peer，无论是精确版本还是范围；
- 该包使用 Vitest browser 模式或可选启用的 browser provider；
- 源码或 TypeScript 配置保留了上游 `vitest` 引用；
- 该包声明了 `@nuxt/test-utils`；或者
- 无法获取依赖元数据，而现有的直接 `vitest` 可能正在满足某个未知的必需 peer。

检测会读取已安装的 peer 元数据，因此像 `vite-plugin-gherkin` 这样的集成也会被处理，即使它们的名称中不包含 `vitest`。

当某个包符合条件时，迁移会：

- 将 `vitest` 添加到该包中，而不是不加区分地添加到每个工作区包；
- 在支持时使用现有的目录引用，否则使用精确的捆绑版本；并且
- 保留匹配的工作区 override 或 resolution，以便依赖图解析为单一 Vitest 版本。

仅有 peer 声明并不会安装 Vitest。如果一个保留下来的 `peerDependencies.vitest` 使用了迁移将要移除的目录条目，它会先被解析为公开的 peer 范围。

### Vitest 生态包

官方当前的 `@vitest/*` 包通常与 Vitest 同步发布。迁移会对项目直接安装的包进行对齐，包括 `@vitest/coverage-v8`、`@vitest/coverage-istanbul`、`@vitest/ui` 和 `@vitest/web-worker`：

- 当包管理器支持目录时，它们会通过工具链目录引用：保留现有的 `catalog:` / `catalog:<name>` 引用，为任何缺少引用的包添加目录条目，并将每个条目更新为捆绑的 Vitest 版本；
- 当不支持目录时（npm、独立的 bun 项目，或目录功能出现之前的 pnpm/Yarn），则改为写入具体的捆绑版本。

**不会**对齐的包：

- `@vitest/eslint-plugin` 遵循其自己的版本线；
- `@vitest/coverage-c8` 已停止在较早版本，且没有 Vitest 4 版本；并且
- 第三方 `vitest-*` 集成会保留它们自己兼容的版本，不过它们所需的 Vitest peer 仍可能触发[直接提供](#when-vitest-is-directly-required)。

对于 browser 模式，基础的 `@vitest/browser` 运行时和 `@vitest/browser-preview` 由 Vite+ 内置，并会作为直接依赖移除。Playwright 和 WebdriverIO provider 保持可选：保留或注入的 provider 会通过首选工具链目录引用到捆绑的 Vitest 版本（若不支持目录，则写入具体版本），并且会一并安装其 `playwright` 或 `webdriverio` peer。

在重写导入之前会先检测 provider。这覆盖了旧项目中将 `vitest` 别名为 `@voidzero-dev/vite-plus-test`，并从 `vitest/browser-<provider>`、`vitest/browser/providers/<provider>` 或 `vitest/plugins/browser-<provider>` 导入的情况：这些导入仍会安装相应的 `@vitest/browser-playwright` 或 `@vitest/browser-webdriverio` 依赖及其框架 peer。

对象值的嵌套 npm 和 Bun overrides 会被保留：它们是用户定义的作用域，而不是标量版本固定值。

## 源码重写规则

### `vite` 导入

`vite` 和 `vite/*` 导入仅在配置入口文件中重写为 `vite-plus`：`vite.config.*`、`vitest.config.*`，以及迁移过程中解析到的任何配置文件。其他所有文件都保留其 `vite` 导入，原因有两个：

- `vite-plus` 并不是 Vite 对外暴露表面的完整超集。它只拥有 `defineConfig`、`defineProject` 和 `lazyPlugins`，因此像 `createBuilder` 或 `loadConfigFromFile` 这样的透传符号（包括 `typeof import('vite')` 这类类型位置）如果被重写，可能会导致问题。
- 未重写的 `vite` 导入在 Vite+ 项目中仍会通过 `@voidzero-dev/vite-plus-core` 别名正常解析。

插件包（即以 `vite-plugin-` 或 `unplugin-` 开头的未加作用域名称，或者在 `peerDependencies`/`dependencies` 中包含 `vite`）即使在配置文件中也会跳过重写。此规则的适用范围仅限于 `vite` 这个 specifier。

`declare module 'vite'` 的增强遵循同样的规则，并且在配置文件之外会被保留。通过 core 别名，它们会指向同一个 `@voidzero-dev/vite-plus-core` 模块，而该模块的 `UserConfig` 类型由 `vite-plus` 中的 `defineConfig` 提供，因此迁移后仍可正常工作；`vite-plus` 本身并不导出 `UserConfig` 符号，所以重写后的 `declare module 'vite-plus'` 增强将无法合并到任何对象上。面向 `vite-plus` 自身表面的扩展则需要手动按 `vite-plus` 来编写。

### `vitest` 和浏览器导入

- 普通的 `vitest` 和 `vitest/*` 导入会被重写为 `vite-plus/test*`。
- 旧版 Playwright 和 WebdriverIO provider 导入会在此重写之前被检测出来，从而不会丢失它们可选的 provider 依赖。
- 作用域化的 `@vitest/browser*` 导入会被重写为对应的 `vite-plus/test/browser*` 导出，并在需要时提供可选的 provider。
- 现有的 `vite-plus/test*` 导入会保持不变。

### 永远不会被重写的内容

- `declare module 'vitest'` 和 `declare module '@vitest/browser*'`：模块增强必须保留上游模块身份。
- 仍然保留在原位置的引用，例如 `compilerOptions.types`、`require.resolve`、`import.meta.resolve` 和 `vitest/package.json`，需要包内本地的 Vitest（参见[当 Vitest 被直接引用时](#when-vitest-is-directly-required)）。
- 在声明了 `@nuxt/test-utils` 的包中，所有 `vitest` 和 `vitest/*` 模块 specifier 都会在整个包范围内被保留：Nuxt 转换需要上游身份，否则可能会额外注入一个 `vi` 导入。此例外不适用于兄弟包，也不适用于作用域化的 `@vitest/browser*` 导入。

`prefer-vite-plus-imports` lint 规则遵循相同的 Nuxt 例外，因此 lint 自动修复也会保留这些导入。

## 包脚本重写规则

迁移会重写 `package.json` 中由 Vite+ 工具链提供的命令脚本，同时保留它们的参数：

| 之前          | 之后                                        |
| ------------- | ------------------------------------------- |
| `vite`        | `vp dev`，或对应的 `vp` 子命令             |
| `vitest`      | `vp test`                                   |
| `oxlint`      | `vp lint`                                    |
| `oxfmt`       | `vp fmt`                                     |
| `tsdown`      | `vp pack`                                    |
| `lint-staged` | `vp staged`                                  |
| `eslint`      | `vp lint`，当其可选迁移运行时               |
| `prettier`    | `vp fmt`，当其可选迁移运行时                 |

对于通过 `bunx` 启动的命令，迁移会保留 `bunx` 及其 `--bun` 标志（保持用户选择的运行时），并且只重写受管理的命令。这在 `bunx` 跟在命令启动分隔符之后时也适用，例如 `run` 或 `--`：

| 之前                                                    | 之后                                                     |
| ------------------------------------------------------- | -------------------------------------------------------- |
| `bunx --bun vite build`                                 | `bunx --bun vp build`                                    |
| `bunx --bun vitest run`                                 | `bunx --bun vp test run`                                 |
| `portless --tailscale run bunx --bun vite`              | `portless --tailscale run bunx --bun vp dev`             |
| `dotenv -e .env.test -- bunx --bun oxlint --type-aware` | `dotenv -e .env.test -- bunx --bun vp lint --type-aware` |

无关的 `bunx` 命令以及其他包执行器形式保持不变。

## Node.js 版本规则

迁移会将旧版 Node.js 版本管理器文件转换为 `.node-version`，这是 Vite+ 读取的格式。在现有的 Vite+ 项目中，这种转换是完整设置包的一部分，因此会在执行 `vp migrate --full` 时运行；全新迁移则会无条件运行它。

- `.nvmrc` 和 Volta 的 `volta.node` 固定版本会被转换为 `.node-version`。现有的 `.node-version` 会被保留。
- 当 `.nvmrc` 被移除时，`.github/workflows/*.{yml,yaml}` 和复合操作（`.github/actions/**/action.{yml,yaml}`）中任何 `actions/setup-node` 的 `node-version-file: .nvmrc` 引用都会重定向到 `.node-version`，这样 CI 就不会因为 "node version file ... does not exist" 而失败。

## 包管理器规则

### pnpm

**根设置位置。** pnpm 10.6.2+ 使用 `pnpm-workspace.yaml` 作为受支持根设置的唯一来源。迁移会将识别到的 `package.json#pnpm` 字段移动到那里，包括 overrides、peer 规则、patch 设置、package 扩展、架构和构建策略、审计/更新配置以及配置依赖项。当 `pnpm` 对象变为空时会将其移除，并保留可能属于其他工具链的未知键。

- 当两个文件定义了相同的已迁移设置时，对象条目会递归合并，数组中的唯一条目会被保留。冲突的标量叶子节点以 `package.json#pnpm` 中的值为准，而仅存在于 workspace 的同级条目会被保留。
- 在 pnpm 10.6.2 之前，这些设置保留在 `package.json#pnpm` 中。（Workspace 设置支持是逐步加入的：10.5.0 提供通用支持，10.5.1 支持 overrides，10.6.2 支持 `peerDependencyRules`。pnpm 11 不再读取旧的 `package.json` 设置。）

**Catalogs。** Catalogs 是一个独立功能，自 pnpm 9.5.0 起受支持，且不受上述设置边界影响。即使在 10.6.2 之前、overrides 仍保留在 `package.json#pnpm` 中时，迁移仍会将 workspace catalog 从过时的包装器别名中重写出来，并将 `catalog:` overrides 保持为引用，而不是内联为具体版本。

- 依赖引用、默认和命名 catalog、overrides 以及 `peerDependencyRules` 彼此保持一致。
- pnpm 接受逻辑上的默认 catalog 既可以是顶层 `catalog`，也可以是 `catalogs.default`，但不能同时存在。迁移会保留现有形式，并且绝不会在其旁边创建另一种形式。
- 当现有命名 catalog 已经拥有 `vite-plus`、`vite` 或 `vitest` 时，迁移会复用该已管理的工具链 catalog，为新添加的依赖和 overrides 提供支持。只有在没有可复用的已管理或默认 catalog 时，才会创建顶层默认 catalog。

**其他规则。**

- 每个声明了 `vite-plus` 的包也会获得一个直接的 `vite` 开发依赖（见 [Vite 和 Overrides](#vite-and-overrides)）。
- 不相关的、选择器形状和对象值类型的 overrides 会被保留。

### npm

- 在添加匹配的 override 之前，会先规范化直接别名，因此 npm 不会因 `EOVERRIDE` 而失败。
- 当真实的 Vite 安装切换为核心别名时，会先移除过时的 Vite 安装和 lockfile 状态，然后再重新安装。
- 对浏览器提供者布局的可选启用会在顶层添加一条 `vite` 依赖边，否则嵌套的 Vitest 包将无法解析它。

### Yarn

- Vite+ 不支持 Plug'n'Play。迁移会检测显式和隐式的 PnP，并将项目转换为 `nodeLinker: node-modules`，同时保留所有无关的 `.yarnrc.yml` 设置。`--no-interactive` 会接受该转换；如果是进程级别的 `YARN_NODE_LINKER=pnp`，则必须由调用方修复。
- Catalog 引用和用户的 hoisting 设置会被保留。
- 迁移会避免在 workspace hoisting 隔离下产生分裂的 Vitest 副本：在可能的情况下会应用包级修复，而当无法安全更改隔离时会发出警告。

### Bun

- Bun catalogs 只能在 workspace 内部解析（即根 `package.json` 具有非空 `workspaces`）。在 bun workspace 中，现有的顶层或 workspace catalog 位置以及命名 catalog 引用都会被保留。独立（单包）的 bun 项目会保留具体规格，并且不会获得 catalog 字段，因为 `bun install` 无法在 workspace 外解析 `catalog:`。
- 核心别名会镜像为直接的 `vite` 依赖，这样 Bun 在应用 overrides 之前就能看到 peer 提供者。

## 迁移后

- 会检查每个 Vite 配置中是否存在与 Rolldown 不兼容的模式（例如 `manualChunks`）。发现的任何问题都会作为警告报告；配置不会被更改。
- 依赖项会重新安装一次以刷新 lockfile。如果安装失败，迁移会报告错误并以非零状态退出。
- 在迁移成功后，`vp fmt` 会在迁移期间更改的文件上运行，排除那些在 Git 工作区中原本就已处于脏状态的路径。Oxfmt 会选择受支持的格式；非 Git 项目会保留全项目格式化。在项目仍使用 Prettier 时会跳过格式化。格式化失败会作为警告报告，因此迁移结果和手动格式化命令仍然可用。
