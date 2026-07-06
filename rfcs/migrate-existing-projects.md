# RFC：将现有的 Vite+ 项目迁移到新版本

- 状态：已在 `rfc/migrate-upgrade-path` 上实现；端到端浏览器模式验证仍未完成（见后续事项）
- 依赖于：[#1588 用上游 vitest 替换 @voidzero-dev/vite-plus-test](https://github.com/voidzero-dev/vite-plus/pull/1588)（已合并，`342fd2f4`）
- 相关：`docs/guide/upgrade.md`、[migration-command.md](./migration-command.md)、[upgrade-command.md](./upgrade-command.md)

## 目标：两条命令完成升级

之后任何 Vite+ 升级都只需要两条命令：先升级全局 CLI，再迁移项目。

```bash
vp upgrade   # 更新全局 `vp` 二进制文件
vp migrate   # 将项目升级到新的工具链
```

这两步都必不可少，而且顺序很重要。`vp migrate` 通常运行项目的**本地** `vite-plus`，而旧项目中的这个版本早于新的升级逻辑（甚至还会重写将项目固定到旧版本的配置）。因此，先执行 `vp upgrade` 可以提供足够新的 CLI，然后 `vp migrate` 再切换到它（见 Routing）并应用下面的规则。仅仅执行 `vp update vite-plus` 并不够：它只会提升依赖，但不会协调 override/catalog 配置。

`vp migrate` 是幂等的：对于已经是最新状态的项目，它会报告“already using Vite+”并且不会做任何修改。

对于现有的 Vite+ 项目，`vp migrate` 只升级工具链版本（下面这些规则）。设置分组（git hooks、编辑器配置、agent 文件、ESLint 和 Prettier 迁移、框架 shim、tsconfig `baseUrl`，以及将 `.nvmrc`/Volta 迁移为 `.node-version`）仅在使用 `--full` 时运行。按动作划分的标志 `--hooks`、`--agent` 和 `--editor` 可在不使用 `--full` 的情况下启用单个设置动作。默认升级如果跳过了可用的设置动作，会提示运行 `vp migrate --full`。全新（非 Vite+）项目始终执行完整迁移。

## 迁移规则

按顺序在现有的 Vite+ 项目上运行。vitest 的指导事实是：`vite-plus` 以打包版本声明 `vitest`（以及 `@vitest/*` 运行时家族）为依赖，因此仅使用 `vite-plus/test*` 的普通 node 模式项目不需要自己安装 `vitest`。直接安装且要求 `vitest` peer 的包则不同：在严格的依赖布局下，嵌套在同级 `vite-plus` 依赖下方的那份副本无法满足该 peer。这样的包需要在包级别直接依赖 `vitest`，并在包管理器支持时再加一个共享覆盖。无论 peer 范围是精确还是宽泛，这一规则都适用。

在 `node-modules/urllib` 上，已在 pnpm、npm 和 yarn 中验证移除旧的直接依赖（PR [#832](https://github.com/node-modules/urllib/pull/832) / [#833](https://github.com/node-modules/urllib/pull/833) / [#834](https://github.com/node-modules/urllib/pull/834)）。这些 node-modules 布局可以提升一个精确的 peer，但这并不适用于严格的 pnpm，因此迁移仍会显式配置所需的 peer。对官方 `@vitest/*` 包以及第三方 `vitest-browser-svelte` 场景，已覆盖必需 peer 的处理。

### Yarn Plug'n'Play 预检

Vite+ 目前不支持 Yarn Plug'n'Play。在收集其他迁移决策或安装依赖之前，`vp migrate` 会解析来自 `YARN_NODE_LINKER`、项目/上级目录/用户主目录 `.yarnrc.yml` 文件以及 Yarn 版本相关默认值的实际 Yarn linker。显式的 `nodeLinker: pnp` 和 Yarn 2+ 的隐式默认值都属于 PnP 模式。

当 PnP 处于启用状态时，交互式迁移会打印不兼容提示，并询问是否将项目切换为 `nodeLinker: node-modules` 并继续。接受会写入项目根目录的 `.yarnrc.yml`，且不会丢弃其中其他设置；拒绝则会在后续迁移修改项目之前取消。`--no-interactive` 会使用肯定的默认值，报告转换并继续。该转换发生在初始安装之前，因此一个干净的 checkout 能获得用于检测必需 peer 的物理依赖元数据。进程级的 `YARN_NODE_LINKER=pnp` 不能通过项目文件持久修复，因此迁移会停止并提示取消设置或改为 `node-modules`。

| 区域                                  | 规则                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 路由                                  | 如果项目本地的 `vite-plus` 版本比全局 `vp` 更旧，则从全局 CLI 运行 `migrate`；否则保持本地优先。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| Yarn linker                           | Vite+ 目前不支持 Yarn PnP。迁移前检测显式和隐式 PnP，询问是否切换到 `nodeLinker: node-modules`，并且仅在转换后继续。非交互式迁移默认接受此转换。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `vite-plus` 规格                      | 将非协议固定的规格（例如 `^0.1.24`）重新钉定到工具链目标（catalog 项目中为 `catalog:`，否则为版本号），使 lockfile 脱离旧解析。保留有意的协议固定（`workspace:`/`file:`/`link:`/`npm:`/...）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `vite` 覆盖                           | 始终受管理：将 `vite` 别名指向与正在迁移的 `vite-plus` 版本相匹配的具体 `@voidzero-dev/vite-plus-core` 版本，无论项目使用何种 override/resolution/catalog 形式；规范化为落后的 `core@<old>` 别名。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `vitest` 本身（默认）                 | 由 `vite-plus` 提供，因此默认不由项目管理：从依赖字段、字符串值的 `overrides`/`resolutions`/`pnpm.overrides`、`pnpm-workspace.yaml` 的 `overrides`+`catalog(s)`、bun/yarn catalog，以及 pnpm `peerDependencyRules` 中的 `vitest` 条目移除任何项目级 `vitest`。在清理 catalog 之前，将存活的 `peerDependencies.vitest` catalog 引用解析为其公开范围。之后未来的 `vp update vite-plus` 会在没有项目固定值漂移的情况下保持其正确。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `vitest`、peer/browser/Nuxt 例外      | 当某个包直接安装了需要 `vitest` 的 peer 消费者、使用浏览器模式、保留了直接的上游 `vitest` 包引用，或声明了 `@nuxt/test-utils` 时，保留该包中受管理的 `vitest`（加入 `devDependencies` 并将其固定/覆盖到打包版本）。必需 peer 的检测来自已安装的包元数据，而不仅仅是包名，因此像 `vite-plugin-gherkin` 这样的集成也会被覆盖。当在干净 checkout 中无法获得该元数据时，保守地保留现有的直接 Vitest。其他保留的引用包括模块增强、嵌套或根级 `compilerOptions.types`、`require.resolve` / `import.meta.resolve`，以及有意不重写的 `vitest/package.json` 导出。在 Nuxt test-utils 包中，所有 `vitest` 和 `vitest/*` 规格符都会始终保持上游形式；在其他包中，可重写的导入和三斜杠指令不会留下持久固定。直接依赖满足严格的 peer 解析；共享覆盖将工作区收敛到打包版本。 |
| `vitest` 生态包                       | 当 Vitest 受管理时，将项目列出的当前 lockstep `@vitest/*` 包（`@vitest/coverage-v8`、`@vitest/coverage-istanbul`、`@vitest/ui`、`@vitest/web-worker`，……）对齐到打包的 `VITEST_VERSION`。排除 `@vitest/eslint-plugin`（独立版本线，可选 `vitest: *` peer）以及已弃用的 `@vitest/coverage-c8`（最后发布于 `0.33.0`；不存在 Vitest 4 发布版）。当 `VP_OVERRIDE_PACKAGES` 不包含 Vitest 时，跳过生态对齐，以便用户拥有的精确 peer 版本保持兼容。浏览器包保留其专门处理：`@vitest/browser` / `-preview` 由 `vite-plus` 打包；`@vitest/browser-playwright` / `-webdriverio` 为可选启用（保留固定 + 框架 peer）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| Catalog 放置                          | 保留项目当前生效的 catalog 布局。将顶层 `catalog` 和 `catalogs.default` 视为同一个逻辑默认值的替代定义，且绝不同时输出二者。对于新注入的受管理依赖和覆盖，优先使用已存在且受管理的命名 catalog，且其中包含 `vite-plus`，其次是 `vite`，再其次是 `vitest`。保持现有的命名/默认依赖引用不变，包括 force-override/pkg.pr.new 运行；仅在没有可复用的受管理或默认 catalog 时才创建顶层默认 catalog。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| 工作区                                | 重新协调每个包清单，而不只是根目录。将直接 `vitest` 依赖本地化到需要它的包；仅当至少有一个包需要它们时才保留共享 catalogs/overrides。对现有的普通 `vite-plus` 范围进行一致的重新固定，同时保留有意的协议规格。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| 旧包装器                              | 移除所有 `@voidzero-dev/vite-plus-test` 别名（依赖、覆盖、catalog）；将直接的包装器导入改指向 `vite-plus/test`。`vite-plus/test*` 导入保持不变（稳定的公共 API）。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| pnpm 配置位置                         | 在 pnpm 10.6.2+ 中，将 `package.json#pnpm` 中识别出的根设置移动到 `pnpm-workspace.yaml`，并在 legacy 对象为空时将其移除；保留未知的第三方键。较旧的 pnpm 将这些设置保留在 `package.json` 中，因为在 10.6.2 之前，完整的工作区支持（包括 `peerDependencyRules`）并不可靠。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| 重新安装 + 验证                       | 进行一次带 lockfile 刷新的重新安装（`--no-frozen-lockfile` / `--force`）；在 npm 重新安装前，移除一个过期的真实 `vite` 安装/lock 条目，否则 npm 会在依赖变为 Vite+ core 别名后仍然保留它。安装失败会给出警告并设置非零退出码。                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |

强制覆盖/CI 模式（`VP_OVERRIDE_PACKAGES`）会被尊重：当 `vitest` 不是其中受管理的键时，项目自身的 `vitest` 绝不会被移除，其 `@vitest/*` 生态依赖也不会被重新对齐。对象值的嵌套 npm/Bun overrides 是用户拥有的范围，而不是受管理的版本固定项，因此会被保留。

catalog 是 pnpm 的独立特性，与工作区设置分离，自 pnpm 9.5.0 起受支持，因此它们独立于 10.6.2 的设置边界。在 10.6.2 以下、overrides 仍保留在 `package.json#pnpm` 的情况下，迁移仍会将工作区 catalog 从过时的 `@voidzero-dev/vite-plus-test` 包装器上改写出去，并将 `package.json` 中的 `catalog:` 覆盖保留为引用，而不是内联为具体版本。

在重写源导入之前，必须先检测旧的 browser-provider 用法。将 `vitest` 别名到已移除的 `@voidzero-dev/vite-plus-test` 包的项目，可能会从 `vitest/browser-<provider>`、`vitest/browser/providers/<provider>` 或 `vitest/plugins/browser-<provider>` 导入 Playwright 或 WebdriverIO。迁移将这三种形式都视为可选启用的 provider 用法，安装匹配的 `@vitest/browser-<provider>` 包和框架 peer，然后将导入重写为等价的 `vite-plus/test*` 形式。

只有在配置入口文件中（`vite.config.*`、`vitest.config.*` 以及迁移解析出的任何配置文件）才会将 `vite` 导入重写为 `vite-plus`。其他所有文件都会保留其 `vite` 导入，因为 `vite-plus` 并不保证是 Vite 暴露表面的超集：它只拥有 `defineConfig`、`defineProject` 和 `lazyPlugins`，所以重写一个透传符号（例如 `createBuilder`、`loadConfigFromFile`，包括在 `typeof import('vite')` 类型位置中）没有收益，反而可能破坏类型。在 Vite+ 项目中，未重写的 `vite` 导入仍会通过受管理的 `@voidzero-dev/vite-plus-core` 别名解析，并且对普通 Vite 项目仍然可用。插件包即使在其配置文件中也会额外跳过重写：当包的非作用域名称以 `vite-plugin-`（<https://vite.dev/guide/api-plugin>）或 `unplugin-`（<https://unplugin.unjs.io/guide/plugin-conventions.html>；跨打包器且提供 Vite 入口的插件）开头，或者它在 `peerDependencies` 或 `dependencies` 中声明了 `vite` 时，就会被识别为插件。作用域是 `vite`；`vitest` 的重写不受影响。

### Node.js 版本

`vp migrate` 会将 `.nvmrc` 和 Volta 的 `volta.node` 固定转换为 `.node-version`（这是 Vite+ 读取的格式）。现有的 `.node-version` 会被保留；当 `.nvmrc` 被移除时，项目工作流和复合 actions 中任何 `actions/setup-node` 的 `node-version-file: .nvmrc` 引用都会改指向 `.node-version`，以免 CI 失效。原生绑定可运行于任何 Node `>=20.0.0`，因此如果某个 Node 固定的下限低于受支持范围的最小值，但仍高于该 ABI 下限（`engines.node: 24.x`、`devEngines.runtime` `^24`、`.node-version` `24.3.0`），则保持不变：平台包声明了真实的 ABI 下限，因此包管理器不再会因为受支持范围中的缺口而跳过可选原生依赖。

## `@nuxt/test-utils` 兼容性

`@nuxt/test-utils` 的转换器只有在模块标识符恰好是 `vitest` 时，才会检测到已有的 `vi` 导入。当测试使用 `mockNuxtImport` 或 `mockComponent` 时，把该导入改为 `vite-plus/test` 会让转换器再注入第二个 `vi` 导入，并可能因重复标识符而导致编译失败。要求用户知道哪些单独文件会触发该转换器过于脆弱，因此迁移改为采用一个包级规则。

检测与作用范围：

1. 当某个包的 `dependencies`、`devDependencies` 或 `optionalDependencies` 中包含 `@nuxt/test-utils` 时，该包即符合条件。
2. 该包中的每一个 `vitest` 和 `vitest/*` 模块标识符都会被保留，无论单个文件是否导入了 `@nuxt/test-utils`。这包括单元测试和共享测试辅助工具，从而消除同一测试套件内混合导入身份的问题。
3. 作用域限定的 `@vitest/browser*` 标识符会保留其现有的 Vite+ 重写和 provider provisioning，因为它们是独立的包，而不是受此规则保护的上游 `vitest` 包身份。
4. 符合条件的包保留其包本地的 `vitest`，工作区则保留相匹配的共享 pin/catalog 条目。
5. 工作区作用域遵循最近的 `package.json`：一个 Nuxt 包不会抑制无关工作区包中的重写。
6. `prefer-vite-plus-imports` 对 `vitest` 和 `vitest/*` 使用相同的包级例外。lint 和自动修复都不能撤销迁移结果。

此规则在交互式和非交互式迁移中都会自动生效；不会针对单个文件进行提示。迁移会报告：

```text
• 为兼容 @nuxt/test-utils，在 135 个文件中保留了上游 `vitest` 导入
```

这里的计数是文件数量，而不是导入声明数量。

**待验证：** vitest 的 **browser mode** 历史上需要直接注入 `vitest`（“vibe-dashboard” 回归）。现在升级会恢复 opt-in provider 和 framework peer，并保留包本地的 `vitest`；在通过类似 urllib 的 pnpm/npm/yarn 检查证明任何部分是冗余之前，请保留该行为。

## Vitest 生态包

每个由 `vitest` 生态规则覆盖的软件包是如何处理的，已针对注册表中的 `4.1.9` 进行核对。代码规则：将项目列出的任何 `@vitest/*` 对齐到 `VITEST_VERSION`，但 `@vitest/eslint-plugin` 除外；浏览器相关软件包还会额外遵循其捆绑/可选启用的处理方式。

| 包                                                                                           | `vitest` 同行依赖        | 处理方式                                                                                                    |
| ---------------------------------------------------------------------------------------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------- |
| `@vitest/coverage-v8`                                                                          | `4.1.9`（精确）         | 对齐；在同一包中提供直接依赖的 `vitest`                                                                       |
| `@vitest/coverage-istanbul`                                                                    | `4.1.9`                 | 对齐；在同一包中提供直接依赖的 `vitest`                                                                       |
| `@vitest/ui`                                                                                   | `4.1.9`                 | 对齐；在同一包中提供直接依赖的 `vitest`                                                                       |
| `@vitest/web-worker`                                                                           | `4.1.9`                 | 对齐；在同一包中提供直接依赖的 `vitest`                                                                       |
| `@vitest/browser`                                                                              | `4.1.9`                 | 已移除（由 `vite-plus` 捆绑）；浏览器包保留直接依赖的 `vitest`                                                 |
| `@vitest/browser-preview`                                                                      | `4.1.9`                 | 已移除（由 `vite-plus` 捆绑）；浏览器包保留直接依赖的 `vitest`                                                 |
| `@vitest/browser-playwright`                                                                   | `4.1.9` + `playwright`  | 可选启用：固定到 `VITEST_VERSION`，保留 `playwright` 和直接依赖的 `vitest`                                     |
| `@vitest/browser-webdriverio`                                                                  | `4.1.9` + `webdriverio` | 可选启用：固定到 `VITEST_VERSION`，保留 `webdriverio` 和直接依赖的 `vitest`                                    |
| `@vitest/expect` `/runner` `/snapshot` `/spy` `/utils` `/mocker` `/pretty-format` `/ws-client` | 无                     | 传递性运行时包；如果已列出则对齐，但不要仅为了它们单独添加 `vitest`                                            |
| `@vitest/eslint-plugin`                                                                        | `*`                     | 保持不变（使用自己的版本行，例如 `1.6.x`）                                                                    |
| `@vitest/coverage-c8`                                                                          | `>=0.30.0 <1`           | 保持不变（已在 `0.33.0` 弃用；不存在与 Vitest 4 匹配的软件包版本）                                            |
| `vitest-browser-react` `/-vue` `/-svelte`, ...                                                 | `^4`（范围）            | 第三方，使用自己的版本管理；保持在兼容版本，并带有包本地的 `vitest` 以及共享覆盖                              |

## 实现

| 区域                                                               | 变更                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `crates/vite_global_cli` (`commands/migrate.rs`, `js_executor.rs`) | `delegate_migrate`：比较本地 `vite-plus` 与全局 `vp` 版本；当本地版本较旧时提升到全局 CLI。                                                                                                                                                                                                                                                                                                                                                                           |
| `crates/vite_migration` (`import_rewriter.rs`)                     | 支持包级 Nuxt 兼容模式：在所有声明了 `@nuxt/test-utils` 的包中保留 `vitest` 和 `vitest/*` 导入标识符，同时继续重写范围限定的 `@vitest/browser*`；在插件包中保留 `vite` 和 `vite/*` 导入标识符（无范围名称 `vite-plugin-*` 或 `unplugin-*`，或者 `peer/runtime deps` 中包含 `vite`），以便发布的插件仍可被 vite 消费；返回保留文件计数用于迁移摘要。 |
| `packages/cli/src/migration/{migrator,npm-reinstall,bin}.ts`       | Yarn PnP 预检与 `node-modules` 转换；基于使用情况的托管覆盖集合；按包进行依赖协调；在所有目标中移除 `vitest`；完整对齐 `@vitest/*`；恢复 browser provider；在 `vite-plus`/`vite` 下重新固定版本；修复空/无关 `pnpm` 的路由；清理过期的 npm Vite 安装；包级 Nuxt 依赖检测与保留 Vitest 供给。                                                      |
| Oxlint `prefer-vite-plus-imports` 规则                             | 应用相同的 Nuxt 包级 `vitest` / `vitest/*` 例外，以便诊断和自动修复都能保留迁移后的兼容结果。                                                                                                                                                                                                                                                                                                                                                                      |

已由 `migrator.spec.ts` 中的单元测试覆盖（移除 vitest、所需的 peer 供给、生态系统对齐、浏览器 provider 恢复包括旧版包装器导入路径、工作区定位、重新固定版本、空 `pnpm` 协调），`npm-reinstall.spec.ts`（过期 npm 安装和锁文件清理），以及 `vite_global_cli` 中的路由测试。

## 快照覆盖范围

| 场景                                                                                    | 全局快照 fixture                                                                        |
| ------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| 本地 CLI 陈旧升级、普通范围重新固定、陈旧包装器移除、空 `pnpm` 路由 | `migration-upgrade-stale-local-pnpm`                                                       |
| 默认直接 `vitest` 移除和普通导入重写                                 | `migration-already-vite-plus`, `migration-vitest-import-only`                              |
| npm 和 Yarn 下在 PnP 转换为 node-modules 之后的官方精确 peer                | `migration-upgrade-vitest-exact-peer-npm`, `migration-upgrade-vitest-exact-peer-yarn4`     |
| 第三方范围 peer                                                                      | `migration-vitest-peer-dep`                                                                |
| 内部 `@vitest/*` 包和 `@vitest/eslint-plugin` 排除项                        | `migration-upgrade-vitest-non-runtime-only-npm`                                            |
| Playwright 和 WebdriverIO 浏览器恢复，包括 pnpm 驱动审批             | `migration-upgrade-browser-source-only-pnpm`, `migration-upgrade-browser-webdriverio-pnpm` |
| 现有 monorepo 中具有共享根覆盖的包本地 Vitest                     | `migration-upgrade-monorepo-vitest-localized-pnpm`                                         |
| 保留的上游模块增强                                                      | `migration-rewrite-declare-module`                                                         |
| 非管理/CI 覆盖模式保留用户拥有的 Vitest                                      | `migration-vitest-unmanaged-override`                                                      |
| 故意的协议固定 `vite-plus` 规范                                                 | `migration-upgrade-vite-plus-protocol-pin-npm`                                             |
| 对已是最新的项目进行幂等重跑                                              | `migration-from-tsdown`, `migration-from-tsdown-json-config`                               |
| 别名重写后的重新安装和 lockfile 刷新                                      | `migration-standalone-npm`                                                                 |
| 在受管理 catalog 清理之前解析 peer `vitest` catalog 引用                     | `migration-upgrade-peer-vitest-catalog-pnpm`                                               |
| 仅 peer 的浏览器提供者与直接和共享 Vitest 一起提升                      | `migration-upgrade-browser-peer-only-pnpm`                                                 |
| 对空白符容忍的 Vitest 指令重写，不留下临时固定版本                | `migration-upgrade-vitest-reference-whitespace-pnpm`                                       |
| 对象值的嵌套 Vitest 覆盖保持用户所有并且幂等                      | `migration-upgrade-nested-vitest-override-npm`                                             |
| 保留的 tsconfig、resolver 和 `vitest/package.json` 引用保持直接 Vitest        | `migration-upgrade-vitest-retained-references-npm`                                         |
| 从已安装的依赖元数据中发现所需的 Vitest peers                         | `migration-upgrade-required-vitest-peer-metadata-npm`                                      |
| 已弃用的 `@vitest/coverage-c8` 不会被分配一个不存在的 Vitest 4 版本             | `migration-upgrade-deprecated-coverage-c8-npm`                                             |
| 独立 Yarn 一次性写入 catalog 规范并且是幂等的                          | `migration-standalone-yarn4-idempotent`                                                    |
| pnpm 保留 `catalogs.default`，而不添加顶层 `catalog`                        | `migration-upgrade-pnpm-catalogs-default`                                                  |
| pnpm 在 pkg.pr.new 迁移期间重用仅命名的受管工具链 catalog              | `migration-upgrade-pnpm-named-catalog`                                                     |
| pnpm 低于 10.6.2 时在重写 catalog 的同时保留 `package.json` 中的 `catalog:` 覆盖     | `migration-upgrade-pnpm9-overrides`                                                        |
| 非管理的精确 peer Vitest 生态系统版本与用户拥有的 Vitest 保持一致        | `migration-vitest-unmanaged-override`                                                      |
| Nuxt 包保留所有上游 `vitest` 导入，而不影响兄弟包     | `migration-upgrade-nuxt-test-utils`, `migration-upgrade-nuxt-test-utils-monorepo`          |

匹配的 Oxlint/autofix 行为由本地 `lint-vite-plus-imports-nuxt` 快照覆盖：Nuxt 包中的所有 `vitest` 导入都保持豁免，而该规则会继续重写 Vite 和作用域浏览器包导入。

## 后续事项（不包含在本次变更中）

- 在 pnpm/npm/yarn 上验证浏览器模式升级；仅当严格的 peer 和优化器解析仍然正确时，才简化包级本地配置。
- 在真实的 `0.1.x` 项目上添加端到端检查。
- 在发布后，将 `docs/guide/upgrade.md` / 发布说明提示更新为 `vp upgrade && vp migrate` 流程，并执行 `npm deprecate @voidzero-dev/vite-plus-test`。
- 为 CI 增加可选的 `vp migrate --check`（仅检测，退出码表示有可用升级）。
