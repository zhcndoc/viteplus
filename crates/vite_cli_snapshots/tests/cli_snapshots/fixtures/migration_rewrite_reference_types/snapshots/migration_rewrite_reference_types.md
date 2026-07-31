# 迁移_重写_引用_类型

## `vp migrate --no-interactive`

vitest/tsdown 引用类型已重写；vite 引用已保留（问题 #2004）

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新，已重写 1 个文件中的导入
```

## `vpt print-file src/env.d.ts`

vite 引用保持为 vite（非配置）；vitest/tsdown 引用变为 vite-plus

```
/// <reference types="vite" />
/// <reference types="vite/client" />
/// <reference types="vite-plus/test" />
/// <reference types="vite-plus/test/globals" />
/// <reference types="vite-plus" />
/// <reference types="vite-plus/test/browser/context" />
/// <reference types="vite-plus/pack/client" />
```
