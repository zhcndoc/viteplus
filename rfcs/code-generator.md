# RFC: Vite+ 代码生成器

## 背景

参考：

- [Nx Code Generation](https://nx.dev/docs/features/generate-code)
- [Turborepo Code Generation](https://turborepo.com/docs/guides/generating-code)
- [Bingo Framework](https://www.create.bingo/about)

代码生成器功能对于公司持续迭代的 monorepo 来说是一项核心能力。没有它，新项目只能通过手动复制粘贴再修改文件来创建，这很可能会遗漏一些必要的变更，导致生成的项目不可用。

## 现有方案对比

| 功能                         | Nx                                        | Turbo                                        | Bingo                                                                               |
| ---------------------------- | ----------------------------------------- | -------------------------------------------- | ----------------------------------------------------------------------------------- |
| 生成器方案                   | Nx 插件的 generator 功能                  | 基于 [PLOP](https://plopjs.com/) 的封装     | 具有类型安全选项的仓库模板引擎                                                     |
| monorepo 复用                | ✅                                        | ✅                                           | ✅                                                                                  |
| 模板引擎                     | [EJS](https://github.com/nrwl/nx)         | Handlebars                                   | [模板字面量](https://www.create.bingo/build/concepts/templates) / Handlebars      |
| 输入校验                     | schema.json                               | validate(input): true \| string              | Zod schemas（类型安全）                                                           |
| 高级功能                     | 用于文件操作的 Tree API                   | 中等                                         | 网络请求、shell 脚本、blocks/presets                                              |
| 实现复杂度                   | 高（通过 @nx/devkit tree 操作）           | 中等                                         | 中等（基于 TypeScript）                                                           |
| 类型安全                     | 中等（JSON Schema）                        | 低（JavaScript）                             | 高（Zod + TypeScript）                                                            |

## 为什么选择 Bingo 的方案？

Bingo 提供了若干优势：

1. **类型安全**：使用 Zod schemas 和 TypeScript 进行编译期校验
2. **现代架构**：从零开始采用现代 JavaScript/TypeScript 构建
3. **灵活**：支持从简单模板到复杂的基于 block 的系统
4. **可扩展**：除了文件生成，还可以执行网络请求和 shell 脚本
5. **双模式**：Setup（创建新项目）和 Transition（更新现有项目）模式
6. **可测试**：内置测试工具，便于模板开发
7. **现有生态**：可以直接运行 npm 上现成的 bingo 模板

## 集成策略：双模式支持

**关键决策**：`vp create` 通过智能迁移同时支持 bingo 模板和任何现有的 `create-*` 模板：

### 编写生成器的两种方式

**选项 1：Bingo 模板（推荐用于自定义生成器）**

最适合在 monorepo 内创建**可复用的本地生成器**：

```bash
# 运行 workspace 本地 bingo 生成器
vp create @company/generator-ui-lib

# 或任意来自 npm 的 bingo 模板
vp create create-typescript-app
```

**为什么使用 bingo**：

- ✅ **更容易编写**：使用 Zod schemas，具备类型安全
- ✅ **更好的开发体验**：对文件生成拥有完全控制
- ✅ **可测试**：内置测试工具
- ✅ **快速开始**：使用 `@vite-plus/create-generator` 搭建生成器脚手架
- ✅ **非常适合**：公司内部特定的模式和规范

**选项 2：通用模板（任何 create-\* 包）**

运行生态中的**任意**现有 `create-*` 模板：

```bash
# 运行任意现有模板
vp create create-vite
vp create create-next-app
vp create create-nuxt
```

**为什么使用通用模板**：

- ✅ **无需额外工作**：直接使用现有模板
- ✅ **零学习成本**：使用熟悉的模板
- ✅ **生态巨大**：有成千上万个模板可用
- ✅ **无需维护**：由模板作者自行维护

### 所有模板的自动迁移

**重要**：无论使用 bingo 还是通用模板，**所有生成的代码都会经过相同的自动检测和迁移逻辑**：

```
任意模板（bingo 或通用）
  ↓
模板生成代码
  ↓
Vite+ 自动检测 vite 相关工具 + lint/format 工具：
  • 独立的 vite、vitest、oxlint、oxfmt
  • ESLint（flat config）和 Prettier
  ↓
自动迁移到统一的 vite-plus：
  • ESLint → oxlint（通过 @oxlint/migrate）— 生成 .oxlintrc.json
  • Prettier → oxfmt — 生成 .oxfmtrc.json
  • 依赖：vite + vitest + oxlint + oxfmt → vite-plus
  • 配置：合并 vitest.config.ts、.oxlintrc、.oxfmtrc → vite.config.ts
  • 将 lint-staged 条目重写为 vp lint / vp fmt
  ↓
monorepo 集成：
  • 提示选择 workspace 依赖
  • 更新 workspace 配置（pnpm-workspace.yaml、package.json 等）
```

**自动迁移的范围**：

- ✅ 将 vite/vitest/oxlint/oxfmt 依赖整合为 vite-plus
- ✅ 将工具配置合并到 vite.config.ts
- ✅ 当模板带有 ESLint flat config 时，通过 `@oxlint/migrate` 迁移 ESLint → oxlint
- ✅ 当模板带有 Prettier 时迁移 Prettier → oxfmt
- ❌ 不会创建 vite-task.json（可选的独立功能）
- ❌ 不会更改 TypeScript 配置（保持生成后的状态）

**Bingo 模板会得到相同的迁移处理**——区别只是 bingo 更容易编写具备类型安全和测试能力的生成器。

### 工作方式

```
┌──────────────────────────┐
│  vp create <name>         │
└───────────┬──────────────┘
            │
      ┌─────▼─────────┐
      │ 检测并加载    │
      │ 模板类型      │
      └─────┬─────────┘
            │
    ┌───────┴────────┐
    │                │
┌───▼──────┐   ┌─────▼──────┐
│  Bingo   │   │ 通用模板   │
│ Template │   │ (create-*) │
└───┬──────┘   └─────┬──────┘
    │                │
    └────────┬───────┘
             │
      ┌──────▼─────────┐
      │ 执行           │
      │ 模板           │
      └──────┬─────────┘
             │
      ┌──────▼─────────────┐
      │ 自动检测          │
      │ 生成的代码         │
      │（所有模板）       │
      └──────┬─────────────┘
             │
      ┌──────▼─────────────┐
      │ 自动迁移          │
      │ • vite-tools      │
      │   → vite-plus     │
      │ • ESLint → oxlint │
      │ • Prettier → oxfmt│
      └──────┬─────────────┘
             │
      ┌──────▼─────────────┐
      │ monorepo          │
      │ 集成              │
      │ • Workspace 依赖  │
      │ • 更新配置        │
      └────────────────────┘
```

## monorepo 专属增强

任何模板运行后，Vite+ 都会添加 monorepo 专属功能：

### 1. 自动迁移到 vite-plus 统一工具链 + oxlint/oxfmt（适用于所有模板）

**在任意模板运行后**（bingo 或通用），Vite+ 会自动检测独立的 vite 相关工具 _以及_ ESLint/Prettier，并将它们迁移到统一的 Vite+ 工具链（vite-plus + oxlint + oxfmt）。

**目的**：让脚手架生成的项目直接落到 `vp migrate` 所生成的同一工具链上——这样用户就不需要再额外执行一次 `vp migrate`。

```bash
$ vp create create-vite --template react-ts

# create-vite 正常运行...
✔ 项目名称：› my-app
✔ 选择框架：› React
✔ 选择变体：› TypeScript

正在 ./packages/my-app 中搭建项目脚手架...

# 模板完成后，Vite+ 检测独立工具
◇  模板已完成！正在检测 vite 相关工具...
│
◆  检测到独立的 vite 工具：
│  ✓ vite ^5.0.0
│  ✓ vitest ^1.0.0
│
◆  升级到 vite-plus 统一工具链？
│
│  这将会：
│  • 将 vite + vitest 依赖替换为单一的 vite-plus 依赖
│  • 合并 vitest.config.ts → vite.config.ts（test 部分）
│  • 删除 vitest.config.ts
│
│  好处：
│  • 简化依赖管理（1 个依赖替代 2 个及以上）
│  • 在 vite.config.ts 中统一配置
│  • 更好地与 Vite+ 任务运行器和缓存集成
│
│  ● 是 / ○ 否
│
◇  正在迁移到 vite-plus...
│  ✓ 已更新 package.json（vite + vitest → vite-plus）
│  ✓ 已合并 vitest.config.ts → vite.config.ts
│  ✓ 已删除 vitest.config.ts
│
# 然后 Vite+ 迁移 ESLint → oxlint（模板带有 eslint.config.js）
# 不会提示确认——Vite+ 对 oxlint 有明确偏好，因此会自动执行迁移。
◇  正在迁移 ESLint → Oxlint...
│  ✓ 已根据 eslint.config.js 生成 .oxlintrc.json
│  ✓ 已将 `eslint-disable` 注释重写为 `oxlint-disable`
│  ✓ 已删除 eslint.config.js 和 eslint devDependency
│  ✓ 已将 `"lint": "eslint ."` 重写为 `"lint": "vp lint"`
│
└  迁移完成！
```

**自动迁移的范围**：

结合了**依赖整合**与**lint/format 工具迁移**——也就是 `vp migrate` 对现有项目所做的同样工作，在脚手架生成后自动应用。

✅ **它会做什么**：

- 将独立的 vite/vitest/oxlint/oxfmt 依赖整合为单一的 vite-plus 依赖
- 合并 vitest.config.ts → vite.config.ts（test 部分）
- 合并 .oxlintrc → vite.config.ts（oxlint 部分）
- 合并 .oxfmtrc → vite.config.ts（oxfmt 部分）
- 删除冗余的独立配置文件
- 将 ESLint 配置 + 依赖 + 脚本迁移到 oxlint（委托给 `@oxlint/migrate`）
- 将 Prettier 配置 + 依赖 + 脚本迁移到 oxfmt
- 将 lint-staged 条目重写为 `vp lint` / `vp fmt`

❌ **它不会做什么**：

- 不会创建 vite-task.json（独立功能，不是必需的）
- 不会更改 TypeScript 配置（保持生成后的状态）
- 不会修改构建工具（webpack/rollup → vite）
- 不会迁移旧版 ESLint（`.eslintrc.*`）——会打印警告，要求用户先升级到 ESLint v9 flat config，与 `vp migrate` 的行为一致

**这样设计的原因**：

- Vite+ 对 linting 和 formatting 有明确偏好：oxlint + oxfmt 是默认工具链。新脚手架生成的项目就应该直接使用这套工具链——如果还要让用户第二步再执行 `vp migrate`，就失去了意义。
- 在 `vp create` 中，ESLint/Prettier 迁移在交互模式下也**不会**弹出确认提示。这与 `vp migrate` 不同（后者会提示，因为用户已有项目且可能有自己的偏好）——对于一个全新的应用，选择已经在脚手架阶段通过 Vite+ 完成。
- 复用 `vp migrate` 的辅助函数可以把规范和实现统一到一个地方，并保证与迁移命令完全一致。
- 使用与其他工具无关的模板（Jest、webpack、rollup）将保持不变。

**由 [ast-grep](https://ast-grep.github.io/) 提供支持的迁移引擎**：

- 通过结构化搜索和替换实现准确的代码转换
- 基于 YAML 的规则，便于维护
- 安全、可逆的转换
- **注意**：使用与 `vp migrate` 命令相同的迁移引擎（参见 [migration-command.md](./migration-command.md)）

### 2. 目标目录选择（monorepo）

在 monorepo workspace 中运行 `vp create` 时，Vite+ 会提示用户选择将新包创建到哪个父目录中：

```bash
$ vp create create-vite

◆  我们应该在哪里创建新包？
│  ○ apps/        (Applications)
│  ● packages/    (Shared packages)
│  ○ services/    (Backend services)
│  ○ tools/       (Development tools)
│
◇  已选择：packages/
│
# 模板运行...
✔ 项目名称：› my-lib
```

**工作方式**：

- 通过锁文件检测包管理器（pnpm-lock.yaml、package-lock.json、yarn.lock、bun.lockb）
- 读取 workspace 配置：
  - **pnpm**：读取 `pnpm-workspace.yaml` → `packages` 字段
  - **npm/yarn**：读取根目录 `package.json` → `workspaces` 字段
  - **bun**：读取根目录 `package.json` → `workspaces` 字段
- 从模式中提取父目录（例如 `apps/*`、`packages/*`）
- 提示用户选择一个
- 将所选目录传递给模板（如果模板支持目录选项）
- 或在运行模板前切换工作目录

**好处**：

- 在 monorepo 中组织更清晰
- 用户不需要记住目录结构
- 与 workspace 组织方式保持一致
- 可通过 `--directory` 标志跳过：`vp create create-vite --directory=packages`

### 3. Workspace 依赖提示

受 [Turbo 的生成器](https://turborepo.com/docs/guides/generating-code) 启发，Vite+ 会提示用户选择现有的 workspace 包作为依赖：

```bash
$ vp create @company/generator-ui-lib --name=design-system

◇ 库名称：design-system
◇ 框架：React
◇ 包含 Storybook？Yes

◆ 将 workspace 包添加为依赖？
│  ◼ @company/theme
│  ◼ @company/utils
│  ◻ @company/icons
│  ◻ @company/hooks
└

✅ 已创建 design-system，依赖如下：
   - @company/theme@workspace:*
   - @company/utils@workspace:*
```

此功能：

- **自动发现** workspace 中的所有包
- **交互式选择**，使用多选复选框界面
- **智能默认值**，基于包类型或命名约定
- **正确的版本范围**，使用 `workspace:*` 协议
- **在生成后自动更新** package.json

## 核心概念

### 1. 模板

模板描述了如何在给定一组选项的情况下初始化或修改仓库。

```typescript
import { createTemplate } from 'bingo';
import { z } from 'zod';

export default createTemplate({
  // 使用 Zod 模式定义选项，确保类型安全
  options: {
    name: z.string().describe('包名'),
    directory: z.enum(['apps', 'packages']).default('packages'),
    framework: z.enum(['react', 'vue', 'svelte']).default('react'),
  },

  // 可选：准备默认值
  async prepare({ fs, options }) {
    return {
      name: options.name || (await fs.readdir('.').then((d) => d[0])),
    };
  },

  // 核心生产函数
  async produce({ options }) {
    const projectPath = `${options.directory}/${options.name}`;

    return {
      files: {
        [`${projectPath}/package.json`]: JSON.stringify(
          {
            name: options.name,
            version: '0.0.1',
            dependencies: {
              [options.framework]: 'latest',
            },
          },
          null,
          2,
        ),
        [`${projectPath}/src/index.ts`]: `export const app = '${options.name}';`,
      },
      scripts: [
        { phase: 0, commands: [`cd ${projectPath}`, 'vp install'] },
        { phase: 1, commands: ['vp build'] },
      ],
      suggestions: [
        `✅ 已在 ${projectPath} 中创建 ${options.name}`,
        `下一步：cd ${projectPath} && vp dev`,
      ],
    };
  },

  // 设置模式：为新仓库添加额外逻辑
  async setup({ options }) {
    return {
      requests: [
        {
          url: 'https://api.github.com/repos/:owner/:repo/labels',
          method: 'POST',
          body: { name: 'vite-plus', color: 'ff6b6b' },
        },
      ],
    };
  },

  // 迁移模式：用于更新现有仓库的逻辑
  async transition({ options }) {
    return {
      scripts: [
        {
          phase: 0,
          commands: ['rm -rf old-config'],
          silent: true, // 如果文件不存在则不要报错
        },
      ],
    };
  },
});
```

### 2. Creation

Creation 是模板生成的仓库变更的内存表示。

**结构：**

```typescript
interface Creation {
  // 直接变更（始终应用）
  files?: Files; // 层级化文件结构
  requests?: Request[]; // 网络 API 调用
  scripts?: Script[]; // Shell 命令

  // 间接指导
  suggestions?: string[]; // 手动步骤提示
}
```

**文件格式：**

```typescript
// 字符串会变成文件，对象会变成目录
const files = {
  'README.md': '# My App',
  src: {
    'index.ts': 'export {}',
    utils: {
      'helpers.ts': 'export const helper = () => {}',
    },
  },
};
```

**带阶段的脚本：**

```typescript
const scripts = [
  // 阶段 0：最先运行
  { phase: 0, commands: ['vp install'] },
  { phase: 0, commands: ['git init'] },

  // 阶段 1：在阶段 0 完成后运行
  { phase: 1, commands: ['vp build'] },
  { phase: 1, commands: ['vp fmt'] },
];
```

### 3. 模式

模板有两种运行模式：

**设置模式**：创建一个全新的仓库

- 运行 `setup()` 函数以生成额外内容
- 创建 GitHub 仓库（如果已配置）
- 使用初始提交初始化 git

**迁移模式**：更新一个现有仓库

- 运行 `transition()` 函数执行迁移逻辑
- 可选地清理旧文件
- 保留现有的 git 历史

CLI 会根据是否在现有仓库中运行自动推断正确的模式。

### 4. Block 和 Preset

对于具有许多可配置特性的复杂模板，请使用 Stratum 引擎：

```typescript
import { createStratumTemplate } from 'bingo-stratum';

export default createStratumTemplate({
  // 定义 blocks（独立功能）
  blocks: {
    linting: createBlock({
      about: { name: 'ESLint 配置' },
      produce: ({ options }) => ({
        files: {
          '.eslintrc.json': JSON.stringify({ extends: ['eslint:recommended'] }),
        },
      }),
    }),

    testing: createBlock({
      about: { name: 'Vitest 设置' },
      produce: ({ options }) => ({
        files: {
          'vitest.config.ts': 'export default {}',
        },
      }),
    }),
  },

  // 定义 presets（block 组合）
  presets: {
    minimal: { blocks: [] },
    common: { blocks: ['linting'] },
    everything: { blocks: ['linting', 'testing'] },
  },

  // 建议的默认值
  suggested: 'common',
});
```

### 5. 输入

输入是用于数据检索和处理的可组合单元：

```typescript
import { createInput } from 'bingo';

const readPackageJson = createInput({
  async produce({ fs }) {
    const content = await fs.readFile('package.json', 'utf-8');
    return JSON.parse(content);
  },
});

const detectFramework = createInput({
  async produce({ take }) {
    const pkg = await take(readPackageJson);

    if (pkg.dependencies?.react) return 'react';
    if (pkg.dependencies?.vue) return 'vue';
    if (pkg.dependencies?.svelte) return 'svelte';

    return 'vanilla';
  },
});
```

## 交互模式

当运行不指定模板的 `vp create` 时，用户会进入交互模式，并看到一个精美的模板选择界面。

### 模板选择菜单

交互模式会展示一个精选的已知模板列表：

```bash
$ vp create

┌  🎨 Vite+ 代码生成器
│
◆  你想使用哪个模板？
│  ○ Vite+ Monorepo（创建一个新的 Vite+ monorepo 项目）
│  ○ Vite+ Generator（脚手架一个新的代码生成器）
│  ○ Vite（创建 vite 应用和库）
│  ○ TanStack Start（创建 TanStack 应用和库）
│  ● Other（输入自定义模板包名）
└
```

### 带自动配置的已知模板

交互模式包含预配置模板，并会自动注入参数：

| 模板选项           | 内置别名                 | 描述                                  |
| ------------------ | ------------------------ | ------------------------------------- |
| **Vite+ Monorepo**  | `vite:monorepo`          | 创建一个新的 Vite+ monorepo 项目      |
| **Vite+ Generator** | `vite:generator`         | 脚手架一个新的代码生成器              |
| **Vite**            | `create-vite`            | 创建 vite 应用和库                    |
| **TanStack Start**  | `@tanstack/create-start` | 创建 TanStack 应用和库                |
| **Other**           | _(用户输入)_             | 自定义模板包名                        |

### 自定义模板输入

当选择 “Other” 时，用户可以输入任意 npm 模板：

```bash
◆  你想使用哪个模板？
│  ● Other（输入自定义模板包名）
│
◇  输入模板包名：
│  create-next-app
│
◇  正在发现模板：create-next-app
...
```

### 优势

- **可发现性**：用户无需文档即可浏览可用模板
- **易用性**：无需记住精确的模板名称或参数
- **引导式体验**：清晰的提示帮助用户选择合适的模板
- **灵活性**：“Other” 选项允许使用任何 npm 模板
- **一致性**：相同的后处理（迁移、monorepo 集成）适用于所有模板

## CLI 用法

```bash
# 交互模式 - 提示选择模板
vp create

# 内置 Vite+ 模板
vp create vite:monorepo                               # Vite+ monorepo
vp create vite:generator                              # Vite+ 生成器脚手架
vp create vite:application                            # Vite+ 应用
vp create vite:library                                # Vite+ 库

# 直接运行已知模板
vp create create-vite                                 # Vite 应用/库
vp create @tanstack/create-start                      # TanStack 应用/库

# 运行来自 npm 的任意模板
vp create create-next-app          # Next.js
vp create create-nuxt              # Nuxt
vp create create-typescript-app    # TypeScript（bingo）
vp create @company/generator-api   # 工作区本地 bingo 生成器

# 运行内置 Vite+ 生成器
vp create vite:monorepo
vp create vite:generator
vp create vite:application
vp create vite:library

# 透传模板选项（使用 -- 分隔符）
vp create create-vite -- --template react-ts
vp create create-next-app -- --typescript --app

# 控制迁移（Vite+ 选项，位于 -- 之前）
vp create create-vite --no-migrate                    # 跳过所有迁移
vp create create-vite --migrate=vite-plus             # 仅迁移到 vite-plus

# 控制目标目录（Vite+ 选项，位于 -- 之前）
vp create create-vite --directory=packages            # 跳过目录选择

# 控制工作区依赖（Vite+ 选项，位于 -- 之前）
vp create create-vite --deps=@company/utils,@company/logger  # 预先选择
vp create create-vite --no-prompt                     # 跳过工作区依赖提示

# 组合 Vite+ 选项和模板选项
vp create create-vite --directory=apps --no-migrate --deps=@company/utils -- --template react-ts

# 列出可用模板
vp create --list               # 显示内置和热门模板
vp create --list --all         # 显示所有已安装模板

# 试运行（显示将生成/迁移的内容）
vp create create-vite --dry-run

# 结合模板选项
vp create create-vite --dry-run -- --template vue-ts

# 帮助
vp create --help

# 别名
vite g
vp createerate
```

## @vite-plus/create-generator 脚手架

为了让用户更容易创建自定义生成器，我们提供了 `@vite-plus/create-generator` —— 一个可生成完整生成器包的 bingo 模板。

### 它会生成什么

```
tools/generators/{generator-name}/
├── package.json              # 预配置了 bingo、zod、bin 入口
├── bin/
│   └── index.js              # CLI 入口点
├── src/
│   ├── template.ts           # 带示例代码的主模板
│   └── template.test.ts      # 使用 bingo/testers 的测试示例
├── tsconfig.json             # TypeScript 配置
└── README.md                 # 使用与自定义指南
```

### 脚手架模板

```typescript
// 生成的 src/template.ts 包含有用的示例和注释
import { createTemplate } from 'bingo';
import { z } from 'zod';

export default createTemplate({
  about: {
    name: '{Generator Name}',
    description: '{Description}',
  },

  // TODO：使用 Zod 模式定义你的选项
  options: {
    name: z.string().describe('包名'),
    // 根据需要添加更多选项
  },

  // TODO：自定义文件生成逻辑
  async produce({ options }) {
    return {
      files: {
        // 定义要生成的文件
        [`{output-path}/package.json`]: JSON.stringify(
          {
            name: options.name,
            version: '0.1.0',
          },
          null,
          2,
        ),
      },
      scripts: [
        // 可选：添加生成后要运行的脚本
      ],
      suggestions: [
        // 可选：为用户添加建议
        `✅ 已创建 ${options.name}`,
      ],
    };
  },
});
```

### 用法

```bash
# 第 1 步：创建生成器脚手架
vp create @vite-plus/create-generator

# 第 2 步：自定义模板
cd tools/generators/your-generator
# 编辑 src/template.ts

# 第 3 步：测试你的生成器
vp create @company/your-generator

# 第 4 步：运行测试
vp test
```

### 优势

该脚手架可帮你省去：

- ✅ 使用正确的 bin 入口设置 package.json
- ✅ 为生成器配置 TypeScript
- ✅ 编写样板 bingo 模板代码
- ✅ 搭建测试基础设施
- ✅ 创建 README 文档

你将获得：

- ✅ 带注释的可运行示例模板
- ✅ 完整的测试设置
- ✅ TypeScript 配置
- ✅ 可随时根据需要自定义

## 技术实现细节

### 检测生成的项目目录

**挑战**：运行模板命令后，我们需要知道创建了哪个目录，以便应用迁移。

**解决方案**：使用 `fspy`（一个 Rust 文件系统监控 crate）在模板执行期间监控文件操作，然后从文件路径推导出项目目录。

#### fspy 的作用

**核心功能**：

- 在模板执行期间实时监控特定文件操作（package.json 的读/写）
- 捕获 package.json 被写入或读取时的路径
- 提供 package.json 操作的事件流
- 高效的基于事件的监控，无需轮询

**Vite+ 如何使用它**：

1. 在执行模板之前启动 fspy 监听器以监控 package.json 操作
2. 执行模板（模板会在新项目中创建 package.json）
3. 捕获 package.json 的写入/创建路径（例如 `packages/my-app/package.json`）
4. 在模板完成时停止监听器
5. **从 package.json 路径推导项目目录**（例如，从 `packages/my-app/package.json` → 提取 `packages/my-app`）
6. 使用检测到的目录进行后续迁移和工作区集成

**推导逻辑**：

- 监控 package.json 文件的写入/创建操作
- 当 package.json 被写入时，捕获其完整路径
- 从路径中提取父目录（`/package.json` 之前的所有内容）
- 这就是项目目录

**示例**：

```
捕获到的文件操作：
- packages/my-app/package.json      ← 写入

推导出的项目目录：packages/my-app
```

**使用 fspy 的好处**：

- ✅ 在模板执行期间实时检测
- ✅ 准确——每个模板都会创建 package.json
- ✅ 高效——只监控 package.json，而不是所有文件
- ✅ 简单——package.json 路径直接揭示项目目录
- ✅ 适用于所有模板，无论输出格式如何
- ✅ 基于 Rust 的性能

**为什么这很必要**：

在检测到项目目录后，我们可以：

1. **在正确的位置应用迁移**
2. **在正确的项目中更新 package.json**
3. **在工作区配置中注册路径**（pnpm-workspace.yaml 或 package.json）
4. **显示正确的下一步操作**，包括准确的 `cd` 命令

## 实现架构

### 目录结构

```
packages/
└── vite-generator/
    ├── src/
    │   ├── index.ts            # 主入口
    │   ├── cli.ts              # CLI 命令处理器
    │   ├── runner.ts           # 通用模板运行器
    │   ├── discovery.ts        # 模板/包发现
    │   ├── executor.ts         # 使用 fspy 监控执行模板
    │   ├── detector.ts         # 检测生成的代码模式
    │   ├── migrator.ts         # 使用 ast-grep 应用迁移
    │   ├── workspace.ts        # 单体仓库集成
    │   ├── dependencies.ts     # 工作区依赖选择
    │   └── directory.ts        # 项目目录检测
    ├── migrations/             # 迁移规则（YAML）
    │   ├── vite-build.yaml
    │   ├── eslint-to-oxlint.yaml
    │   ├── vitest-config.yaml
    │   └── typescript-config.yaml
    ├── package.json
    └── tsconfig.json
```

**关键依赖**：

- `fspy` - 用于检测已创建目录的文件系统监控
- `@ast-grep/napi` - 基于 AST 的代码转换
- `@clack/prompts` - 美观的 CLI 提示
- `commander` - CLI 参数解析
- `yaml` - 解析 pnpm-workspace.yaml
- `minimatch` 或 `micromatch` - 用于工作区模式的 Glob 模式匹配

### 模板发现

模板可以位于多个位置：

1. **内置脚手架**：`@vite-plus/create-generator` - 用于创建新生成器的脚手架
2. **工作区包**：单体仓库中的生成器（例如 `@company/generator-api`、`tools/create-microservice`）
3. **npm 包**：来自 npm 的任何模板——bingo templates、create-\* templates 等
4. **内置 Vite+**：可选的、面向单体仓库的生成器（例如 `vite:application`）

**解析顺序：**

```
1. 检查名称是否为 "@vite-plus/create-generator" → 生成器脚手架
2. 检查名称是否以 "vite:" 开头 → 内置 Vite+ 生成器
3. 在工作区包中查找匹配名称 → 工作区本地生成器
4. 检查 node_modules/{name}/package.json → 已安装模板（任意类型）
5. 检查它是否是 npm 包名 → 提示从注册表安装
6. 错误：未找到模板
```

**模板类型检测**：

- **已注册**：列在单体仓库 `vite.config.ts` 中的 `create.templates` 里（本地模板的唯一来源）。
- **Bingo 模板**：具有 `bingo` 依赖，因此运行时会附加 `--skip-requests`（仅作为执行提示）。
- **通用模板**：在 package.json 中有 `bin` 条目。
- 所有模板都以相同方式执行，并获得相同的后处理。

**工作区结构示例：**

```
monorepo/
├── apps/                  # 应用（用户可选择）
│   └── web-app/
├── packages/              # 共享包（用户可选择）
│   └── shared-lib/
├── services/              # 后端服务（用户可选择）
├── tools/                 # 开发工具（用户可选择）
│   └── generators/
│       ├── ui-lib/             # @company/generator-ui-lib
│       └── react-component/    # @company/generator-component
├── pnpm-workspace.yaml    # 适用于 pnpm
├── pnpm-lock.yaml         # 表示使用 pnpm
└── package.json           # 根 package.json（npm/yarn/bun 的 workspaces 字段）
```

**工作区配置示例：**

**对于 pnpm（pnpm-workspace.yaml）：**

```yaml
packages:
  - 'apps/*'
  - 'packages/*'
  - 'services/*'
  - 'tools/*'
```

**对于 npm/yarn/bun（package.json）：**

```json
{
  "name": "my-monorepo",
  "private": true,
  "workspaces": ["apps/*", "packages/*", "services/*", "tools/*"]
}
```

**检测逻辑：**

1. 检查锁文件以确定包管理器
2. 从合适的文件中读取工作区配置
3. 提取父目录：`apps`、`packages`、`services`、`tools`
4. 提示用户选择一个

### 模板执行流水线

Vite+ 作为一个智能包装器，执行以下操作：

1. **预处理**：
   - 检测模板类型（bingo vs universal）
   - **如果在单体仓库中**：提示选择目标目录（apps、packages、services 等）
   - 发现工作区包以供依赖选择
   - 捕获生成前快照（用于通用模板）

2. **执行**：
   - 解析 CLI 参数：`--` 之前的选项供 Vite+ 使用，`--` 之后的选项供模板使用
   - 使用 Node.js 执行模板：`node node_modules/{template}/bin/index.js [args-after---]`
   - 透传模板参数（`--` 之后的所有内容）
   - 模板以完整交互模式运行

3. **后处理**（对所有模板都相同）：
   - **检测并迁移**：使用 ast-grep 分析生成的代码
     - 检测独立的 vite/vitest/oxlint/oxfmt
     - 提示用户升级到 vite-plus 统一工具链
     - 如确认，则应用迁移
   - **单体仓库集成**：
     - 提示选择要添加的工作区依赖
     - 使用所选依赖更新生成的 package.json
     - 如有需要，更新工作区配置（添加到 pnpm-workspace.yaml 或 package.json）
     - 运行 `vp install` 以链接工作区依赖

**实现说明**：

- Vite+ CLI 解析 `--` 之前的选项（例如 `--no-migrate`、`--deps`）
- `--` 之后的选项按原样传递给模板
- 不需要 Rust-JS 桥接——我们直接 shell out 到 Node.js 来运行模板

### 模板执行流程

```
1. 用户运行：vp create [template-name] [vite-options] -- [template-options]
   ↓
2. Vite+ 解析 CLI 参数（按 -- 分隔）
   ↓
3. 如果未提供 template-name：进入交互模式
   ├─ 显示模板选择菜单（Vite+ Monorepo、Vite+ Generator、Vite、TanStack、Other）
   ├─ 处理带有自动参数注入的特殊模板
   └─ 继续使用所选模板
   ↓
4. Vite+ 检查是否在 monorepo 工作区中运行
   ↓
5. 如果在 monorepo 中：提示用户选择目标目录（apps、packages 等）
   ↓
6. Vite+ 发现并识别模板类型（bingo vs universal）
   ↓
7. Vite+ 捕获生成前快照（文件列表）
   ↓
8. Vite+ 加载工作区包以供依赖选择
   ↓
9. Vite+ 启动 fspy 监听器以监控 package.json 操作
   ↓
10. Vite+ 执行模板：node node_modules/{template}/bin/index.js [template-options]
    （cwd 设置为所选目录，或将目录作为参数传递）
    ↓
11. 模板运行（处理所有提示、校验、文件生成）
    ↓
12. 模板成功完成
    ↓
13. Vite+ 停止 fspy 监听器，并从 package.json 路径推导项目目录
    ↓
14. Vite+ 在检测到的项目目录中进行后处理（对所有模板都相同）：

   自动迁移 lint/format 工具（与 vp migrate 共享，先运行
   这样在下面的合并步骤之前，.oxlintrc.json / .oxfmtrc.json 已存在）：
   ├─ 检测 ESLint flat config + 依赖
   ├─ 通过 @oxlint/migrate 迁移到 oxlint（生成 .oxlintrc.json，
   │  重写 scripts，重写 lint-staged）
   ├─ 检测 Prettier 配置 + 依赖
   └─ 迁移到 oxfmt（生成 .oxfmtrc.json，重写 scripts，
      重写 lint-staged）

   自动迁移到 Vite+：
   ├─ 检测独立的 vite/vitest/oxlint/oxfmt
   ├─ 提示升级到 vite-plus 统一工具链
   └─ 如果选择 yes，则使用 ast-grep 应用迁移：
       ├─ 依赖：vite + vitest + oxlint + oxfmt → vite-plus
       ├─ 合并 vitest.config.ts → vite.config.ts
       ├─ 合并 .oxlintrc → vite.config.ts（获取上面 lint 迁移生成的
       │   文件）
       ├─ 合并 .oxfmtrc → vite.config.ts
       └─ 删除独立的配置文件

   单体仓库集成：
   ├─ 提示用户选择工作区依赖
   ├─ 使用 workspace:* 依赖更新 package.json
   ├─ 检查项目路径是否匹配工作区模式
   ├─ 如果不匹配：更新工作区配置（pnpm-workspace.yaml 或 package.json）
   ├─ 运行 vp install 以链接工作区依赖
   └─ 显示下一步操作和提示
```

这种方法**简单且稳健**：

- ✅ 无需在 Rust 中嵌入 JavaScript 运行时
- ✅ 无需维护与模板 API 的兼容性
- ✅ 任何模板都可开箱即用（bingo 或 universal）
- ✅ 模板作者可以正常发布到 npm
- ✅ 通过智能迁移为 Vite+ 添加优化
- ✅ 无缝的 monorepo 集成

**实现说明**：

- **GitHub 模板**：通过 npx 使用 degit 实现零配置克隆
- **错误处理**：提供上下文相关的故障排查提示
- **更新模式**：为过渡模式生成器奠定基础
- **缓存**：依赖原生 npm/pnpm 缓存机制

## 使用示例

### 示例 1：通用模板（create-vite）自动执行

当模板未在本地安装时，Vite+ 会自动使用合适的包管理器运行器：

```bash
$ vp create create-vite -- --template react-ts

┌  🎨 Vite+ 代码生成器
│
◇  正在发现模板：create-vite
│
●  模板未在本地安装，将使用 pnpm dlx 运行
│
◇  正在执行模板...
│
●  正在运行：pnpm dlx create-vite --template react-ts
│
# 模板通过 pnpm dlx 交互式运行...

# Vite+ 在 monorepo 中提示目标目录
◆  我们应该在哪里创建新包？
│  ○ apps/        （应用程序）
│  ● packages/    （共享包）
│  ○ services/    （后端服务）
│
◇  已选择：packages/
│
# 模板提示
✔ 项目名称：› my-react-app
✔ 请选择框架：› React
✔ 请选择变体：› TypeScript

正在 ./packages/my-react-app 中搭建项目...

完成。现在运行：
  cd my-react-app
  vp install
  vp dev

# Vite+ 检测独立的 vite 工具
◇  模板完成！正在检测与 vite 相关的工具...
│
◆  检测到独立的 vite 工具：
│  ✓ vite ^5.0.0
│  ✓ vitest ^1.0.0
│
◆  升级到 vite-plus 统一工具链？
│
│  这将：
│  • 用单一 vite-plus 依赖替换 vite + vitest
│  • 将 vitest.config.ts 合并到 vite.config.ts
│  • 删除独立的 vitest.config.ts
│
│  优点：
│  • 统一的依赖管理
│  • 单一配置文件
│  • 与 Vite+ 任务运行器更好集成
│
│  ● 是 / ○ 否
│
◇  正在迁移到 vite-plus...
│  ✓ 已更新 package.json（vite + vitest → vite-plus）
│  ✓ 已合并 vitest.config.ts → vite.config.ts
│  ✓ 已删除 vitest.config.ts
│
◆  是否将工作区包添加为依赖？
│
│  ◼ @company/ui-components - 共享 React 组件
│  ◼ @company/utils - 工具函数
│  ◻ @company/api-client - API 客户端库
│
◇  已选择：@company/ui-components, @company/utils
│
◇  正在更新 packages/my-react-app/package.json...
◇  已添加依赖：
│  - @company/ui-components@workspace:*
│  - @company/utils@workspace:*
│
◇  正在检查工作区配置...
◇  项目匹配模式 'packages/*' ✓
◇  正在运行 vp install...
│
└  完成！

🎉 已成功使用 vite-plus 创建 my-react-app

下一步：
  cd packages/my-react-app
  vp dev
```

### 示例 2：完整的 Monorepo 集成流程

此示例展示了带有工作区依赖选择的完整 monorepo 集成：

```bash
$ cd my-monorepo
$ vp create create-vite -- --template react-ts

┌  🎨 Vite+ 代码生成器
│
◆  我们应该在哪里创建新包？
│  ○ apps/
│  ● packages/
│  ○ tools/
│
◇  已选择：packages/
│
◇  正在发现模板：create-vite
│
●  模板未在本地安装，将使用 pnpm dlx 运行
│
◇  正在执行模板...
│
●  正在运行：pnpm dlx create-vite --template react-ts
│
# create-vite 交互式运行...
✔ 项目名称：› ui-components
✔ 请选择框架：› React
✔ 请选择变体：› TypeScript

正在 ./ui-components 中搭建项目...

完成。现在运行：
  cd ui-components
  npm install
  npm run dev

◆  模板执行成功
│
◆  检测到项目目录：packages/ui-components
│
◇  自动迁移到 Vite+...
│
●  检测到独立的 vite 工具：vite, vitest
│
◆  升级到 vite-plus 统一工具链？
│  ● 是 / ○ 否
│
●  这将：
│  • 用单一 vite 依赖替换 vite + vitest
│  • 更新脚本命令以使用 vite CLI
│  • 使用 catalog: version
│
◆  已迁移到 vite-plus ✓
│  • 已移除：vite, vitest
│  • 已添加：vite (catalog:)
│
◇  Monorepo 集成...
│
◆  是否将工作区包添加为依赖？
│  ◼ @company/utils - 工具函数
│  ◼ @company/theme - 设计令牌和主题
│  ◻ @company/icons - 图标库
│  ◻ @company/api-client - API 客户端
│
◇  已选择：@company/utils, @company/theme
│
◆  已添加 2 个工作区依赖
│  • @company/utils@workspace:*
│  • @company/theme@workspace:*
│
◆  项目匹配工作区模式 ✓
│
◒  正在运行 vp install...
│
◆  依赖已链接
│
└  ✨ 生成完成！

下一步：
  cd packages/ui-components
  vp dev
```

### 示例 3：创建生成器脚手架

使用内置的 `vite:generator` 快速搭建一个新的生成器：

```bash
$ vp create vite:generator

┌  🎨 Vite+ 代码生成器
│
◇  正在发现模板：vite:generator
│
◆  找到内置模板：vite:generator
│
◇  正在创建生成器脚手架...
│
◇  生成器名称：
│  ui-lib
│
◇  包名：
│  @company/generator-ui-lib
│
◇  描述：
│  生成新的 UI 组件库
│
◇  创建到哪里？
│  tools/generators/ui-lib
│
◆  已创建生成器脚手架
│  • package.json
│  • bin/index.js
│  • src/template.ts
│  • README.md
│  • tsconfig.json
│
◆  检测到项目目录：tools/generators/ui-lib
│
◇  Monorepo 集成...
│
◆  项目不匹配现有工作区模式
│
◆  是否更新工作区配置以包含该项目？
│  ● 是
│
◆  工作区配置已更新
│
◒  正在运行 vp install...
│
◆  依赖已链接
│
└  ✨ 生成完成！

摘要：
  • 模板：vite:generator（内置）
  • 已创建：tools/generators/ui-lib
  • 操作：已更新工作区配置

下一步：
  cd tools/generators/ui-lib
  # 编辑 src/template.ts 以自定义你的生成器
  # 然后使用以下命令测试：vp create @company/generator-ui-lib
```

生成的脚手架包含：

- **package.json**：预先配置了 bingo、zod、bin 入口和关键词
- **bin/index.js**：运行模板的可执行入口点
- **src/template.ts**：带有用于自定义的 TODO 注释的示例 bingo 模板
- **README.md**：使用说明和开发指南
- **tsconfig.json**：扩展 monorepo 根目录的 TypeScript 配置

### 示例 4：内置 vite:application 生成器

使用内置的 `vite:application` 生成器创建一个经过 Vite+ 优化的项目：

```bash
$ vp create vite:application

┌  🎨 Vite+ 代码生成器
│
◇  正在发现模板：vite:application
│
◆  找到内置模板：vite:application
│
◇  正在创建 vite 应用...
│
◆  请选择框架：
│  ● React（使用 TypeScript 的 React）
│  ○ Vue（使用 TypeScript 的 Vue）
│  ○ Svelte（使用 TypeScript 的 Svelte）
│  ○ Solid（使用 TypeScript 的 Solid）
│  ○ Vanilla（原生 TypeScript）
│
◇  项目名称：
│  my-app
│
◇  正在生成 react-ts 项目...
│
# create-vite 正在运行...
│
◆  项目已使用 Vite+ 配置生成
│  • 已添加 vite-task.json，包含 build/test/lint/dev 任务
│
◆  检测到项目目录：my-app
│
◇  自动迁移到 Vite+...
│
●  检测到独立的 vite 工具：vite
│
◆  已迁移到 vite-plus ✓
│
└  ✨ 生成完成！

摘要：
  • 模板：vite:application（内置）
  • 已创建：my-app
  • 操作：已迁移到 vite-plus

下一步：
  cd my-app
  vp dev
```

生成的项目包含：

- 标准的 create-vite 项目结构
- **vite-task.json**：预先配置的任务（build、test、lint、dev）
- **已迁移**：已使用 vite-plus 而非独立的 vite
- **已就绪**：可立即与 Vite+ 任务运行器一起使用

### 示例 5：Bingo 模板（create-typescript-app）

```bash
# 使用 create-typescript-app（一个流行的 bingo 模板）
vp create create-typescript-app

┌  vp create create-typescript-app
│
# Vite+ 先提示目标目录
◆  我们应该在哪里创建新包？
│  ○ apps/
│  ● packages/
│  ○ tools/
│
◇  已选择：packages/
│
# Bingo 的交互式提示
◇  仓库名称：my-lib
◇  仓库所有者：mycompany
◇  选择哪个预设？ › common
│
└  模板已成功完成！

# Vite+ 也会检测独立的 vite 工具（即使是 bingo 模板也是如此）
◇  模板完成！正在检测与 vite 相关的工具...
│
◆  检测到独立的 vite 工具：
│  ✓ vite ^5.0.0
│  ✓ vitest ^1.0.0
│
◆  升级到 vite-plus 统一工具链？
│
│  这将：
│  • 用 vite-plus 替换 vite + vitest
│  • 将配置合并到 vite.config.ts
│
│  ● 是 / ○ 否
│
◇  正在迁移到 vite-plus...
│  ✓ 已更新 package.json 依赖
│  ✓ 已合并 vitest.config.ts → vite.config.ts
│  ✓ 已删除 vitest.config.ts
│
◆  是否将工作区包添加为依赖？
│
│  ◼ @mycompany/utils - 工具函数
│  ◼ @mycompany/logger - 日志库
│  ◻ @mycompany/database - 数据库客户端
│
◇  已选择：@mycompany/utils, @mycompany/logger
│
◇  正在更新 packages/my-lib/package.json...
◇  正在检查工作区配置...
◇  项目匹配模式 'packages/*' ✓
◇  正在运行 vp install...
│
└  完成！

🎉 已成功创建 my-lib，并进行了 Vite+ 优化

下一步：
  cd packages/my-lib
  vp dev
```

**注意**：即使 create-typescript-app 是一个 bingo 模板，它也会获得相同的自动迁移处理，以便针对 Vite+ 进行优化！

### 示例 3：创建工作区本地 Bingo 生成器

#### 使用 @vite-plus/create-generator 快速开始

使用官方脚手架快速创建一个新的生成器：

```bash
# 在你的 monorepo 中创建一个新生成器
vp create @vite-plus/create-generator

┌  @vite-plus/create-generator
│
◇  生成器名称：ui-lib
◇  生成器包名：@company/generator-ui-lib
◇  描述：为我们的 monorepo 生成新的 UI 组件库
◇  创建到哪里？ › tools/generators/ui-lib
│
◇  正在创建生成器脚手架...
│  ✓ 已创建 package.json
│  ✓ 已创建 bin/index.js
│  ✓ 已创建 src/template.ts
│  ✓ 已创建 src/template.test.ts
│  ✓ 已创建 README.md
│
◇  正在安装依赖...
│
└  完成！

✅ 已在 tools/generators/ui-lib 创建生成器

下一步：
  1. cd tools/generators/ui-lib
  2. 编辑 src/template.ts 以定义你的生成器逻辑
  3. 使用以下命令测试：vp create @company/generator-ui-lib
```

#### 生成后的结构

在真实的 monorepo 中，将自定义 bingo 生成器作为与应用和库并列的正式包来编写：

```
monorepo/
├── apps/
│   ├── api-gateway/
│   └── web-app/
├── packages/                    # 生成的包放在这里
├── tools/
│   └── generators/
│       └── ui-lib/              # 生成器包
│           ├── package.json
│           ├── bin/
│           │   └── index.js
│           ├── src/
│           │   └── template.ts
│           └── templates/
│               ├── package.json.hbs
│               └── src/
│                   └── index.ts.hbs
└── pnpm-workspace.yaml
```

**生成器包配置**（由 `@vite-plus/create-generator` 自动生成）：

```json
// tools/generators/ui-lib/package.json
{
  "name": "@company/generator-ui-lib",
  "version": "1.0.0",
  "type": "module",
  "private": true,
  "description": "为我们的 monorepo 生成新的 UI 组件库",
  "bin": {
    "create-ui-lib": "./bin/index.js"
  },
  "keywords": ["vite-plus-generator"],
  "scripts": {
    "test": "vitest"
  },
  "dependencies": {
    "bingo": "^0.5.0",
    "zod": "^3.22.0"
  },
  "devDependencies": {
    "bingo-testers": "^0.5.0",
    "vitest": "^1.0.0",
    "@types/node": "^20.0.0",
    "typescript": "^5.3.0"
  }
}
```

**模板实现**（由 `@vite-plus/create-generator` 提供脚手架）：

该脚手架包含一个完整、可运行的示例，你可以对其进行自定义：

```typescript
// tools/generators/ui-lib/src/template.ts
import { createTemplate } from 'bingo';
import { z } from 'zod';

// 此文件由 @vite-plus/create-generator 搭建脚手架生成
// 编辑 options 和 produce() 函数以自定义你的生成器

export default createTemplate({
  about: {
    name: 'UI Library Generator',
    description: '使用 TypeScript 创建一个新的 React 组件库',
  },

  options: {
    name: z
      .string()
      .regex(/^[a-z][a-z0-9-]*$/, '必须为小写且使用连字符')
      .describe('库名称（例如：design-system、ui-components）'),

    framework: z.enum(['react', 'vue', 'svelte']).default('react').describe('UI 框架'),

    storybook: z.boolean().default(true).describe('是否包含用于组件文档的 Storybook'),

    cssInJs: z.boolean().default(false).describe('是否包含 CSS-in-JS 库（styled-components）'),
  },

  async produce({ options }) {
    const libPath = `packages/${options.name}`;
    const packageName = `@company/${options.name}`;

    return {
      files: {
        [`${libPath}/package.json`]: JSON.stringify(
          {
            name: packageName,
            version: '0.1.0',
            type: 'module',
            private: true,
            main: './dist/index.js',
            module: './dist/index.mjs',
            types: './dist/index.d.ts',
            exports: {
              '.': {
                import: './dist/index.mjs',
                require: './dist/index.js',
                types: './dist/index.d.ts',
              },
            },
            scripts: {
              dev: 'vite',
              build: 'vp build && tsc --emitDeclarationOnly',
              test: 'vitest',
              lint: 'oxlint',
              ...(options.storybook && { storybook: 'storybook dev -p 6006' }),
            },
            peerDependencies: {
              [options.framework]: '^18.0.0',
            },
            dependencies: {
              ...(options.cssInJs && { 'styled-components': '^6.0.0' }),
            },
            devDependencies: {
              '@types/react': '^18.0.0',
              '@vitejs/plugin-react': '^4.2.0',
              typescript: '^5.3.0',
              vitest: '^1.0.0',
              vite: '^5.0.0',
              ...(options.storybook && {
                '@storybook/react': '^7.6.0',
                '@storybook/react-vite': '^7.6.0',
              }),
            },
          },
          null,
          2,
        ),

        [`${libPath}/tsconfig.json`]: JSON.stringify(
          {
            extends: '../../tsconfig.base.json',
            compilerOptions: {
              outDir: './dist',
              rootDir: './src',
              declaration: true,
              declarationMap: true,
            },
            include: ['src/**/*'],
          },
          null,
          2,
        ),

        [`${libPath}/vite.config.ts`]: `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: './src/index.ts',
      formats: ['es', 'cjs'],
      fileName: (format) => \`index.\${format === 'es' ? 'mjs' : 'js'}\`,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
    },
  },
});
        `.trim(),

        [`${servicePath}/src/index.ts`]: `
import express from 'express';
${options.authentication ? "import { authMiddleware } from './middleware/auth.js';" : ''}
${options.database !== 'none' ? `import { initDatabase } from './database.js';` : ''}

const app = express();
const PORT = ${options.port};

// 中间件
app.use(express.json());
${options.authentication ? 'app.use(authMiddleware);' : ''}

// 路由
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: '${options.name}',
    timestamp: new Date().toISOString(),
  });
});

app.get('/api/${options.name}', (req, res) => {
  res.json({ message: 'Hello from ${options.name}!' });
});

// 启动服务器
async function start() {
  ${options.database !== 'none' ? 'await initDatabase();' : ''}

  app.listen(PORT, () => {
    console.log(\`🚀 ${options.name} running on http://localhost:\${PORT}\`);
  });
}

start().catch(console.error);
        `.trim(),

        ...(options.database !== 'none' && {
          [`${servicePath}/src/database.ts`]: `
import { ${getDatabaseClient(options.database)} } from '${getDatabasePackage(options.database)}';

export async function initDatabase() {
  // TODO: 初始化 ${options.database} 连接
  console.log('📦 数据库已连接');
}
          `.trim(),
        }),

        ...(options.authentication && {
          [`${servicePath}/src/middleware/auth.ts`]: `
import { Request, Response, NextFunction } from 'express';

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  // TODO: 实现 JWT 身份验证
  next();
}
          `.trim(),
        }),

        [`${servicePath}/.env.example`]: [
          `PORT=${options.port}`,
          `NODE_ENV=development`,
          options.database !== 'none' &&
            `DATABASE_URL=${getDatabaseUrl(options.database, options.name)}`,
        ]
          .filter(Boolean)
          .join('\n'),

        [`${servicePath}/README.md`]: `
# ${packageName}

用于 ${options.name} 的 API 微服务。

## 开发

\`\`\`bash
# 安装依赖
vp install

# 启动开发服务器
vp dev

# 运行测试
vp test

# 构建
vp build
\`\`\`

## 配置

- 端口：${options.port}
- 数据库：${options.database}
- 身份验证：${options.authentication ? '已启用' : '已禁用'}
        `.trim(),
      },

      scripts: [
        {
          phase: 0,
          commands: [`cd ${libPath}`, 'vp install'],
        },
      ],

      suggestions: [
        `✅ 已在 ${libPath} 创建 ${options.name} 组件库`,
        ``,
        `下一步：`,
        `  1. cd ${libPath}`,
        `  2. 将你的组件添加到 src/components/`,
        `  3. 在 src/index.ts 中导出它们`,
        `  4. vp build`,
        options.storybook && `  5. npm run storybook（查看组件文档）`,
        ``,
        `该库已可在其他包中使用！`,
      ].filter(Boolean),
    };
  },
});
```

**CLI 入口点**（由 `@vite-plus/create-generator` 自动生成）：

```javascript
#!/usr/bin/env node
// tools/generators/ui-lib/bin/index.js
import { runTemplate } from 'bingo';
import template from '../src/template.js';

runTemplate(template);
```

**README**（由 `@vite-plus/create-generator` 自动生成）：

```markdown
# @company/generator-ui-lib

为我们的 monorepo 生成新的 UI 组件库。

## 用法

从 monorepo 根目录运行：

\`\`\`bash
vp create @company/generator-ui-lib
\`\`\`

使用选项：

\`\`\`bash
vp create @company/generator-ui-lib --name=design-system --framework=react
\`\`\`

## 开发

\`\`\`bash

# 运行测试

vp test

# 测试生成器

vp create @company/generator-ui-lib
\`\`\`

## 自定义

编辑 `src/template.ts` 以自定义：

- 选项 schema（使用 Zod）
- 文件生成逻辑
- 脚本和建议
```

**在 Monorepo 中的用法：**

```bash
# 从 monorepo 根目录运行
vp create @company/generator-ui-lib

# Bingo 生成器提示
┌  @company/generator-ui-lib
│
◇  库名称：design-system
◇  框架：React
◇  是否包含 Storybook？ 是
◇  是否包含 CSS-in-JS？ 否
│
└  模板完成！

# Vite+ 也会检测独立的 vite 工具（即使是 bingo 模板也是如此！）
◇  模板完成！正在检测与 vite 相关的工具...
│
◆  检测到独立的 vite 工具：
│  ✓ vite ^5.0.0
│  ✓ vitest ^1.0.0
│
◆  升级到 vite-plus 统一工具链？
│
│  这将：
│  • 用 vite-plus 替换 vite + vitest
│  • 将配置合并到 vite.config.ts
│
│  ● 是 / ○ 否
│
◇  正在迁移到 vite-plus...
│  ✓ 已更新 package.json 依赖
│  ✓ 已合并 vitest.config.ts → vite.config.ts
│  ✓ 已删除独立的配置文件
│
◆  是否将工作区包添加为依赖？
│
│  ◼ @company/theme - 设计令牌和主题
│  ◼ @company/utils - 工具函数
│  ◼ @company/icons - 图标库
│  ◻ @company/hooks - React hooks
│
◇  已选择：@company/theme, @company/utils, @company/icons
│
◇  正在更新 packages/design-system/package.json...
◇  正在检查工作区配置...
◇  项目匹配模式 'packages/*' ✓
◇  正在运行 vp install...
│
└  完成！

✅ 已创建 design-system 组件库，并进行了 Vite+ 优化

下一步：
  1. cd packages/design-system
  2. 将组件添加到 src/components/
  3. 在 src/index.ts 中导出
  4. vp build
  5. npm run storybook（查看文档）

# CLI 选项
vp create @company/generator-ui-lib --name=icons --no-migrate  # 跳过迁移
vp create @company/generator-ui-lib --name=hooks --deps=@company/utils  # 预选依赖
```

**关键点**：即使你自己的 bingo 生成器也能受益于自动迁移！你可以使用独立的 vite/vitest/oxlint 生成代码，而 Vite+ 会自动将它们整合为 vite-plus。

**提示**：使用 `vp create @vite-plus/create-generator` 可在你的 monorepo 中快速搭建一个新的生成器！

**测试生成器：**

```typescript
// tools/generators/ui-lib/src/template.test.ts
import { testTemplate } from 'bingo/testers';
import { describe, expect, it } from 'vitest';
import template from './template.js';

describe('UI Library Generator', () => {
  it('generates library with storybook', async () => {
    const result = await testTemplate(template, {
      options: {
        name: 'design-system',
        framework: 'react',
        storybook: true,
        cssInJs: false,
      },
    });

    expect(result.files['packages/design-system/package.json']).toContain('@company/design-system');
    expect(result.files['packages/design-system/package.json']).toContain('@storybook/react');
    expect(result.files['packages/design-system/src/components/Button.tsx']).toBeDefined();
    expect(result.files['packages/design-system/.storybook/main.ts']).toBeDefined();
  });

  it('generates library without storybook', async () => {
    const result = await testTemplate(template, {
      options: {
        name: 'icons',
        framework: 'react',
        storybook: false,
        cssInJs: false,
      },
    });

    expect(result.files['packages/icons/.storybook/main.ts']).toBeUndefined();
    expect(result.files['packages/icons/src/components/Button.stories.tsx']).toBeUndefined();
  });
});
```

### 内置 Vite+ 生成器（可选）

对于 monorepo 特定需求，Vite+ 可以提供轻量包装器：

```bash
# 内置生成器，会自动配置 vite-task.json
vp create vite:library --name=shared-utils

# 这可以包装现有的 bingo 模板，并添加：
# - 带有 build/test/lint 任务的 vite-task.json
# - 正确的工作区结构
# - 面向 monorepo 的 TypeScript 配置
```

## 技术考虑

### 1. 进程执行与目录检测

- **子进程管理**：使用 Node.js `child_process.spawn()` 执行模板
- **Stdio 处理**：使用 `inherit` 模式透传 stdin/stdout/stderr，以支持交互式提示
- **目录检测**：使用 `fspy` 在模板执行期间监控 package.json 操作
  - 专门监视 package.json 的写入/创建操作
  - 在写入时捕获 package.json 文件路径
  - 根据 package.json 路径推导项目根目录（提取父目录）
  - 处理多个 package.json 写入（选择第一个顶层的）
  - 处理原地生成（package.json 在 cwd 中创建）
- **退出码**：正确处理模板退出码并上报错误
- **工作目录**：使用 `cwd` 选项确保模板在正确目录中运行

### 2. 包管理器检测与工作区配置

- **自动检测**：根据锁文件确定包管理器
  - `pnpm-lock.yaml` → pnpm
  - `package-lock.json` → npm
  - `yarn.lock` → yarn
  - `bun.lockb` → bun
- **读取工作区配置**：基于检测到的包管理器
  - **pnpm**：读取 `pnpm-workspace.yaml`，解析 `packages` 数组
  - **npm/yarn/bun**：读取根目录 `package.json`，解析 `workspaces` 数组
- **遵循工作区**：使用与 monorepo 相同的包管理器
- **安装**：在提示安装时，使用检测到的包管理器

### 3. 模板检测

本地模板注册在 monorepo 的 `vite.config.ts` 中的 `create.templates` 里
（参见 [Organization Default Templates RFC](./create-org-default-templates.md#local-templates-createtemplates)）。
该配置是哪些包属于模板的权威来源；Vite+ 不会根据 package.json 的关键词推断模板包。
`vp create vite:generator` 会自动（幂等地，保留任何现有的 `defaultTemplate`）写入入口，
因此新脚手架生成的生成器会直接出现在选择器中，无需手动编辑。

- **配置查找**：通过条目的 `name` 将 `vp create <name>` 解析到 `create.templates`，
  然后解析该条目的 `template` 指定项。
- **Bin 入口**：查找 `bin` 字段以定位可执行文件。当声明的本地模板没有 `bin` 时，抛出清晰错误。
- **Bingo 执行提示**：`bingo` 依赖表示该模板是 Bingo 生成器，因此运行时会附加 `--skip-requests`。

### 4. Monorepo 集成

- **工作区检测**：检查是否在 monorepo 工作区中运行
- **目录选择**：提示用户选择目标目录（apps、packages、services 等）
  - 读取工作区配置（pnpm-workspace.yaml 或 package.json workspaces）
  - 从工作区模式中提取父目录
  - 以交互式选择方式展示
  - 可通过 `--directory` 标志覆盖
- **工作区包发现**：加载工作区中的所有包及其元数据
  - 使用检测到的包管理器工作区模式
  - 解析 glob 模式以查找所有包
- **依赖选择 UI**：用于选择工作区依赖的多选提示
- **智能过滤**：按类型过滤包（排除生成器，包含库）
- **版本协议**：工作区依赖使用 `workspace:*`
- **package.json 更新**：解析并更新生成的 package.json，写入选中的依赖
- **工作区注册**：检查检测到的项目是否匹配现有工作区模式
  - 若匹配（例如 `packages/my-app` 匹配 `packages/*`）：✅ 无需更新
  - 若不匹配：更新工作区配置文件
    - **pnpm**：将模式添加到 pnpm-workspace.yaml 的 `packages` 数组
    - **npm/yarn/bun**：将模式添加到 package.json 的 `workspaces` 数组
- **依赖安装**：运行 `vp install` 以链接工作区依赖
- **路径归一化**：确保路径相对于工作区根目录
- **幂等性**：如果模式已存在，不要重复添加

### 5. 错误处理

- **清晰信息**：区分 Vite+ 错误和模板错误
- **安装失败**：优雅处理 vp install 失败
- **部分完成**：如果模板创建了文件但随后出错，要通知用户
- **排障**：提供常见问题的提示（如找不到 Node.js 等）

### 6. 测试

测试可以利用 bingo 自带的测试工具：

```typescript
// 模板作者使用 bingo 的测试工具进行测试
import { testTemplate } from 'bingo/testers';
import { expect, test } from 'vitest';
import template from './template';

test('生成 React 应用', async () => {
  const result = await testTemplate(template, {
    options: { name: 'my-app', framework: 'react' },
  });

  expect(result.files['package.json']).toContain('react');
});
```

Vite+ 模板运行器逻辑也使用 TypeScript/Vitest 进行测试：

```typescript
// 在 vite_generator 包中
import { describe, expect, it } from 'vitest';
import { detectBingoTemplate, loadWorkspacePackages } from './discovery';

describe('模板检测', () => {
  it('将带有 bingo 依赖的包视为 bingo 模板', async () => {
    const pkg = {
      name: 'create-typescript-app',
      dependencies: { bingo: '^0.5.0' },
      bin: { 'create-typescript-app': './bin/index.js' },
    };

    // `bingo` 依赖是执行提示，会附加 `--skip-requests`。
    expect(detectBingoTemplate(pkg)).toBe(true);
  });

  it('不会将没有 bingo 依赖的包视为 bingo 模板', async () => {
    const pkg = {
      name: 'my-template',
      bin: { 'my-template': './index.js' },
    };

    expect(detectBingoTemplate(pkg)).toBe(false);
  });
});

describe('工作区包发现', () => {
  it('加载所有工作区包', async () => {
    const packages = await loadWorkspacePackages('/path/to/monorepo');

    expect(packages).toContainEqual({
      name: '@company/logger',
      path: 'packages/logger',
      description: 'Logging library',
    });
  });

  it('过滤掉生成器包', async () => {
    const packages = await loadWorkspacePackages('/path/to/monorepo', {
      excludeGenerators: true,
    });

    expect(packages.every((pkg) => !pkg.name.includes('generator'))).toBe(true);
  });
});
```

## 对比：Bingo 与通用模板

| 方面                   | Bingo 模板                   | 通用模板                      |
| ---------------------- | ---------------------------- | ---------------------------- |
| **编写体验**           | ✅ 类型安全（Zod）、可测试     | ⚠️ 无统一标准，因实现而异      |
| **示例**               | @company/generator-ui-lib    | create-vite、create-next-app |
| **自定义能力**         | ✅ 完全可控                  | ⚠️ 受限于模板选项            |
| **自动迁移**           | ✅ 是（与通用模板相同）        | ✅ 是（与 Bingo 相同）        |
| **生态规模**           | ~5-10 个 bingo 模板          | 数千个 create-\* 模板        |
| **学习曲线**           | 中等（需要学习 bingo）        | 零（使用熟悉的模板）          |
| **维护**               | 由你维护                      | 由模板作者维护                |
| **最适合**             | 定制化公司生成器              | 快速启动、标准化配置          |

**关键点**：Bingo 和通用模板都会获得**同样的自动迁移到 vite-plus**。区别只在编写体验：

- **选择 bingo**：当你想编写带类型安全和测试能力的自定义生成器时
- **选择通用模板**：当你想使用生态中已有模板时
- **两者都会自动迁移**到 vite-plus 统一工具链！

## 未决问题

1. **自动安装体验**：应当自动安装模板，还是始终先提示？
2. **模板缓存**：应当缓存已安装模板，还是始终拉取最新？
3. **内置生成器**：我们应提供哪些内置生成器（如果有）？
4. **目录选择**：
   - 是否应根据目录名推断描述（例如 "apps" → "Applications"）？
   - 是否应支持通过 `--directory=custom/path` 添加自定义目录？
   - 是否应记住上次选择的目录，供下一次生成使用？
5. **依赖选择**：
   - 是否应按类型过滤包（例如排除测试工具）？
   - 是否应根据生成器类型提供智能默认值？
   - 是否应支持依赖分组（例如“常用后端库”）？
6. **版本协议**：始终使用 `workspace:*`，还是允许指定版本范围？
7. **迁移安全性**：
   - 应该在应用迁移前创建备份吗？
   - 如何处理迁移冲突？
   - 是否支持迁移回滚？
8. **ast-grep 集成**：
   - 迁移规则应使用 YAML 还是 TypeScript？
   - 是否允许用户自定义迁移规则？
9. **可扩展性**：
   - 是否为第三方迁移提供插件系统？
   - 如何在团队间共享迁移？

## 成功标准

一个成功的实现应满足：

### 模板支持

1. ✅ 无需修改即可运行来自 npm 的任意 bingo 模板（通过 npx/pnpm dlx）
2. ✅ 运行任意 create-\* 或其他通用模板（通过 npx/pnpm dlx）
3. ✅ 支持工作区本地 bingo 生成器（扫描工作区模式）
4. ✅ 自动检测模板类型（bingo vs 通用）
5. ✅ 正确解析 CLI 参数（Vite+ 选项放在 `--` 之前，模板选项放在 `--` 之后）
6. ✅ 正确透传模板选项（`--` 之后的所有内容）
7. ✅ 正确处理交互式提示（stdio 继承）
8. ✅ 检测生成的项目目录（通过扫描 package.json）
9. ✅ 内置 @vite-plus/create-generator，用于搭建新的生成器脚手架
10. ✅ 内置 vite:application 和 vite:library 占位符

### 自动迁移到 vite-plus

9. ✅ 自动检测独立的 vite/vitest/oxlint/oxfmt（在检测到的项目目录中）
10. ✅ 提示升级到 vite-plus 统一工具链
11. ✅ 整合依赖（vite + vitest + oxlint + oxfmt → 统一的 vite）
12. ✅ 更新脚本命令（vitest → vp test，oxlint → vp lint，等等）
13. ✅ 提供清晰的迁移前/后说明
14. ✅ 安全且可回滚
15. ⏳ 合并配置（vitest.config.ts、.oxlintrc、.oxfmtrc → vite.config.ts）- 未来将使用 ast-grep 增强
16. ✅ 通过 `@oxlint/migrate` 将 ESLint 配置 / 依赖 / 脚本迁移到 oxlint（与 `vp migrate` 共享辅助工具）
17. ✅ 将 Prettier 配置 / 依赖 / 脚本迁移到 oxfmt
18. ✅ 对旧版 `.eslintrc.*` 发出警告并跳过迁移（会要求用户先升级到 ESLint v9 flat config）

### Monorepo 集成

16. ✅ 检测 monorepo 工作区并提示选择目标目录
17. ✅ 支持 `--directory` 标志以跳过目录选择
18. ✅ 与工作区集成（必要时自动更新 pnpm-workspace.yaml 或 package.json workspaces）
19. ✅ 通过多选 UI 提示选择工作区依赖
20. ✅ 对内部依赖使用 `workspace:*` 协议
21. ✅ 运行 `vp install` 链接依赖
22. ✅ 兼容 npm、pnpm、yarn 和 bun 包管理器
23. ✅ 智能包过滤（在依赖选择中排除生成器）
24. ✅ 支持 `--deps` 标志以预选依赖
25. ✅ 工作区模式匹配与自动更新

### 开发者体验

26. ✅ 无需安装（使用 npx/pnpm dlx/yarn dlx/bunx）
27. ✅ 清晰区分 Vite+ 与模板错误的信息
28. ✅ 使用 @clack/prompts 提供美观的交互提示
29. ✅ 在生成/迁移过程中显示进度和反馈
30. ✅ 完成后显示有帮助的下一步操作（包含正确的目录路径）
31. ✅ 带精选模板列表的交互模式
32. ✅ 对已知模板自动注入参数

## 此方法的优势

### 对于 Vite+ 用户

- 🎯 **最大选择自由**：使用 bingo 模板 或任何 create-\* 模板
- 🚀 **零学习成本**：使用熟悉的模板（create-vite、create-next-app 等）
- 🔧 **自动优化**：智能迁移到 Vite+ 工具链
- 🌍 **完整生态系统**：可访问成千上万的现有模板
- 💼 **公司级生成器**：为你的团队构建可复用的 bingo 模板
- 🔄 **面向未来**：可与未来创建的模板兼容

### 对于模板作者

**Bingo 模板作者：**

- ✍️ **完全控制**：类型安全、可测试、面向公司特定需求的生成器
- 📦 **优先支持 Monorepo**：非常适合 workspace 本地生成器
- 🧪 **内置测试**：使用 bingo 的测试工具
- 🚀 **快速开始**：使用 `@vite-plus/create-generator` 搭建新的生成器脚手架

**通用模板作者：**

- ⚡ **零成本**：模板可直接按原样使用
- 👥 **更广受众**：自动兼容 Vite+
- 🔄 **无需维护**：由 Vite+ 负责优化

### 对于 Vite+ 维护者

- 🎯 **两全其美**：同时支持两种方式
- 🐛 **更简单的架构**：模板按原样运行，没有复杂 API
- 📚 **复用文档**：指向已有的模板文档
- ⚡ **即时价值**：通过智能后处理增加价值
- 🔧 **可扩展**：随着 Vite+ 演进，易于添加新的迁移

## 相关 RFC

- [migration-command.md](./migration-command.md) - `vp migrate` 命令，用于迁移现有项目
  - 共享相同的迁移引擎和规则
  - `vp create` 在模板生成后运行迁移
  - `vp migrate` 在现有项目上运行迁移
  - ESLint → oxlint 和 Prettier → oxfmt 迁移辅助工具位于 `packages/cli/src/migration/`，并由两个命令共同调用，因此新脚手架创建的项目和升级后的现有项目最终会处于相同状态

## 参考资料

### 模板框架

- [Bingo Framework](https://www.create.bingo/) - 类型安全的仓库模板
- [Bingo FAQs](https://www.create.bingo/faqs/)
- [create-typescript-app](https://github.com/JoshuaKGoldberg/create-typescript-app) - 生产级 bingo 模板
- [create-vite](https://github.com/vitejs/vite/tree/main/packages/create-vite) - 官方 Vite 模板

### 代码转换

- [ast-grep](https://ast-grep.github.io/) - 结构化搜索与替换工具
- [Turborepo Codemods](https://turborepo.com/docs/reference/turbo-codemod) - 类似的迁移方式
- [jscodeshift](https://github.com/facebook/jscodeshift) - 替代性的 AST 转换工具

### 灵感来源

- [Nx Generators](https://nx.dev/docs/features/generate-code) - Nx 的生成器系统
- [Turborepo Code Generation](https://turborepo.com/docs/guides/generating-code) - Turbo 基于 PLOP 的方式
- [PLOP Documentation](https://plopjs.com/documentation/) - 微型生成器框架

### 工具

- [Zod](https://zod.dev/) - TypeScript 模式校验
- [@clack/prompts](https://www.npmjs.com/package/@clack/prompts) - 精美的 CLI 提示
