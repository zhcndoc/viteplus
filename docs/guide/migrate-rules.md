# 迁移规则

This reference describes exactly what `vp migrate` does to a project: how it updates dependencies, rewrites source imports and package scripts, and adjusts package-manager configuration. See the [migration guide](./migrate.md) for the command overview and workflow.

Except for [Before You Migrate](#before-you-migrate), which lists steps you take yourself, everything below describes automatic behavior.

## 迁移前 {#before-you-migrate}

1. 运行 `vp upgrade`，以便全局 CLI 使用最新的迁移规则。过时的本地 `vite-plus` 并不会阻止迁移：当项目的本地副本版本较旧时，迁移会委托给全局 CLI。
2. 在必要时将项目升级到 Vite 7+ 和 Vitest 4+。
3. 从工作区根目录运行 `vp migrate`。在自动化环境中使用 `--no-interactive`。
4. 检查每个发生变更的清单、包管理器配置、源码重写结果和生成的锁文件。
5. 使用 `vp install`、`vp check`、`vp test` 和 `vp build` 进行验证。

迁移具有幂等性：成功迁移后再次运行，不应产生新的差异。

## 升级 vs. 完整设置

对于已经依赖 `vite-plus` 的项目，`vp migrate` 只执行升级：它会更新依赖和包管理器配置，并完成导入。它不会修改项目设置。

- `--full` 还会运行设置操作：Git hooks、编辑器配置、代理文件、ESLint、Prettier、tsup 和 tsx 迁移、框架 shim、tsconfig 的 `baseUrl` 修复，以及将 Volta 固定版本转换为 `.node-version`。
- `--hooks`、`--agent` 和 `--editor` 可在不使用 `--full` 的情况下选择单个设置操作。

## Oxlint JSON 继承

当 `.oxlintrc.json` 或 `.oxlintrc.jsonc` 使用 `extends` 时，`vp migrate` 会根据声明该路径的配置文件解析相对路径。它会创建共享 TypeScript 配置，并通过 `lint.extends` 引入，包括嵌套继承。Oxlint 会遵循现有的合并顺序、规则严重级别和 overrides。迁移后，普通的 `vp lint` 无需 `-c` 标志即可使用这些规则。

迁移假设项目使用 ESM。共享配置会转换为同级 `.ts` 文件。JavaScript 和 TypeScript 配置中的导入会使用 `.js` specifier；Vite 和 TypeScript 会将它们解析到生成的源文件，无需更改编译器设置。文件级 TypeScript pragma 会保留在生成的导入之前。工作区使用者（包括拥有共享配置的工作区）会复用相同的生成模块。迁移默认值会保留在每个工作区自己的 `lint` 配置块中。修改这些 TypeScript 文件即可更新共享设置。原有共享 JSON 和 JSONC 文件会保留，供其他使用者使用；修改原文件不会更新迁移后的配置。

JS 插件声明会留在原有配置或 override 中。相对插件路径会在运行时通过 `fileURLToPath(new URL(..., import.meta.url))` 转为绝对路径。显式继承的 `typeAware` 和 `typeCheck` 设置优先于迁移默认值。

清理时会分别移除每个已完成的工作区符号链接。仍保留在磁盘上的共享别名会继续保留其目标和依赖。

共享配置的所有者会通过对共享模块的引用，将 `env`、`globals`、`settings` 和 `ignorePatterns` 保留在 `lint` 配置块顶层。修改这些字段会作用于所有者；其他使用者不会继承这些字段。

生成模块包含源标记。之后再次迁移时会复用这些模块而不覆盖用户修改，因此冲突解决后，保留该配置的使用者仍可迁移。没有匹配源标记的现有模块会被视为冲突。

合并失败或遇到已有 `lint` 配置块时，迁移会在 Vite 配置中记录待处理标记，以便冲突解决后重试单独失败的操作。合并成功后会移除此标记。已完成的工作区合并（包括内联配置）会记录完成标记。修复无法读取的配置后，再运行 `vp migrate` 迁移剩余使用者，并移除不再需要的 JSON 文件。

共享配置导入使用字面路径，因此 Vite 和 TypeScript 可以解析包含 `#` 或 `%` 的文件名。包含 `?` 或实际反斜杠的相对导入路径需要手动迁移：Vite 会将 `?` 视为 query 分隔符，TypeScript 会将反斜杠视为路径分隔符。遇到这些情况时，迁移会保留 JSON 配置并发出警告。

缺失文件、无效 JSON、继承循环、输出文件冲突，以及解析结果与 Vite 配置目录不同的包级插件都会产生警告，并保留原配置。项目或工作区之外的配置、`node_modules` 中的配置、CommonJS Vite 配置，以及已有的 `lint` 配置块都需要手动合并。工作区 JSON 的删除会等到所有迁移结果确定后才执行。保留 JSON 使用者的传递依赖会继续保留，包括所有者已成功迁移的配置。如果无法读取继承关系图，工作区 JSON 文件会保留，其所有者会使用共享模块，因为无法读取的使用者可能引用这些配置。`vp lint` 仍会拒绝 `lint.extends` 中的字符串路径；只有迁移时才会解析路径。

## Pack 配置 {#pack-configuration}

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

迁移会在最终安装依赖之前检查项目已安装的 tsdown 版本。对于 Vite+ pack 配置，它会读取已安装的 `vite-plus/dist/toolchain.json`。这也包括在迁移重写导入之前已经导入 `vite-plus/pack` 的 `tsdown.config.*` 文件。独立的 tsdown 配置使用其已安装的 tsdown 版本。没有此清单的旧版 Vite+ 会保留旧的默认值。对于 tsdown 0.23 或更高版本，迁移不会插入兼容性默认值；对于较旧或未知版本，如果缺少 `deps.resolveDepSubpath`，则会将其设置为 `true` 以保留之前的默认行为。启用 ATTW 检查且未设置 profile 时，会使用 `profile: 'strict'`。显式值（包括 `false`）保持不变。

插入的设置会附带文档链接和采用新默认值的说明。移除 `deps.resolveDepSubpath: true` 可[按原样保留外部子路径导入](https://tsdown.dev/options/dependencies#deps-resolvedepsubpath)。移除插入的 `attw.profile: 'strict'` 可使用新的 `esm-only` [解析配置](https://tsdown.dev/options/lint#profiles)，但这会跳过 `node10` 和 CommonJS 解析检查。如果软件包需要保留之前的行为，请保留相应设置。对于显式设置，迁移不会添加这些注释。

转换过程不会执行配置代码。包含展开属性、计算键或重复键的对象，以及冲突的新旧选项，都需要手动检查。动态布尔选择器保持不变。不相关的 Vite 和插件选项保持不变。迁移后运行 `vp pack` 检查结果。Node.js 要求、TypeScript 模块解析和程序化 `build()` 返回值需要单独检查。

## 任务缓存配置

`vp migrate` 会将每个任务顶层的 `env`、`untrackedEnv`、`input` 和 `output` 移入任务的 [`cache`](/config/run#cache) 对象。它会更新 `vite.config.*` 中静态的 `run.tasks` 对象。现有 Vite+ 项目（包括工作区包）即使不使用 `--full` 也会执行此迁移。

| 之前的任务配置 | 更新后的任务配置 |
| -------------- | ---------------- |
| 没有 `cache`   | 添加 `cache` 并移入这些设置 |
| `cache: true`  | 将 `true` 替换为移入的设置 |
| `cache: { ... }` | 将移入的设置添加到现有对象 |

```ts
// Before
build: {
  command: 'vp build',
  env: ['NODE_ENV'],
  input: [{ auto: true }, '!dist/**'],
},

// After
build: {
  command: 'vp build',
  cache: {
    env: ['NODE_ENV'],
    input: [{ auto: true }, '!dist/**'],
  },
},
```

移入的设置会保留原有文本和缩进，[迁移后的格式化步骤](#after-the-migration)会将它们缩进到 `cache` 中。位于设置前独立一行的注释，以及同一行设置后面的 `//` 注释，都会随设置一起移动。

此转换不会执行配置代码。如果任务存在以下情况，迁移会保持任务不变并给出手动迁移警告：

- 存在展开属性、计算键、转义键或重复键；
- 被移入的设置写成方法，例如 `input() { ... }`；
- 被移入设置与其逗号之间有注释，或 `cache` 中最后一个设置之后有注释；
- `cache` 中已存在一个被移入的设置；
- `cache` 的值不是 `true` 或对象字面量。

如果任务位于 `vite.config.*` 中的对象内，但该对象本身不是导出的配置（例如配置引用的变量，或传给 `mergeConfig` 的对象），迁移也会发出警告。其他模块中创建的任务（例如共享辅助函数创建的任务）不会被检测到。请手动移入这些设置；`vp run` 会列出仍需处理的任务。

当 `cache: false` 时，移入的设置不会生效，因此请决定移除它们还是启用缓存。对于其他方面均已更新的项目，`vp migrate` 会打印这些警告，但不会继续执行迁移的其余部分。

## 依赖规则

### 版本选择

迁移会保留项目的软件包管理器声明策略。现有的 `packageManager` 或 `devEngines.packageManager` 字段仍是事实来源，而仅依赖锁文件的项目仍保持未固定状态。具体来说，迁移不会将其自身安装时使用的软件包管理器版本转变为贡献者或 CI 所需的新精确版本。迁移推断出未声明的软件包管理器时，会打印警告；希望显式固定版本的项目可以使用 `vp env pin`。

下面概述各工具链依赖项的处理方式：

| 依赖                           | 处理方式                                                                                                                                                           |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `vite-plus`                    | 在迁移的包中添加；普通范围会重新固定为明确的目标版本，可直接指定或通过 catalog 指定。                                                                                |
| `vite`                         | 保留现有声明并指向 core 别名。仅使用 `vite-plus` 的 pnpm 包不需要新增 `vite` 条目（见 [Vite 和 Overrides](#vite-and-overrides)）。                                  |
| `vitest`                       | 常见的 node 模式下会移除，因为 `vite-plus` 会间接提供它。仅在[直接需要时](#when-vitest-is-directly-required)保留或添加。                                             |
| `@vitest/*`                    | 直接安装的锁步包会与捆绑的 Vitest 版本对齐（见 [Vitest 生态包](#vitest-ecosystem-packages)）。                                                                       |
| `@voidzero-dev/vite-plus-test` | 在所有位置移除，包括 dependencies、overrides、resolutions 和 catalog 别名。导入会重写为当前的 `vite-plus/test*` 接口。                                               |

- `vite-plus` 固定为执行迁移的 CLI 的具体版本，绝不会使用 `latest` dist-tag。
- `vite` 别名指向同一 Vite+ 版本中的 `@voidzero-dev/vite-plus-core`。
- 基于 catalog 的清单可能包含 `catalog:` 或命名 catalog 引用。迁移会保留该引用，并将所引用的 catalog 值更新为具体的工具链目标版本。
- 有意指定的协议固定会被保留：`workspace:`、`file:`、`link:`、`npm:`、`github:`、Git URL 和 HTTP URL。
- 迁移会协调每个工作区包，而不只是根清单。共享的 overrides 和 catalogs 保留在工作区根目录；提供 peer 的依赖属于每个需要它的包。

### Vite 和 Overrides

在 pnpm 包中使用 `vite-plus` 无需声明 `vite`。`vite-plus` 包含一个别名指向其 core 的 `vite` 依赖，可满足 Vitest 所需的 peer。迁移会为其他 Vite 使用方保留工作区 override，但不会仅仅因为某个包使用了 `vite-plus` 就添加 `vite`。

- 仅仅因为存在根 override，直接的 `vite` 声明也不会被移除。
- 普通别名或过时别名会被规范化；命名 catalog 引用会被保留。
- 在 pnpm 下，受管理的 override 键会使用显式的 `@*` 范围（`vite@*`、`vitest@*`）。pnpm 会通过替换每个清单（包括 importer 清单）中声明的 spec 来应用 override。裸键会匹配任意 spec，包括 `catalog:`，随后 `vp up` 会将该引用重写为具体版本。`@*` 范围会使 override 作用于传递依赖和 peer 声明使用的 semver 范围，同时将 `catalog:` 引用留给 catalog，因为 catalog 已经会将它们解析为 Vite+ core。对于仍使用裸键的项目，迁移会重新设置其键，并保留其命名 catalog 选择。
- Bun 会将其 core 别名镜像为直接依赖，以供 peer resolver 使用；npm 的浏览器提供程序布局可能需要顶层 `vite` 依赖边，以便嵌套的 Vitest 包解析 `vite`。

### 何时直接需要 Vitest {#when-vitest-is-directly-required}

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

浏览器模式下，Vite+ 会捆绑基础 `@vitest/browser` runtime 和 `@vitest/browser-preview`；迁移会移除它们的直接依赖。Playwright 提供程序仍需选择加入。迁移会通过首选的工具链 catalog 或依赖条目，为 `@vitest/browser-playwright` 使用捆绑的 Vitest 版本，并同时安装其 `playwright` peer。

迁移会在重写导入之前检测 Playwright 的使用情况，包括旧版 `vitest/browser-playwright`、`vitest/browser/providers/playwright` 和 `vitest/plugins/browser-playwright` 别名。

`vp migrate` 会将已移除的 Vite+ WebdriverIO 别名恢复为 `@vitest/browser-webdriverio`；如果缺少该提供程序，则添加 `^5.0.0`。它会升级较旧版本、收窄允许低于 `5.0.0` 的范围、更新引用的 catalog 条目，并移除强制使用较旧提供程序的 override。符合最低版本要求的版本和范围会保持不变。迁移会确保存在必需的 `webdriverio` peer，并添加与捆绑 Vitest 相匹配的 `@vitest/browser` override（Yarn 使用 `resolutions`）。之后的社区提供程序升级由你自行管理。请参阅[社区 WebDriverIO 提供程序](./vitest-v5.md#community-webdriverio-provider)。

## 源码重写规则

### `vite` 导入

`vite` 和 `vite/*` 导入仅在配置入口文件中重写为 `vite-plus`：`vite.config.*`、`vitest.config.*` 以及迁移解析出的任何配置文件。其他所有文件都会保留其 `vite` 导入，原因有二：

- `vite-plus` 并不保证是 Vite 暴露接口的超集。它只拥有 `defineConfig`、`defineProject`、`lazyPlugins` 和 `resolveConfigFromFile`，因此重写诸如 `createBuilder` 或 `loadConfigFromFile` 这样的透传符号（包括 `typeof import('vite')` 类型位置中的符号）可能导致破坏。
- 未重写的 `vite` 导入仍会通过 Vite+ 项目中的 `@voidzero-dev/vite-plus-core` 别名解析。

`vite/rolldown` 和 `vite/rolldown/*` 永远不会被重写，因为 `vite-plus` 不导出这些子路径；它们会继续通过 core 别名解析。

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
| `tsx`         | `vpx`，当其可选迁移运行时                   |
| `oxnode`      | `vpx`，当其可选迁移运行时                   |
| `ts-node`     | `vpx`，适用于受支持的 transpile-only 命令   |

对于通过 `bunx` 启动的命令，迁移会保留 `bunx` 及其 `--bun` 标志（保留用户选择的 runtime），只重写受管理的命令。tsx 是例外：`bunx tsx` 会变为 `vpx`，而 `bunx --bun tsx` 会保留 tsx（参见 [tsx 到 `vpx`](#tsx-to-vpx)）。当 `bunx` 位于 `run` 或 `--` 等命令启动器分隔符之后时，同样有效：

| 之前                                                    | 之后                                                     |
| ------------------------------------------------------- | -------------------------------------------------------- |
| `bunx --bun vite build`                                 | `bunx --bun vp build`                                    |
| `bunx --bun vitest run`                                 | `bunx --bun vp test run`                                 |
| `portless --tailscale run bunx --bun vite`              | `portless --tailscale run bunx --bun vp dev`             |
| `dotenv -e .env.test -- bunx --bun oxlint --type-aware` | `dotenv -e .env.test -- bunx --bun vp lint --type-aware` |

不相关的 `bunx` 命令以及其他包执行器形式保持不变。

### tsx 到 `vpx` {#tsx-to-vpx}

当 `package.json` 脚本、lint-staged 任务或 `#!/usr/bin/env tsx` shebang 运行 [tsx](https://tsx.is) 时，迁移会提供将其替换为 Vite+ TypeScript 脚本运行器 [`vpx`](/guide/vpx) 的选项。它会改写 `package.json` 中的脚本和 lint-staged 任务、JSON lint-staged 文件中的任务，以及脚本文件中的 `#!/usr/bin/env tsx` shebang：

| 之前                                                                      | 之后                                               |
| ------------------------------------------------------------------------- | -------------------------------------------------- |
| `tsx src/seed.ts --rows 10`                                               | `vpx src/seed.ts --rows 10`                        |
| `tsx watch --include "*.json" src/a.ts`                                   | `vpx --watch --include "*.json" src/a.ts`          |
| `npx tsx a.ts`、`pnpm exec tsx a.ts`、`pnpm dlx tsx a.ts`、`bunx tsx a.ts` | `vpx a.ts`                                         |
| `node --import tsx ./a.ts`                                                | `node --import vite-plus/register ./a.ts`          |
| `node --import=tsx --test`                                                | `node --import=vite-plus/register --test`          |
| `NODE_OPTIONS='--import tsx' mocha`                                       | `NODE_OPTIONS='--import vite-plus/register' mocha` |
| `cross-env NODE_ENV=dev tsx a.ts`                                         | `cross-env NODE_ENV=dev vpx a.ts`                  |
| `concurrently "tsx watch a.ts" "vp dev"`                                  | `concurrently "vpx --watch a.ts" "vp dev"`         |

`tsx watch` 会变成 `vpx --watch`，而不是 `vpx watch`（后者会运行名为 `watch` 的 npm 包）。Node.js 和 tsx watch 选项会保留原有顺序，`--no-cache` 会移除。只有会运行带引号命令的程序（例如 `concurrently`、`nodemon --exec`、`sh -c` 和 `cross-env-shell`）中的引号命令才会被改写；其他程序的引号参数（例如 `echo "tsx a.ts"`）会视为数据。`vpx` 需要与 Vite+ 相同的 Node.js 版本，迁移会先升级不兼容的运行时固定版本（参见 [Vitest 5](/guide/vitest-v5)）。

普通的 `node --import tsx` 和 `node --import=tsx` 形式会保留 Node.js、其选项、包装命令和参数。迁移会将它们替换为 [`vite-plus/register`](/guide/vpx#using-nodejs-directly)，因此 Node.js 仍负责 eval、测试发现和原生监视模式。字面量 `NODE_OPTIONS` 赋值也会迁移，包括通过 `cross-env` 和已知命令启动器设置的赋值。`vite-plus/register` 接受 `TSX_TSCONFIG_PATH` 作为备用配置。如果赋值还加载旧版 tsx hook，或命令仍需要 tsx，则保持不变。

对于 tsx 可执行文件及 `--loader tsx/esm`、`-r tsx/cjs` 等旧版 loader 形式，迁移沿用现有的 `vpx` 规则。若命令使用 `--eval`、`--print` 或 `--check`、REPL、没有文件或处于监视模式的 `--test`、没有扩展名的入口，或通过 `NODE_OPTIONS` 加载 tsx，迁移会保留 tsx 并发出警告。包含管道、变量或子 shell 的命令也会保留。`vpx` 同样接受 `TSX_TSCONFIG_PATH` 作为备用配置；显式的 `--tsconfig` 优先。

两种迁移路径都会读取命令指向的脚本，包括本地 `--require` 和 `--import` 模块。若脚本尚不存在（例如由前置命令生成），或 Vite+ loader 无法运行该脚本，迁移会保留 tsx：例如，tsx 可将 `require('./a.js')` 解析为 `a.ts`，但 `vpx` 不会；`.cts` 文件含有 `import` 或 `export`；或者没有 `"type": "module"` 的包中，文件混用了 `import` 与 `__dirname`、`__filename`、`require()` 或 `module.exports`。检查会跳过 glob 和 `cd` 或其他 shell 状态变更之后的脚本，并且只读取命令指定的文件，不会跟踪它们导入的模块。该检查不会检测其他编译差异，例如标准装饰器、`require()` 中的 tsconfig `paths`，或 `node16`/`nodenext` 模块配置；脚本运行时 loader 会报告这些问题。如果包在 `dependencies`、`optionalDependencies` 或 `peerDependencies` 中声明了 tsx，也会保留该依赖，因为替换项来自 `vite-plus` devDependency。

只有在没有其他地方使用 tsx 时，迁移才会移除 `tsx` devDependency：包括未改写的脚本、源码或构建产物中的 `tsx` 导入或 `tsx/esm/api` 等子路径、`package.json` `imports` 别名、shebang、`package.json` 或 JSON/JavaScript 配置中的工具设置（如 `--import=tsx`），以及 CI 工作流、Git hooks 或 shell 脚本中的 tsx 命令。只要工作区包仍在使用，根依赖就会保留；只要某个包的嵌套包仍在使用，该包依赖也会保留。若 tsx 仍被使用，警告会指出具体位置。

工具配置和源码需要手动修改。例如，将 `nodeArguments: ['--import=tsx']` 改为 `nodeArguments: ['--import=vite-plus/register']`，或将 Mocha 的 `"import": "tsx"` 改为 `"import": "vite-plus/register"`。若项目使用 tsx 程序化 API，请保留 tsx。

其他差异请参阅[从 tsx 迁移](/guide/vpx#coming-from-tsx)。

### oxnode 到 `vpx` {#oxnode-to-vpx}

迁移会提供将 `@oxc-node/cli` 中的 `oxnode` 替换为 `vpx` 的选项。它会改写 `package.json` 脚本、`package.json` 和 JSON 文件中的 lint-staged 任务，以及 `#!/usr/bin/env oxnode` shebang。`#!/usr/bin/env -S node --import @oxc-node/core/register` 等 Node.js preload shebang 会保留 Node.js，并改用 `vite-plus/register`，扩展名缺失的脚本也适用。迁移会保留 shebang 的 `env` 语法、标志和相对路径。对于已使用 Vite+ 的项目，请运行 `vp migrate --full` 以执行此迁移。

| 之前                                                      | 之后                                                 |
| --------------------------------------------------------- | ---------------------------------------------------- |
| `oxnode ./scripts/seed.ts`                                | `vpx ./scripts/seed.ts`                              |
| `oxnode -C dev ./build.ts`                                | `vpx -C dev ./build.ts`                              |
| `oxnode watch --include "config/*.json" ./server.ts`      | `vpx --watch --include "config/*.json" ./server.ts` |
| `node --import @oxc-node/core/register ./scripts/seed.ts` | `node --import vite-plus/register ./scripts/seed.ts` |
| `NODE_OPTIONS='--import @oxc-node/core/register' mocha`   | `NODE_OPTIONS='--import vite-plus/register' mocha`   |

`node --import @oxc-node/core/register` 和 `register.mjs` 形式会保留 Node.js、其包装命令、参数以及原生监视、eval 和测试模式。字面量 `NODE_OPTIONS` 赋值也会改用公开 preload。使用 `oxnode` 可执行文件的命令遵循 `vpx` 规则：`oxnode --watch` 会保持不变，因为它会启动 Node.js 自带的监视器；`oxnode watch` 和 `vpx --watch` 则使用 oxc-node 监视器。

显式将 `OXC_TRANSFORM_ALL` 设为 `typescript` 以外值的命令会保持不变。非空的 `VP_SCRIPT_TSCONFIG` 和 `TSX_TSCONFIG_PATH` 赋值也会保持不变，因为它们会改变配置选择。读取环境文件的命令同样保持不变，因为环境文件可能选择不同的转换模式。迁移会检查命令指定的脚本和本地 preload 是否直接使用独立 oxc-node API（这会在迁移后配置不同 loader）；但不会检查它们导入的模块。

替换 register 导入时，自定义异步 `--loader` 和 `--experimental-loader` hook 会保持原有顺序。这使项目 loader 可以与 Vite+ TypeScript loader 一起处理解析和资源，但不保证与第二个 TypeScript 转换器或任意同步 `module.registerHooks()` 链兼容。

当额外的 `--require` 或 `--import` 可能更改 loader 设置时，直接 `oxnode` 命令和 Node.js preload 命令都会保持不变。如果 Node.js 命令的内联代码仍调用独立 oxc-node API，也会保持不变。迁移会相对于所属包检查显式指定的本地 shebang loader 中是否使用独立 API，但不会跟踪其导入。路径会原样保留：运行时的相对 loader 路径以调用方工作目录为基准，而非脚本目录。

只有在没有其他用途时，迁移才会移除 `@oxc-node/cli` 和 `@oxc-node/core` 开发依赖。loader 引用、API 导入、CI 命令、hooks 和 shell 脚本都可能要求保留这些依赖。迁移也会检查 `--env-file` 和 `--env-file-if-exists` 指定的文件，无论其名称如何。如果无法解析或读取环境文件，则会为手动审查保留这些依赖。runtime 和 peer 依赖会保留。

### ts-node 到 `vpx` {#ts-node-to-vpx}

只有明确禁用了类型检查时，迁移才会提供将受支持的 ts-node 命令替换为 `vpx` 的选项。普通 `ts-node` 会在执行前进行类型检查；`vpx` 不会。仍执行类型检查的命令会保持不变并发出警告，即使另一个选项启用了 transpile-only 模式也一样。

| 之前                                                                            | 之后                                                               |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------ |
| `ts-node --transpileOnly ./scripts/seed.ts`                                      | `vpx ./scripts/seed.ts`                                             |
| `ts-node -T -P tsconfig.scripts.json ./scripts/seed.ts`                          | `vpx --tsconfig=tsconfig.scripts.json ./scripts/seed.ts`            |
| `ts-node-transpile-only ./scripts/seed.ts`                                       | `vpx ./scripts/seed.ts`                                             |
| `node -r ts-node/register/transpile-only ./scripts/seed.ts`                      | `node --import vite-plus/register ./scripts/seed.ts`                |
| `node --loader ts-node/esm/transpile-only ./scripts/seed.ts`                     | `node --import vite-plus/register ./scripts/seed.ts`                |
| `NODE_OPTIONS='--require ts-node/register/transpile-only' node ./scripts/seed.ts` | `NODE_OPTIONS='--import vite-plus/register' node ./scripts/seed.ts` |

迁移也会从本地 JSONC tsconfig 文件、本地 `extends` 链和字面量 `TS_NODE_TRANSPILE_ONLY`/`TS_NODE_TYPE_CHECK` 赋值读取 `transpileOnly` 和 `typeCheck`。`-P`、`--project` 和 `TS_NODE_PROJECT` 可选择配置。传给 `-P` 或 `--project` 的目录会解析为其中的 `tsconfig.json`；`TS_NODE_PROJECT` 中的目录则保持不变。ts-node 隐式发现配置时，迁移会通过 `--tsconfig` 固定该文件，使 `vpx` 在整个运行过程中使用它。在禁用类型检查时支持 `ts-node-esm` 和 `--esm`。

若现有配置及其本地 `extends` 链均未设置 `target` 和 `useDefineForClassFields`，命令会保持不变并发出警告。此时 ts-node 默认使用类字段赋值语义，而 `vpx` 默认使用 define 语义。迁移前请将 `compilerOptions.useDefineForClassFields` 设为 `false`，以保留赋值语义。

受支持的 Node.js preload 命令会保留 Node.js，并将旧 loader 选项和模块都替换为 `--import vite-plus/register`。如果字面量 `NODE_OPTIONS` 赋值传到已知 `node` 命令且通过相同检查，也会迁移。已有的 `TS_NODE_PROJECT` 文件选择会保留。需要固定隐式配置的 preload 会保持不变：请先将 `TS_NODE_PROJECT` 设为配置文件，因为 Node.js 不接受 `--tsconfig`。

若工作目录没有配置，但入口文件会发现另一份配置，preload 也会保持不变。迁移不会扫描导入模块以查找其他配置文件。

自定义编译器、transpiler、SWC、ts-node 编译器覆盖、无法支持的配置继承、eval 和 REPL 用法都会保持不变。环境文件、Node.js 配置文件、额外 preload 和不受支持的 `NODE_OPTIONS` 赋值也会保留原命令，因为它们可能在注册前更改 ts-node 设置。非空的 `VP_SCRIPT_TSCONFIG`、`TSX_TSCONFIG_PATH` 或 `OXC_TSCONFIG_PATH` 赋值会保持不变，因为它们会选择其他配置。迁移会检查命令指定脚本中已知的模块不兼容问题，但不会跟踪其导入。迁移后的脚本遵循 [`vpx` 的 tsconfig 和模块规则](/guide/vpx#tsconfig)。

静态导入或重新导出 CommonJS 值的条目也会保持不变，包括命名、namespace 和 default 绑定、CommonJS 包中的 `.js` 文件以及软件包入口。迁移会检查 import 和 require 的解析结果，但不会执行依赖。目标无法解析或两种模式解析到不同目标时，会保留命令以便手动审查。即使 `esModuleInterop: true`，CommonJS 的 `__esModule.default` 值也可能以不同于 Node.js 的方式展开，因此仅有此设置并不足以确保 default 导入安全。仅类型导入和导出、仅用于副作用的导入、已确认的 ES module 目标，以及 Node.js 内置模块的命名绑定不会触发此检查。

与 oxnode 类似，迁移会改写 package scripts、JSON lint-staged 任务和受支持的 env shebang。需要固定配置的 shebang 会保持不变，因为配置路径取决于调用方工作目录。已有 Vite+ 项目请使用 `vp migrate --full`。只有在没有剩余命令、loader、API 导入或配置引用需要时，才会移除 `ts-node` 开发依赖。runtime 和 peer 依赖会保留，`typescript` 也不会移除。

## 持续集成规则

迁移会将 `.github` 下 GitHub Actions 工作流和复合操作中的精确 `voidzero-dev/setup-vp@v1` 引用替换为该 Vite+ 版本已知的最新精确 `setup-vp` 版本。冻结的 `v1` 标签不会接收新版本。已有的精确版本和 commit SHA 保持不变。

## Node.js 版本规则

迁移会将 Volta 的 `volta.node` 固定版本转换为 `.node-version`，因为 Vite+ 不读取 Volta。对于已有的 Vite+ 项目，此转换属于完整设置范围，因此会通过 `vp migrate --full` 运行；全新迁移则会无条件运行。

- 如果 `.node-version` 或 `.nvmrc` 已存在，迁移会保留它们并跳过 Volta 转换。Vite+ 会直接读取这两个文件（参见 [Node.js 选择](/guide/env#node-js-selection)）。

## 包管理器规则

### pnpm

**根设置位置。** pnpm 10.6.2+ 使用 `pnpm-workspace.yaml` 作为受支持根设置的唯一来源。迁移会将已识别的 `package.json#pnpm` 字段移动到该文件中，包括 overrides、peer 规则、patch 设置、包扩展、架构和构建策略、审计/更新配置以及配置依赖。迁移会在 `pnpm` 对象为空时移除它，并保留可能属于其他工具的未知键。

- 当两个文件定义了相同的迁移设置时，会递归合并对象条目并保留不重复的数组条目。在冲突的标量叶节点上，`package.json#pnpm` 中的值优先，同时保留仅存在于工作区文件中的同级条目。
- 在 pnpm 10.6.2 之前，这些设置保留在 `package.json#pnpm` 中。（工作区设置支持是逐步加入的：一般设置从 10.5.0 开始，overrides 从 10.5.1 开始，`peerDependencyRules` 从 10.6.2 开始。pnpm 11 不再读取旧版 `package.json` 设置。）

**Catalogs。** Catalogs 是从 pnpm 9.5.0 开始支持的独立功能，与上述设置边界无关。即使在 10.6.2 以下的版本中，overrides 仍保留在 `package.json#pnpm`，迁移也会将工作区 catalog 从过时的 wrapper 别名中重写出来，并将 `catalog:` overrides 保留为引用，而不是内联为具体版本。

- 依赖引用、默认和命名 catalogs、overrides 以及 `peerDependencyRules` 会彼此保持一致。
- pnpm 接受顶层 `catalog` 或 `catalogs.default` 作为逻辑默认 catalog，但不能同时使用二者。迁移会保留现有形式，不会在其旁边创建另一种形式。
- 当已有的命名 catalog 已拥有 `vite-plus`、`vite` 或 `vitest` 时，迁移会复用该受管理的工具链 catalog，用于新添加的依赖和 overrides。只有在没有可复用的受管理或默认 catalog 时，才会创建顶层默认 catalog。

**Peer 规则。**核心版本编码了捆绑的 Vite 版本：核心版本 `8.3.5000` 捆绑 Vite `8.3.5`（参见[此 RFC](https://github.com/voidzero-dev/vite-plus/blob/main/rfcs/core-version-alignment.md)）。pnpm 会根据 `vite` 别名检查插件的 `vite` peer 范围，因此支持捆绑版 Vite 的插件会通过检查，不支持的则会失败。

- 迁移不会将 `vite` 添加到 `peerDependencyRules.allowAny` 或 `peerDependencyRules.allowedVersions`。
- 如果 `allowAny` 中存在 `vite`，或 `allowedVersions.vite` 的值为 `'*'`，迁移会移除该项，包括用户手动添加的条目。这些条目原本用于接受 `1.x` 核心别名。其他 `allowedVersions.vite` 范围（如 `'7 || 8'`）会保留。如果字段或整个 `peerDependencyRules` 变为空，迁移会移除它。其他条目保持不变。迁移摘要会列出移除的规则。
- 对预览构建（`0.0.0-commit.<sha>`）或 Vite+ 核心预发布版本（如 `8.4.0-vp.0`），迁移会继续写入 `vite` 规则。包管理器不会将这些版本用于 `^8.0.0` 等范围。
- pnpm 10.2.0 之前的版本也会继续写入 `vite` 规则。这些版本会将 `vite@*` 别名 override 应用于 peer 范围；没有该规则时，所有 `vite` peer 都会与核心版本冲突。
- 迁移后，如果插件的 `vite` peer 范围不包含捆绑的 Vite（例如 `^7.0.0`），就会产生 peer 警告。启用 `strictPeerDependencies` 时，安装会失败。请更新插件，或仅放宽该插件的 peer 范围：
  - pnpm 12.17.0 及更高版本：添加 override `'vite-plugin-foo>vite:peer': '*'`。pnpm 在此版本中弃用了 `peerDependencyRules`。
  - 较早版本的 pnpm：添加规则 `allowedVersions: { 'vite-plugin-foo>vite': '*' }`。

  迁移只会移除普通的 `vite` 键，因此以上两种写法都会保留。

**其他规则。**

- 声明了 `vite-plus` 但没有直接 `vite` 声明的包会保留这种布局（见 [Vite 和 Overrides](#vite-and-overrides)）。
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

- Bun catalogs 仅能在工作区内解析，也就是根 `package.json` 中有 `workspaces` 字段。空的 `workspaces` 字段也算。在 bun 工作区中，现有的顶层或工作区 catalog 位置以及命名 catalog 引用都会被保留。没有 `workspaces` 的独立 bun 项目会保留具体 spec，并且不会获得 catalog 字段，因为 `bun install` 无法在工作区之外解析 `catalog:`。
- Bun 1.2.21 之前的版本只会读取 `workspaces` 下的 catalog。此类版本中，只有项目已在 `workspaces` 下配置 catalog 时迁移才会使用 catalog，否则会保留具体 spec。
- 如果现有命名 catalog 已包含 `vite-plus`、`vite` 或 `vitest`，迁移会将缺失的工具链条目加入该 catalog，而不是在旁边创建默认 catalog。
- core 别名会被镜像为直接的 `vite` 依赖，使 Bun 在应用 overrides 之前能够看到 peer provider。

## 迁移后

- 每个 Vite 配置都会检查是否存在与 Rolldown 不兼容的模式（例如 `manualChunks`）。发现的任何内容都会作为警告报告；配置不会被修改。
- 依赖会重新安装一次，以刷新锁文件。如果安装失败，迁移会报告错误并以非零状态退出。
- 成功迁移后，`vp fmt` 会运行于迁移过程中发生变更的文件上，但会排除 Git 工作区中原本就处于脏状态的路径。Oxfmt 会选择受支持的格式；非 Git 项目会保留全项目格式化。项目仍使用 Prettier 时会跳过格式化。格式化失败会作为警告报告，因此迁移结果和手动格式化命令仍然可用。
