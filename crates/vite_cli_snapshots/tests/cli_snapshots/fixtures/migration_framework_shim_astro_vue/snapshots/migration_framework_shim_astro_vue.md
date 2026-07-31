# 迁移框架垫片 Astro Vue

## `vp migrate --no-interactive --no-hooks`

迁移应添加 Vue 和 Astro 垫片

```
VITE+ - 面向 Web 的统一工具链

正在格式化代码...

代码格式化完成
◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
✓ 已在 <duration> 内安装依赖
• 已应用 1 项配置更新
• 已为框架组件文件添加 TypeScript 垫片
```

## `vpt print-file src/env.d.ts`

检查两个垫片文件是否都已写入

```
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, unknown>;
  export default component;
}

/// <reference types="astro/client" />
```
