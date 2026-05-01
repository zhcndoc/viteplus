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

- 确认 `vite` 导入已在需要处重写为 `vite-plus`
- 确认 `vitest` 导入已在需要处重写为 `vite-plus/test`
- 仅在确认这些重写完成后，才移除旧的 `vite` 和 `vitest` 依赖
- 将剩余特定工具配置移动到 `vite.config.ts` 中的相应块

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

Vitest 通过 `vp migrate` 自动迁移。如果手动迁移，您必须将所有导入更新为 `vite-plus/test`：

```ts
// 之前
import { describe, expect, it, vi } from 'vitest';

const { page } = await import('@vitest/browser/context');

// 之后
import { describe, expect, it, vi } from 'vite-plus/test';

const { page } = await import('vite-plus/test/browser/context');
```

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

迁移完成后，从依赖项中移除 lint-staged 并删除任何 lint-staged 配置文件。详细信息请参见 [提交钩子指南](/guide/commit-hooks) 和 [staged 配置参考](/config/staged)。
