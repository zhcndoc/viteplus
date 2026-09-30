<script setup lang="ts">
import { migrationPrompt, upgradePrompt } from '../.vitepress/theme/data/migration-prompts.ts';
</script>

# 迁移到 Vite+

`vp migrate` 帮助将现有项目迁移到 Vite+。

## 概述

此命令是将独立的 Vite、Vitest、Oxlint、Oxfmt、ESLint、Prettier、tsdown 和 tsup 设置整合到 Vite+ 的起点。

当您想将一个现有项目迁移到 Vite+ 默认配置，而不是手动连接每个工具时，请使用此命令。

## 用法

```bash
vp migrate
vp migrate <path>
vp migrate --no-interactive
```

## 目标路径

位置参数 `PATH` 是可选的。

- 如果省略，`vp migrate` 会迁移当前目录
- 如果提供，则会迁移指定的目标目录
- 对于 monorepo，目标必须是工作区根目录。Vite+ 无法迁移单个工作区成员，因为迁移会更新所有成员共享的包管理器配置、catalog 和 lockfile

```bash
vp migrate
vp migrate my-app
```

## 选项

- `--agent <name>` 将代理指令写入项目
- `--no-agent` 跳过代理指令设置
- `--editor <name>` 将编辑器配置文件写入项目
- `--no-editor` 跳过编辑器配置设置
- `--hooks` 设置预提交钩子
- `--no-hooks` 跳过钩子设置
- `--no-interactive` 在无提示模式下运行迁移。

## 迁移流程

`migrate` 命令旨在快速将现有项目迁移到 Vite+。以下是该命令执行的操作：

- 更新项目依赖
- 在需要时重写导入
- 将特定工具的配置合并到 `vite.config.ts`
- 将脚本更新为 Vite+ 命令集
- 可以设置提交钩子
- 可以写入代理和编辑器配置文件
- 格式化已迁移的项目

有关确切的依赖、源代码重写和包管理器行为，请参见 [迁移规则](./migrate-rules.md)。

大多数项目在运行 `vp migrate` 后仍需要进一步手动调整。

升级至 Vitest 5 前，请阅读[兼容性设置与审查清单](./vitest-v5.md)和 [Vitest 上游迁移指南](https://vitest.dev/guide/migration/)。预检会在更新依赖前检查原有测试运行器版本和 Node 运行时。请保留原始锁文件，并在重试前解决阻塞项。

## 推荐工作流程

运行迁移之前：

- 对于尚未使用 Vite+ 的项目，请先升级到 Vite 8+ 和 Vitest 4.1+
- 确保了解需要保留的现有 lint、格式化或测试设置

运行迁移之后：

- 运行 `vp install`
- 运行 `vp check`
- 运行 `vp test`
- 运行 `vp build`（如果您要构建库，则运行 `vp pack`）

## 迁移提示

查看并复制此提示到你的 coding agent，以将现有项目迁移到 Vite+：

<CopyPrompt :prompt="migrationPrompt" label="查看迁移提示" />

## 从 Vite+ 0.3 升级到 1.0

Vite+ 1.0 包含 Vitest 5 的破坏性变更。请同时阅读 [Vite+ 兼容性指南](./vitest-v5.md)和[上游迁移指南](https://vitest.dev/guide/migration/)。

库项目构建也会使用 tsdown 0.23。有关选项变更和新默认值，请查看 [pack 配置迁移规则](./migrate-rules.md#pack-configuration)和[上游发行说明](https://github.com/rolldown/tsdown/releases/tag/v0.23.0)。

在迁移识别出旧测试运行器之前，请保留项目原有的依赖和锁文件。先更新项目依赖可能导致迁移无法保留 v4 行为。请从工作区根目录使用以下任一方式。

### 使用全局 CLI

将[全局 CLI](/guide/upgrade#global-vp)升级到目标 1.0 版本，然后运行 `vp migrate --no-interactive`。要使用预览版，请按照[预览安装说明](/guide/upgrade#global-vp-preview)操作。

### 不使用全局 CLI

使用满足 `^22.18.0 || ^24.11.0 || >=26.0.0` 的现有 Node.js 运行时。通过包管理器运行目标迁移器，无需先将它添加到项目中。对于 `1.0.0` 版本：

::: code-group

```bash [pnpm]
pnpm dlx --package=vite-plus@1.0.0 vp migrate --no-interactive
```

```bash [npm]
npx --package=vite-plus@1.0.0 vp migrate --no-interactive
```

:::

将 `1.0.0` 替换为目标版本。要使用预览版，请使用 PR 中的版本，并在 `vp` 命令之前向 `pnpm` 或 `npx` 传入 `--registry=https://registry-bridge.viteplus.dev`。请在 `--package` 中显式指定版本，以确保运行的是目标迁移器，而不是旧的本地 CLI。

迁移后，完成依赖安装，并使用更新后的本地 CLI 验证：

::: code-group

```bash [pnpm]
pnpm install
pnpm exec vp check
pnpm exec vp test
pnpm exec vp build
```

```bash [npm]
npm install
npm exec -- vp check
npm exec -- vp test
npm exec -- vp build
```

:::

如果库项目使用 pack 命令，请用 `vp pack` 代替 `vp build`。也请运行已配置的浏览器、覆盖率和基准测试套件。

### 审查升级

对于现有 Vite+ 项目，请使用默认升级流程。如果还要重新执行项目设置，请添加 `--full`。解决阻塞项，并在提交前审查按文件列出的报告。有关各模式的范围，请参阅[升级与完整设置](./migrate-rules.md#upgrade-vs-full-setup)。

迁移后的项目通过验证后，请[检查是否可以移除生成的 v4 兼容性设置](./vitest-v5.md#remove-unneeded-compatibility-settings)，且无需改动代码或只需进行少量局部修复。如果移除需要大量测试变更或无法验证结果，请暂时保留兼容设置。

对于库项目，在 `vp pack` 成功运行后，请审查生成的 [tsdown 兼容性设置](#tsdown)。采用新默认值前请先阅读链接的文档，并结合软件包使用方检查生成的导入和声明。

### 复制升级提示

查看并复制此提示到你的 coding agent，以升级现有的 Vite+ 0.3 项目：

<CopyPrompt :prompt="upgradePrompt" label="查看升级提示" />

## 特定工具迁移

### Vitest

Vitest 会通过 `vp migrate` 自动迁移。`vite-plus` 会通过 `vite-plus/test*` 重新导出上游 `vitest@5.0.1`，因此对于 node 模式测试，只需安装一个 `vite-plus` 即可，无需直接安装 `vitest`。

对于浏览器模式，可以使用 `vite-plus` 中包含的基础浏览器 runtime（`@vitest/browser`）和 Preview 提供程序（`@vitest/browser-preview`）。如果要使用 Playwright 或 WebdriverIO，还需要选择加入对应的提供程序（`@vitest/browser-playwright` 或 `@vitest/browser-webdriverio`）及其框架 peer（`playwright` 或 `webdriverio`）。

`vp migrate` 会添加与捆绑 Vitest 版本一致的 Playwright 提供程序，并确保安装其框架 peer。可以从 `vite-plus/test/browser-playwright` 导入该提供程序。

对于 WebdriverIO，请从社区维护的 `@vitest/browser-webdriverio` 导入。迁移会恢复旧版 Vite+ 提供程序导入，确保提供程序版本至少为 `5.0.0`，并添加与捆绑运行器相匹配的 `@vitest/browser` override。之后的提供程序升级和框架 peer 由你自行管理。请参阅[社区 WebdriverIO 提供程序](./vitest-v5.md#community-webdriverio-provider)。

如果您是手动迁移，请改为将所有导入更新为 `vite-plus/test*`：

```ts
// 之前
import { defineConfig } from 'vitest/config';
import { describe, expect, it, vi } from 'vitest';
import { playwright } from '@vitest/browser-playwright';

const { page } = await import('@vitest/browser/context');

// 之后
import { defineConfig } from 'vite-plus';
import { describe, expect, it, vi } from 'vite-plus/test';
import { playwright } from 'vite-plus/test/browser-playwright';

const { page } = await import('vite-plus/test/browser/context');
```

`declare module 'vitest'` / `declare module '@vitest/browser*'` 的模块增强**不会**被刻意重写——`vite-plus/test*` 只是上游 `vitest*` 的薄封装重新导出，因此类型增强必须指向上游模块标识才能正确合并。请保留这些 `declare module` 语句指向 `'vitest'` / `'@vitest/browser*'`。

### tsdown

对于 tsdown 0.23，`vp migrate` 会更新 `pack` 块和 `tsdown.config.*` 中受支持的静态选项。现有 Vite+ 项目和工作区包即使不使用 `--full` 也会执行此迁移。选项映射和需要手动审查的情况，请参阅 [Pack 配置迁移规则](./migrate-rules.md#pack-configuration)。

如果缺少 `deps.resolveDepSubpath: true`，迁移会插入该设置以保留此前的默认行为；启用了 ATTW 检查且没有显式设置时，也会插入 `attw.profile: 'strict'`。每个插入的设置都带有 `tsdown <0.23 compatibility` 注释，包含文档链接和移除说明。显式设置保持不变。

首次运行 `vp pack` 时请保留这些设置。验证通过后，再检查软件包是否可以采用新的默认值：

- 移除 `deps.resolveDepSubpath: true` 可[按原样保留外部子路径导入](https://tsdown.dev/options/dependencies#deps-resolvedepsubpath)。请确认使用者能够解析生成的导入。
- 移除插入的 `attw.profile: 'strict'` 会选择 `esm-only` [解析配置](https://tsdown.dev/options/lint#profiles)，并跳过 `node10` 和 CommonJS 解析检查。如果软件包需要这些检查，请保留 `strict`。

接受移除某个设置时，也请一并删除其生成的注释。每次变更后运行 `vp pack` 和软件包使用者检查。如果无法验证结果，请保留该设置。

如果项目使用 `tsdown.config.ts`，请将其中的选项移动到 `vite.config.ts` 的 `pack` 块中：

```ts [tsdown.config.ts] {4-6}
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: ['src/index.ts'],
  dts: true,
  format: ['esm', 'cjs'],
});
```

```ts [vite.config.ts] {4-8}
import { defineConfig } from 'vite-plus';

export default defineConfig({
  pack: {
    entry: ['src/index.ts'],
    dts: true,
    format: ['esm', 'cjs'],
  },
});
```

合并后删除 `tsdown.config.ts`。有关完整配置参考，请参见 [打包指南](/guide/pack)。

### lint-staged

Vite+ 用其自身的 `staged` 块（在 `vite.config.ts` 中）取代了 lint-staged。仅支持 `staged` 配置格式。独立的非 JSON 格式 `.lintstagedrc` 和 `lint-staged.config.*` 不会被自动迁移。

将您的 lint-staged 规则移动到 `staged` 块中：

```ts [vite.config.ts]
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*.{js,ts,tsx,vue,svelte}': 'vp check --fix',
  },
});
```

当没有现有的钩子策略负责此工作流时，`vp migrate` 可以迁移受支持的 lint-staged 规则，并删除旧配置和依赖。如果保留了现有的钩子工具，请继续保留 lint-staged，直到您手动转换该钩子策略。有关详情，请参见[提交钩子指南](/guide/commit-hooks)和[Staged 配置参考](/config/staged)。

### Git 钩子工具

`vp migrate` 命令不会自动转换 Husky 设置。检测到 Husky 时，Vite+ 会保留其钩子、生命周期脚本、配置和依赖不变，并显示警告。您可以使用[提交钩子指南](/guide/commit-hooks)手动迁移项目。

项目现有的 Vite+ 钩子也会被保留。仅当未找到现有钩子策略时，才会引入默认的 staged 工作流。

如果您的项目当前使用 `lefthook`、`simple-git-hooks` 或 `yorkie`，`vp migrate` 会保留您现有的配置不变并显示警告。即使您选择在提示过程中设置钩子，或包含 `--hooks` 标志，也会如此。

如果您希望将其中一种工具手动迁移到 Vite+，可以按照以下步骤操作。首先，将暂存文件命令移动到 `vite.config.ts` 中的 `staged` 块。然后，更新您的生命周期脚本，使其运行 `vp config`。您还需要在 `.vite-hooks/pre-commit` 创建一个运行 `vp staged` 的 Vite+ 钩子。运行 `vp hooks enable`（或 `vp config`）以安装调度器并设置 `core.hooksPath`。最后，在确认 Vite+ 钩子按预期工作后，即可移除旧工具的配置和依赖。

使用 `vp hooks status` 验证调度器是否处于活动状态；如果需要在此克隆中再次将其关闭，请使用 `vp hooks disable`。有关完整 Vite+ 钩子设置的更多详情，请参见[提交钩子指南](/guide/commit-hooks)。

## 示例

```bash
# 迁移当前项目
vp migrate

# 迁移指定目录
vp migrate my-app

# 以无提示模式运行
vp migrate --no-interactive

# 在迁移期间写入代理和编辑器设置
vp migrate --agent claude --editor zed
```
