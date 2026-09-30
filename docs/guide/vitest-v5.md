# 升级至 Vitest 5

Vite+ 捆绑了 Vitest `5.0.1`。CLI 和测试请使用 Node `^22.18.0 || ^24.11.0 || >=26.0.0`。

## 迁移前

手动更新依赖前，请从工作区根目录运行 `vp migrate`。保留原始锁文件和已安装的软件包，以便迁移识别源 Vitest 版本，包括较旧 `vite-plus` 安装中的运行器。

运行此迁移前，请先将低于 Vitest 4 的项目升级到 v4。如果无法确定原始版本，请恢复并安装原始锁文件，然后重新运行 `vp migrate`。

```bash
vp migrate
vp install
vp check
vp test
```

提交结果前，请阅读按文件列出的审查报告。如果 `test.api` 与 `test.browser.api` 设置冲突，或使用了没有受支持替代项的已移除 runtime API，迁移会在更新依赖前停止。解决这些阻塞项后重新运行命令。没有阻塞项时，即使仍有待审查项目，迁移也可以成功完成安全的自动改动。

等价的静态 `test.api` 和 `test.browser.api` 值可以保留，即使对象的属性顺序或引号形式不同也可以。迁移会移除冗余的 `browser.api`。如果值冲突或表达式需要执行才能确定，请选择一项配置；v5 使用一个 API 服务器。

## Node 运行时

安装依赖前，迁移会将不兼容的运行时固定版本升级到最近的受支持最低版本。例如，`20.19.0` 会变为 `22.18.0`，`24.10.0` 会变为 `24.11.0`，`25.9.0` 会变为 `26.0.0`。受支持的固定版本保持不变。无法解析的选择器仍需审查。

库对外的 `engines.node` 约定应与其测试运行时分开。迁移不会更改该约定。最低版本受支持的引擎范围（例如 `>=22.19.0`）或完整受支持主版本范围（例如 `24.x`）无需审查。请使用不低于该主版本受支持最低值的具体运行时固定版本。

Node 兼容性检查涵盖 `.node-version`、`.nvmrc`，以及 `package.json` 中的 `engines.node`、`devEngines.runtime` 和 `volta.node` 声明。CI 工作流、容器和其他文件中的 Node 版本不在这些检查范围内。

## 保留现有行为

预览构建会链接到 PR 文档站点以查看 Vite+ 指南。正式版本使用 `viteplus.dev`。Vitest 上游文档链接保持不变。

对于 v4 配置，迁移会在缺少相应选项时添加兼容设置。显式设置优先级更高。每项新增设置旁都会附上注释，说明添加原因、采用 v5 行为的方式，以及清理清单和 Vitest 迁移指南的链接：

```ts
test: {
  // Vitest v4 compatibility: preserve mock call history.
  // Remove after tests no longer rely on calls from setup or earlier tests.
  // https://viteplus.dev/guide/vitest-v5#remove-unneeded-compatibility-settings
  // https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default
  clearMocks: false,
}
```

| 新增设置                                                                                                                    | 移除前需要检查的行为                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------- |
| [`test.clearMocks: false`](https://vitest.dev/guide/migration/#clearmocks-is-enabled-by-default)                            | 检查是否有断言依赖设置阶段、`beforeAll` 或之前测试中的 mock 调用。V5 会在每个测试前清除这些记录。                                        |
| [`test.sharedViteServer: false`](https://vitest.dev/guide/migration/#inline-projects-share-the-vite-server-by-default)      | 检查共享服务器下的插件和配置钩子。V5 会为符合条件的内联项目初始化一次。                                                                  |
| 内联 `extends: false`（[说明](https://vitest.dev/guide/migration/#inline-projects-inherit-the-root-config-by-default)）       | 检查继承的根选项、插件和设置文件。V5 会合并数组，请避免重复设置。                                                                        |
| [`browser.locators.exact: false`](https://vitest.dev/guide/migration/#locators-are-strict-by-default)                       | 更新定位器以进行完整且区分大小写的匹配，或在单个定位器上选择退出。                                                                      |
| Glob 阈值 `perFile: true`（[说明](https://vitest.dev/guide/migration/#glob-coverage-thresholds-no-longer-inherit-perfile)）  | 若要按文件强制执行覆盖率要求，请保留此设置。移除后会将匹配文件作为一组进行检查。                                                          |
| [`fakeTimers.toNotFake: ['Temporal']`](https://vitest.dev/guide/migration/#fake-timers-and-setsystemtime-now-mock-temporal) | 检查使用全局 Temporal polyfill 和 fake timer 的测试。若要使用模拟时间，只移除 `Temporal`，保留其他排除项。                                |

新项目使用 v5 默认值。某些生成的兼容设置可能无需改动代码或只需少量局部修复即可移除。移除前请完成下方检查。这些选项在 v5 中仍受支持；如果移除需要大量测试改动，请暂时保留兼容设置。

迁移不会改动现有设置和注释。由于无法区分早期迁移添加的设置与用户自己的选择，因此不会为这些设置添加注释。重复运行不会复制注释，也不会恢复已删除的注释。

如果项目没有测试配置，可以直接使用 v5 默认值，无需审查提示或新增兼容配置。合并 lint 配置等其他迁移步骤可能会创建 `vite.config.ts`；同一次迁移也会将 v4 兼容设置应用到该新配置。

升级到 v5 后，可以重新运行 `vp migrate`，而不会再次应用 v4 兼容默认值，即使项目没有配置文件也是如此。重新运行迁移前，请完成依赖安装。

丢弃原始依赖前，请先解决或保存首次运行的审查报告。后续运行会使用当前 Vitest 版本和文件，因此可能不会重复那些依赖原始 v4 行为的审查项。

### 移除不需要的兼容设置

首先，在保留兼容设置的情况下验证迁移后的项目。然后使用迁移差异和 `Vitest v4 compatibility` 注释，找出根配置、工作区配置和内联项目配置中的新增项。保留原有用户设置，以及来源不明确的设置。

每次只移除一项新增设置。检查移除后项目实际使用的值，包括继承选项、插件和设置文件。首先在不改动代码的情况下运行受影响的测试套件。适用时也要运行浏览器和覆盖率测试；Node 测试通过并不能证明浏览器定位器正确。对于 `fakeTimers.toNotFake`，只移除新增的 `Temporal` 项，保留其他排除项。

可以进行少量局部的应用、测试或设置修复，同时保持测试意图，例如修正定位器或调整少数测试中的 mock 设置。保留断言和测试覆盖，并审查所有快照变化。如果移除需要大范围修改测试或重构共享设置，请暂时保留兼容设置并记录后续工作。

只有受影响的测试通过、运行相同测试集且没有新增跳过项，并且结果行为符合预期时，才保留移除结果。同时删除生成的注释。如果验证仍失败、必需的测试套件无法运行，或结果仍不确定，请恢复设置及其注释。只撤销清理过程中进行的试验性改动；保留已完成的迁移修复和无关工作。区分暂缓改写和无法验证的设置。

测试通过并不能证明覆盖率约束没有变化。除非你打算从逐文件阈值改为汇总检查，否则请保留生成的 glob 阈值 `perFile: true` 设置。代理应先就该变更征求你的批准。请参阅 [Vitest 覆盖率阈值迁移说明](https://vitest.dev/guide/migration/#glob-coverage-thresholds-no-longer-inherit-perfile)。

完成单项检查后，将已接受的移除合并并运行完整验证套件。逐项报告候选设置的配置路径、移除决定、代码改动、验证命令及结果，以及剩余工作。如果作为项目选择保留某个选项，请将兼容性注释替换为相应原因。

## 源码变更

迁移会基于语法和导入绑定执行针对性改动。对于动态选项、含义不明确的包装函数，或契约不允许使用 `async` 的回调，会生成待审查项。

```ts
// Before
test.sequential('result', () => {
  expect(result).resolves.toBe(42);
});

// After
test('result', { concurrent: false }, async () => {
  await expect(result).resolves.toBe(42);
});
```

在浏览器测试中，v4 的字符串和正则表达式断言会使用 `toMatchTextContent`。v4 的字符串匹配器接受部分文本，因此 fixture 中存在相同文本，并不能证明你希望采用 v5 的精确匹配。若要使用新的语义，请自行改用 `toHaveTextContent`。

Node 测试中的 `@testing-library/jest-dom` 断言保持不变。在同时包含 Node 和浏览器测试的包中，迁移会先检查静态项目成员关系，再重命名匹配器。你必须审查共享文件、动态配置和命令行浏览器覆盖项。通过 `expect.element()` 发起的调用可明确识别浏览器断言。

从 `vitest-browser-vue` 和 `vitest-browser-svelte` 导入的 `render` 必须先等待完成，再查询其结果。将 `toThrow('')` 和 `toThrowError('')` 替换为 `/^$/`，以保留对空消息的断言。

以编程方式加载配置时，将 `{ viteConfig, vitestConfig }` 解构替换为 `resolveConfig()` 的返回值及其 `.test` 属性。迁移的直接 `vitest list` 命令会添加 `--no-static-parse`；受支持的 `Vitest.collect(filters, options)` 调用会添加 `{ staticParse: false }`。如果希望使用 v5 的静态收集行为，请保留显式的静态解析选项。

## 基准测试

请使用直接的 `bench` 调用，并传入内联的零参数回调或未改动的本地函数引用。可以使用动态名称；迁移会在注册时捕获一次名称。迁移会保留工作负载回调，并在测试中通过 v5 `bench` fixture 运行。简单的 `bench.skip`、`bench.only` 和 `bench.todo` 调用会转换为对应的测试修饰符。普通 `describe` 和 `suite` 回调中的调用会保留其外围作用域。

```ts
// Before
import { bench } from 'vitest';
bench('parse', () => JSON.parse('{"value":1}'));

// After
import { test } from 'vitest';
test('parse', async ({ bench }) => {
  await bench('parse', () => JSON.parse('{"value":1}')).run();
});
```

请确保基准测试文件仍匹配 `benchmark.include`。`vitest bench` 和 `vp test bench` 命令仍受支持，迁移不会移除它们。

内置的 `benchmark.reporters` 设置（`default` 和 `verbose`），以及字面量 `benchmark.outputFile` 或 `benchmark.outputJson` 路径，可以迁移到顶层 reporter。现有 reporter 目标优先于拟迁移的设置：请手动处理路径冲突、终端 reporter 选择和 JSON 标准输出使用方。项目特定设置、配置合并以及自定义或动态 reporter 也需要审查。在 v5 中，普通测试和基准测试共用 reporter。

对于 `vitest bench --outputJson=bench.json` 这样的字面量命令，迁移会选择 JSON reporter 并保留文件路径。v5 JSON 报告包含测试结果以及每个测试的基准数据。如果在 Vitest 之外读取这些报告，请更新仍按 v4 格式解析的读取程序。

审查带有基准选项、导入或重新赋值的回调、回调参数或包装函数的调用。基线 `compare` 设置和 `--compare` 标志仍属于阻塞项。请设置每个基准的结果存储，并在测试中显式执行比较。替代方式请参阅 [Vitest 基准测试迁移指南](https://vitest.dev/guide/migration/#benchmarking-api-rewrite)和[基准测试指南](https://vitest.dev/guide/benchmarking)。若需比较多个工作负载并生成表格，请使用 `bench.compare()`。

## 入口和软件包

断言和受支持的运行器 API 请使用 `vite-plus/test`。覆盖率提供程序和 `@vitest/ui` 应与捆绑运行器保持完全相同的版本 `5.0.1`。如果项目使用 `@vitest/web-worker`，也请保持版本一致。

| v4 导入                                 | v5 导入或处理方式                                                            |
| ---------------------------------------- | --------------------------------------------------------------------------- |
| `vitest/coverage`, `vitest/reporters`    | `vite-plus/test/node`                                                       |
| `vitest/environments`, `vitest/snapshot` | `vite-plus/test/runtime`                                                    |
| `vitest/mocker`                          | `vite-plus/test/mocker`                                                     |
| `vitest/runners`, `vitest/suite`         | 检查 `vite-plus/test` 中的 `TestRunner` 及其静态方法。                        |
| 与根入口兼容的 `@vitest/expect` 符号       | 使用 `vite-plus/test`；审查不受支持的辅助方法。                               |
| `@vitest/runner`                         | 将受支持的符号迁移到根 API，并审查其余导入。                                  |
| `vitest/internal/module-runner`          | 重新设计集成；目前没有公开的替代方案。                                        |
| `@vitest/ws-client`                      | 如有需要则保留；上游不再为 v5 添加功能。                                      |

Vite+ 1.0 移除了 `vite-plus/test/coverage`、`/reporters`、`/environments` 和 `/snapshot`。运行 `vp migrate` 可将现有 Vite+ 导入重写为上表所示的 `node` 或 `runtime` 入口。Vite+ 保留 `vite-plus/test/mocker`，供独立的 `@vitest/mocker` API 使用。它不提供部分运行器或 expect 插件 shim。

## 社区 WebdriverIO 提供程序

Vite+ 1.0 移除了 `vite-plus/test/browser-webdriverio` 导出。请使用 `@vitest/browser-webdriverio`，并选择支持项目测试的提供程序版本和框架 peer。此软件包由社区独立维护，按自己的发布节奏更新。

`vp migrate` 会将旧版提供程序导入改为 `@vitest/browser-webdriverio`，并确保提供程序版本至少为 `5.0.0`。如果缺少提供程序，会添加 `^5.0.0`；同时升级旧版本，并收窄仍允许 v4 的范围。它也会更新引用的 catalog 条目，并移除强制使用旧提供程序的 override。已经高于此最低版本的版本和范围保持不变。迁移会确保安装必需的 `webdriverio` peer，但不会升级现有框架版本。

对于使用此提供程序的项目，`vp migrate` 会添加与捆绑 Vitest 版本匹配的 `@vitest/browser` override。Yarn 使用 `resolutions`。这样可以避免提供程序的版本范围导致锁文件继续保留较旧的浏览器软件包。

迁移完成后，提供程序升级由你自行管理；Vite+ 不会使社区版本与 Vitest 保持同步。现有的社区软件包导入保持不变。对于迁移器无法验证的自定义依赖，请先解决诊断项，再重试迁移。请参阅[上游软件包迁移指南](https://vitest.dev/guide/migration/#package-migration)。

旧版 Vite+ WebdriverIO 的 `/context` 导入会移至 `vite-plus/test/browser/context`。runtime 浏览器 API 请继续使用此共享入口；社区提供程序的 `/context` 入口只包含类型。

可选 peer 声明仍遵循 Vitest 的依赖元数据。它不会提供 Vite+ 导出，也不会同步提供程序的版本发布。

## 报告和截图

如果改动只影响标题格式、报告输出、产物路径或依赖弃用，迁移不会修改或报告这些内容。它会保留常规 reporter 设置，也不会添加 `stdout: true`。已移除的基准测试 API 和标志仍需迁移，以确保命令可以运行。

如果在 Vitest 之外使用生成的报告或产物，请检查以下路径。只要文件仍位于旧目录，就保留对应的 ignore 条目。迁移会将 `.vitest/` 添加到 `.gitignore`，但不会删除旧条目。

| 输出                | v4 默认值                     | v5 默认值                                 |
| ------------------- | ----------------------------- | ------------------------------------------ |
| 附件                | `.vitest-attachements/`       | `.vitest/attachments/`                     |
| 失败截图            | `__screenshots__/`            | `.vitest/attachments/failure-screenshots/` |
| Blob 报告           | `.vitest-reports/blob-*.json` | `.vitest/blob/blob-*.json`                 |
| HTML                | `html/index.html`             | `.vitest/index.html`                       |
| JSON                | stdout                        | `.vitest/json/output.json`                 |
| JUnit               | stdout                        | `.vitest/junit/output.xml`                 |

HTML reporter 选项现在使用 `outputDir`，而不再使用表示文件路径的 `outputFile`。需要自定义目标目录时，请自行设置 `outputDir`。其他 reporter 仍支持 `outputFile`。请参阅[上游报告变更说明](https://vitest.dev/guide/migration/#generated-reports-and-artifacts-use-the-vitest-directory)。

将自定义的 `browser.screenshotDirectory` 移至 `browser.expect.toMatchScreenshot.screenshotDirectory`。移动或重新生成参考图像前请先审查；v4 可能会将它们保存到意料之外的位置。默认参考截图目录仍为 `__screenshots__`。

## 处理迁移发现项

每个 Vitest v5 的 `BLOCK` 或 `REVIEW` 项都包含 `Docs` 链接。请根据链接查看相关 API 变更或迁移规则。阻塞项会停止依赖更新；审查项需要你检查结果，但不会阻止安全的自动改动。

对于动态配置或共享文件，请在编辑前确定 Vitest 项目实际生效的设置。解析配置函数、展开属性和外部继承关系，或手动进行兼容性改动。在混合运行器项目中，确认未导入的全局变量属于哪个运行器。

对于解析器失败或改动重叠，请保留原文件并手动应用文档说明的变更。解决问题后重新运行 `vp migrate`。即使命令成功退出，也可能仍有审查项；请保留报告，直到完成手动改动。

## 审查清单

根据迁移报告中的文件位置审查这些改动。除 Node 测试外，也请运行浏览器和覆盖率测试套件。

对于 jest-dom 匹配器类型，请在 `compilerOptions.types` 中加载 `@testing-library/jest-dom/vitest`，或从 `tsconfig.json` 包含的 TypeScript 设置文件中导入它。根入口 `@testing-library/jest-dom` 的类型会扩展 Jest。被 `allowJs: false` 排除的 JavaScript 设置文件不会为类型检查加载 Vitest 扩展。更改共享 Jest/Vitest 配置中的类型入口前请先审查。

使用 `vitest@5.0.1` 时，如果先加载浏览器声明，TypeScript 也可能会拒绝有效的 Node jest-dom 断言，例如 `toHaveTextContent(/pattern/)` 和 `toHaveStyle()` 中的 CSS 自定义属性。我们在上游导入和 Vite+ 导入中都复现了此冲突。`@testing-library/jest-dom@6.9.1` 和 `7.0.1` 都会出现此问题。请检查每个测试 `tsconfig.json` 加载的声明；仅添加 jest-dom 类型入口可能无法解决冲突。在 Node 和浏览器匹配器类型分别通过检查前，请让受影响项目继续使用基于 v4 的版本。

| 范围                  | 必需审查内容                                                                                                                                                                               |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 测试选择                | 完整测试名称使用 `>` 分隔。检查跨越套件边界的名称筛选；单段筛选无需审查。                                                                                                                    |
| 提升的 mock             | 检查被捕获的变量后，将嵌套的 `vi.mock`、`vi.unmock` 和 `vi.hoisted` 调用移至顶层。                                                                                                             |
| 浏览器自动 mock         | 不带 factory 的 mock 会保留 mock 默认值。需要真实实现时，请选择 `{ spy: true }`。                                                                                                              |
| 构造函数 mock           | 检查 `vi.fn`、`vi.spyOn` 和 `mockImplementation` 的原型、方法及 `instanceof` 行为。                                                                                                             |
| 基准测试                | 审查迁移无法转换的基准调用、比较组和已移除的报告选项。保留 `benchmark.enabled` 和 `benchmark.include` 等受支持选项。                                                                               |
| 异步断言                | 对 `resolves`、`rejects`、文件快照、poll 和浏览器断言进行等待或返回。审查 `expect.poll` 超时，不要通过延长超时来掩盖失败。                                                                        |
| 匹配器类型              | 根据返回值和接收值类型参数更新旧的 `Assertion<T>`、`Matchers<T>` 和 `jest.Matchers` 声明。                                                                                                      |
| 浏览器命令              | 使用 `SerializedLocator` 对象，而不是选择器字符串。                                                                                                                                           |
| 浏览器 UI               | 使用 Vitest 打印的 URL，包括 UI token 和 orchestrator `sessionId`。在固定 viewport 下检查有头和无头截图。                                                                                       |
| 项目配置                | 检查动态项目、根配置合并、嵌套项目，以及假设每个项目只运行一次服务器或配置的钩子。                                                                                                               |
| 测试收集                | 审查动态命令包装器，以及需要手动修改静态解析选项的编程式 `collect()` 调用。                                                                                                                       |
| 覆盖率                  | 对比配置的 `coverage.include` 和 `coverage.exclude` 在 v4/v5 中解析出的文件集合。相对路径匹配可能改变统计范围。                                                                                   |
| Worker ID              | 审查基于 `VITEST_POOL_ID` 或 `VITEST_WORKER_ID` 的算术和索引；ID 从 1 开始。                                                                                                                     |
| 自定义环境              | 使用 `Object.defineProperty` 恢复 `populateGlobal().originals` 条目；此映射包含属性描述符。                                                                                                      |
| DOM 全局变量            | 检查 jsdom/happy-dom 测试中的赋值；全局变量赋值也会更新 window。                                                                                                                                |
| Temporal               | 审查使用 Temporal 和 `vi.setSystemTime()` 的作用域。没有启用 fake timer 时，`toNotFake` 不会保留原有行为。                                                                                       |
| 已移除 API              | 更新软件包前替换不受支持的运行器和内部导入。类型专用引用仍需审查和类型检查。                                                                                                                       |

## 在配置目录的子目录中运行

Vitest v5 不再向父目录查找配置。从子目录运行时，同时传入父目录中的配置和目标测试目录：

```bash
vp test --config ../vite.config.ts --dir .
```

API 示例和新的基准测试设计请参阅 [Vitest 5 上游迁移指南](https://vitest.dev/guide/migration/)。
