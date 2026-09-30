const localMigrationPrompt = `无需全局安装时，请从工作区根目录通过包管理器运行目标 CLI。对于 1.0.0 版本，使用 \`pnpm dlx --package=vite-plus@1.0.0 vp migrate --no-interactive\` 或 \`npx --package=vite-plus@1.0.0 vp migrate --no-interactive\`。先将命令中的 \`migrate --no-interactive\` 替换为 \`help migrate\`，以阅读帮助。这些命令会获取目标 CLI，不会预先替换旧项目依赖。`;

const compatibilityReviewPrompt = `建立通过的基线后，尝试移除生成的“Vitest v4 兼容设置”，且不改动代码或只进行少量局部修复：

1. 使用迁移差异和生成的注释，找出根配置、工作区配置和内联项目配置中的新增项。阅读每个链接的说明，并检查移除后实际生效的设置，包括继承值。保留原有用户设置，以及来源不明确的设置。
2. 每次只移除一项新增设置，并先在不改动代码的情况下运行受影响的项目和测试套件。如有需要，可进行少量局部的应用、测试或设置修复，同时保持测试意图，例如修正定位器或调整少数测试中的 mock 设置。不要弱化断言、未经审查就接受快照变化，也不要减少测试集。对于 \`fakeTimers.toNotFake\`，只移除新增的 \`Temporal\` 项，保留其他排除项。不要弱化覆盖率约束：即使覆盖率检查通过，也要保留 glob 阈值的 \`perFile: true\`，除非我批准改用汇总检查。
3. 只有在受影响的测试通过，且仍运行相同测试、没有新增跳过项时，才保留移除结果。同时删除该设置生成的注释。如果移除需要大范围修改测试或重构共享设置，请暂时保留兼容设置，并报告后续工作。如果验证仍失败、无法运行，或行为仍不确定，请恢复该设置及其注释。只撤销为清理而进行的试验性改动；保留已完成的迁移修复和无关工作。
4. 将接受的移除合并后，再次运行完整验证命令。逐项报告候选设置的配置路径、移除或保留状态、代码改动、命令及结果，以及保留原因。区分暂缓改写和无法验证的设置。

对于使用 \`vp pack\` 的项目，库构建通过后也要审查生成的“tsdown <0.23 兼容设置”。使用迁移差异和相关注释，区分新插入的设置与原有用户选择。移除 \`deps.resolveDepSubpath: true\` 会按原样保留外部子路径导入；请确认使用者仍能解析生成的导入。移除 \`attw.profile: 'strict'\` 会采用 \`esm-only\` 配置，跳过 \`node10\` 和 CommonJS 解析检查。如果这些检查属于软件包预期支持范围，请保留 \`strict\`。不要仅为使构建通过而放弃预期的声明检查。每次只移除一项设置及其生成的注释，然后运行 \`vp pack\` 和软件包使用者检查。如果验证失败或所需的使用者行为不明确，请恢复该设置及其注释。报告仍保留哪些设置及原因。`;

export const migrationPrompt = `将此项目迁移到 Vite+，同时保留应用、测试和库构建行为。

开始修改前，请阅读以下指南：

- ${__DOCS_ORIGIN__}/guide/migrate
- ${__DOCS_ORIGIN__}/guide/migrate-rules
- ${__DOCS_ORIGIN__}/guide/vitest-v5
- https://vitest.dev/guide/migration/
- https://github.com/rolldown/tsdown/releases/tag/v0.23.0

检查工作区并保留无关改动。确认工作区根目录、包管理器、脚本、配置文件和正在使用的工具。如果项目已使用 Vite+，请按照迁移指南中的升级流程操作并保留现有设置；除非我提出要求，否则不要使用 \`--full\`。

对于尚未使用 Vite+ 的项目，请检查所用工具的前置要求：Vite 8+ 和 Vitest 4.1+。开始 Vite+ 迁移前，先完成所需的上游升级并验证。之后保留这些清单、锁文件和已安装的软件包，以便迁移器识别原始 Vitest 版本。运行迁移前，不要安装 \`vite-plus\`，也不要将 Vitest 升级到目标版本所捆绑的版本。

使用目标 Vite+ 1.0 正式版或预览版中的 CLI。Node.js 运行时请遵循兼容性指南。全局安装不是必需的：

- 如果已全局安装 \`vp\`，请按照 ${__DOCS_ORIGIN__}/guide/upgrade 选择目标版本，并运行 \`vp toolchain --global\` 检查。运行 \`vp help\` 和 \`vp help migrate\` 后，从工作区根目录运行 \`vp migrate --no-interactive\`。
- ${localMigrationPrompt}

将 \`1.0.0\` 替换为目标正式版的版本号。使用预览版时，请使用对应 PR 中的版本，并在 \`vp\` 命令之前向 pnpm 或 npx 传入 \`--registry=https://registry-bridge.viteplus.dev\`。

不要使用旧项目的 \`node_modules/.bin/vp\` 运行迁移。从工作区根目录迁移 monorepo，以保持共享清单、catalog、override 和锁文件一致。

解决所有 \`BLOCK\` 项后重新运行迁移。即使迁移成功退出，也要根据链接的指南审查每个 \`REVIEW\` 项和手动迁移警告。首次验证时，请保留生成的 Vitest v4 和 tsdown <0.23 兼容设置及其注释。

根据迁移规则审查生成的改动：

- 确认 Vite 和测试导入使用受支持的 \`vite-plus\` 与 \`vite-plus/test*\` 入口。类型扩展保留上游模块标识，社区维护的 WebdriverIO 提供程序使用 \`@vitest/browser-webdriverio\`。
- 保留迁移器配置的依赖、别名、catalog 和 override。对于 pnpm，保留配置的 \`vite\` 和 \`vitest\` 条目。迁移规则要求保留的上游软件包也不要移除。
- 将剩余的工具专属配置移至 \`vite.config.ts\` 中对应的配置块。检查 lint、格式化、打包和钩子的手动后续工作，不要丢弃项目特定行为。
- 区分内置命令和任务：\`vp dev\` 和 \`vp test\` 运行内置工具；\`vp run dev\` 和 \`vp run test\` 运行对应的项目脚本或任务。\`packageManager\` 字段会决定 \`vp install\`、\`vp add\` 和 \`vp remove\` 使用的包管理器。

运行 \`vp install\`、\`vp check\` 和 \`vp test\`，并运行已配置的浏览器、覆盖率和基准测试套件。应用运行 \`vp build\`，库运行 \`vp pack\`；工作区同时包含两者时，两种构建都要运行。结合生成的导入和声明检查库的使用者。未全局安装 CLI 时，请使用项目的包管理器安装依赖，并通过它调用更新后的本地 CLI，例如 \`pnpm exec vp check\` 或 \`npm exec -- vp check\`。修复失败时，不要弱化断言或减少测试覆盖。

${compatibilityReviewPrompt}

报告迁移改动、验证结果、保留的兼容设置和未解决的问题。除非我提出要求，否则不要提交或推送。`;

export const upgradePrompt = `将此项目从 Vite+ 0.3.x 升级到 Vite+ 1.0，同时保留测试和库构建行为。

开始修改前，请阅读以下指南：

- ${__DOCS_ORIGIN__}/guide/migrate
- ${__DOCS_ORIGIN__}/guide/vitest-v5
- https://vitest.dev/guide/migration/
- ${__DOCS_ORIGIN__}/guide/migrate-rules#pack-configuration
- https://github.com/rolldown/tsdown/releases/tag/v0.23.0

检查工作区并保留无关改动。保留原始清单、锁文件和已安装的软件包，以便迁移识别原始 Vitest 版本。运行迁移前，不要更新项目的 \`vite-plus\` 或 Vitest 依赖。

使用目标 Vite+ 1.0 正式版或预览版中的 CLI。全局安装不是必需的。Node.js 运行时请遵循 Vite+ 兼容性指南。

- 如果已全局安装 \`vp\`，请按照 ${__DOCS_ORIGIN__}/guide/upgrade 升级，并运行 \`vp toolchain --global\` 检查。运行 \`vp help migrate\` 后，从工作区根目录运行 \`vp migrate --no-interactive\`。
- ${localMigrationPrompt}

将 \`1.0.0\` 替换为目标正式版的版本号。使用预览版时，请使用对应 PR 中的版本，并在 \`vp\` 命令之前向 pnpm 或 npx 传入 \`--registry=https://registry-bridge.viteplus.dev\`。不要使用旧项目的 \`node_modules/.bin/vp\` 运行迁移。保留现有项目设置；除非我提出要求，否则不要使用 \`--full\`。

解决所有 \`BLOCK\` 项后重新运行迁移。即使迁移成功退出，也要根据文档链接审查每个 \`REVIEW\` 项。保持测试意图，并在首次验证时保留生成的 Vitest v4 和 tsdown <0.23 兼容设置及其注释。

根据 Vite+ 指南检查工作区清单、catalog、override 和导入变更。测试 API 使用受支持的 \`vite-plus/test\` 入口；社区维护的 WebdriverIO 提供程序使用 \`@vitest/browser-webdriverio\`。

运行 \`vp install\`、\`vp check\` 和 \`vp test\`，并运行项目中已配置的浏览器、覆盖率和基准测试套件。根据项目类型运行 \`vp build\` 或 \`vp pack\`。未全局安装 CLI 时，请使用项目的包管理器完成安装，然后通过它调用更新后的本地 CLI，例如 \`pnpm exec vp check\` 或 \`npm exec -- vp check\`。修复迁移失败时，不要弱化断言或减少测试覆盖。

${compatibilityReviewPrompt}

同时报告迁移改动和未解决的问题。除非我提出要求，否则不要提交或推送。`;

// Shared by the homepage and Getting Started guide.
export const setupPrompt = `我想在项目中使用 Vite+。Vite+ 是由 \`vp\` CLI 提供的 Web 统一工具链，用一个工具整合 Vite、Rolldown、Vitest、tsdown、Oxlint、Oxfmt 和 Vite Task，并提供运行时和包管理器管理功能。

首先，阅读 ${__DOCS_ORIGIN__}/llms-full.txt 和 ${__DOCS_ORIGIN__}/guide，了解 Vite+ 的命令和配置。检查工作区并保留无关改动。判断我想创建新项目，还是迁移或升级现有项目。只遵循下方匹配的流程。

对于新项目：

阅读 ${__DOCS_ORIGIN__}/guide/create，并为项目选择模板、目标目录、包管理器以及目标 Vite+ 正式版或预览版。根据目标 CLI 的 \`help create\` 输出选择受支持的选项。使用 \`vp create\` 创建项目；不要覆盖现有项目文件。

全局安装不是必需的。如果系统中尚未提供全局 \`vp\` CLI，可通过以下方式安装：
- macOS / Linux: curl -fsSL ${__DOCS_INSTALL_SH_URL__} | bash
- Windows (PowerShell): irm ${__DOCS_INSTALL_PS1_URL__} | iex

安装后打开新的终端。脚手架创建前，请按照 ${__DOCS_ORIGIN__}/guide/upgrade 选择目标正式版或预览版，并运行 \`vp toolchain --global\` 检查。

未全局安装时，请使用兼容性指南中受支持的 Node.js 运行时。对于 1.0.0 正式版，请运行 \`pnpm dlx --package=vite-plus@1.0.0 vp create\` 或 \`npx --package=vite-plus@1.0.0 vp create\`。将 \`1.0.0\` 替换为目标正式版的版本号。使用预览版时，请使用对应 PR 中的版本，并在 \`vp\` 命令之前向 pnpm 或 npx 传入 \`--registry=https://registry-bridge.viteplus.dev\`。

运行 \`vp install\`、\`vp check\` 和 \`vp test\`，然后应用运行 \`vp build\`，库运行 \`vp pack\`。未全局安装 CLI 时，请使用项目的包管理器安装依赖，并通过它运行本地 CLI，例如 \`pnpm exec vp check\` 或 \`npm exec -- vp check\`。说明如何使用 \`vp dev\` 启动开发服务器，以及使用 \`vp run <task>\` 运行项目脚本或任务。报告设置变更、验证结果和剩余工作。除非我提出要求，否则不要提交或推送。

对于现有项目（包括已经使用 Vite+ 的项目），请遵循以下迁移或升级说明：

${migrationPrompt}`;
