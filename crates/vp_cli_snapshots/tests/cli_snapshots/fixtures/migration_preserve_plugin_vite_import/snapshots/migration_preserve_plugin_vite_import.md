# 迁移_保留_插件_vite_导入

## `vp migrate --no-interactive --no-hooks`

仅在配置入口文件中将 `vite` 重写为 vite-plus；其他所有文件均保留其 `vite` 导入（issue #2004）

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已重写 1 个文件中的导入
```

## `vpt print-file vite.config.ts`

已重写：配置入口的 `defineConfig` 导入变为 vite-plus

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
});
```

## `vpt print-file packages/app/src/main.ts`

保留：普通应用中非配置用途的 `vite` 导入（`createServer`、`typeof import`）保持使用 `vite`

```
import { createServer } from 'vite';

// Vite 核心的编程式 API。`vite-plus` 不会在其公共接口上重新暴露它，
// 因此此导入（以及下面的类型位置）必须保持使用 `vite`，
// 而不是重写为 `vite-plus`（问题 #2004）。
export type ViteApi = Pick<typeof import('vite'), 'createBuilder' | 'loadConfigFromFile'>;

export async function start() {
  const server = await createServer();
  await server.listen();
}
```

## `vpt print-file packages/vite-plugin-demo/index.ts`

已保留：vite-plugin-* 包保留 `from 'vite'`，因此它仍可供纯 Vite 项目使用

```
import type { Plugin } from 'vite';

export default function demo(): Plugin {
  return { name: 'vite-plugin-demo' };
}
```

## `vpt print-file packages/unplugin-demo/src/index.ts`

保留：unplugin-* 包仍然保留 `from 'vite'`

```
import type { Plugin } from 'vite';

export function vitePlugin(): Plugin {
  return { name: 'unplugin-demo' };
}
```
