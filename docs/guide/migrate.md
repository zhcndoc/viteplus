# 迁移到 Vite+

`vp migrate` 帮助将现有项目迁移到 Vite+。

## 概述

该命令是将独立的 Vite、Vitest、Oxlint、Oxfmt、ESLint 和 Prettier 配置整合到 Vite+ 的起点。

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
- 如果提供，它会迁移该目标目录

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
- `--no-interactive` 在无提示模式下运行迁移

## 迁移流程

`migrate` 命令旨在快速将现有项目迁移到 Vite+。以下是该命令执行的操作：

- 更新项目依赖
- 在需要的地方重写导入
- 将特定工具配置合并到 `vite.config.ts`
- 更新脚本到 Vite+ 命令体系
- 可设置提交钩子
- 可写入代理和编辑器配置文件

大多数项目在运行 `vp migrate` 后仍需要进一步手动调整。

## 推荐工作流

在运行迁移之前：

- 升级到 Vite 8+ 和 Vitest 4.1+
- 确保您理解任何应保留的现有 lint、格式化或测试配置

运行迁移后：

- 运行 `vp install`
- 运行 `vp check`
- 运行 `vp test`
- 运行 `vp build`

## 迁移提示

如果您想将此工作交给编码代理（或阅读者是编码代理！），请使用以下迁移提示：

```md
将此项目迁移到 Vite+。Vite+ 取代了围绕运行时管理、包管理、开发/构建/测试命令、Linting、格式化 和 打包 的当前拆分工具链。运行 `vp help` 了解 Vite+ 能力，并在修改前运行 `vp help migrate`。在工作区根目录使用 `vp migrate --no-interactive`。确保项目在迁移前使用 Vite 8+ 和 Vitest 4.1+。

迁移完成后：

- 确认在需要的地方，`vite` 导入已重写为 `vite-plus`
- 确认在需要的地方，`vitest` 导入已重写为 `vite-plus/test`（`@vitest/browser*` 重写为 `vite-plus/test/browser*`）
- 仅在确认这些重写后，再移除旧的 `vite`、`vitest` 和 `@vitest/browser*` 依赖——`vite-plus` 将它们作为直接依赖随包提供
- 将剩余的工具特定配置移到 `vite.config.ts` 中相应的块里

命令映射（需牢记）：

- `vp run <script>` 等价于 `pnpm run <script>`
- `vp test` 运行内置测试命令，而 `vp run test` 运行 `package.json` 中的 `test` 脚本
- `vp install`、`vp add` 和 `vp remove` 通过 `packageManager` 声明的包管理器委托
- `vp dev`、`vp build`、`vp preview`、`vp lint`、`vp fmt`、`vp check` 和 `vp pack` 替换对应的独立工具
- 优先使用 `vp check` 进行验证循环

最后，通过运行验证迁移：`vp install`、`vp check`、`vp test` 和 `vp build`

最后总结迁移并报告仍需手动跟进的事项。
```

## 特定工具迁移

### Vitest

Vitest 会通过 `vp migrate` 自动迁移。`vite-plus` 会将上游 `vitest@4.x` 以 `vite-plus/test*` 的形式重新导出，因此对于 node 模式测试，只需安装一次 `vite-plus` 即可——您不再需要直接安装 `vitest`。

浏览器模式则更复杂一些。`vite-plus` 捆绑了基础浏览器运行时（`@vitest/browser`）和预览提供程序（`@vitest/browser-preview`），但 **Playwright** 和 **WebdriverIO** 提供程序仍需按需启用：`@vitest/browser-playwright`（及其 `playwright` peer）和 `@vitest/browser-webdriverio`（及其 `webdriverio` peer）**不会**随 `vite-plus` 一同提供，因此非浏览器项目不会拉取它们。`vp migrate` 会检测您实际使用的提供程序并将其添加进去——固定到捆绑的 vitest 版本——以及其对应框架。如果您手动迁移并使用其中一种提供程序，请自行安装该提供程序包及其框架，以便 `vite-plus/test/browser-playwright` / `vite-plus/test/browser-webdriverio` 能够解析。

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

如果项目使用 `tsdown.config.ts`，将其选项移动到 `vite.config.ts` 的 `pack` 块中：

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

迁移后，从依赖中移除 lint-staged，并删除任何 lint-staged 配置文件。详情请参见 [提交钩子指南](/guide/commit-hooks) 和 [staged 配置参考](/config/staged)。

### Git hook 工具

`vp migrate` 命令可以为您设置 Vite+ 提交钩子，但它不会自动迁移所有类型的 Git hook 工具。这个自动迁移路径专门用于处理 Husky v9+ 和 lint-staged 风格的设置。使用低于 9.0.0 版本 Husky 的项目会被跳过，并且应在使用自动迁移路径之前升级到 Husky v9。

如果您的项目当前使用 `lefthook`、`simple-git-hooks` 或 `yorkie`，`vp migrate` 会保留您现有的配置不变并显示警告。即使您选择在提示过程中设置钩子，或包含 `--hooks` 标志，也会如此。

如果您想手动将这些工具迁移到 Vite+，可以按照以下步骤进行。首先，将您的 staged 文件命令移动到 `vite.config.ts` 中的 `staged` 块。然后，更新生命周期脚本以运行 `vp config`。您还需要在 `.vite-hooks/pre-commit` 中创建一个运行 `vp staged` 的 Vite+ 钩子。最后，在确认 Vite+ 钩子按预期工作后，您可以移除旧工具的配置和依赖。

您可以在 [提交钩子指南](/guide/commit-hooks) 中找到有关完整 Vite+ 钩子设置的更多细节。

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
