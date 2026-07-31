# 迁移框架垫片 Astro

## `vp migrate --no-interactive --no-hooks`

检测到 Astro 依赖时，迁移应添加 Astro 垫片

```
VITE+ - Web 统一工具链

正在格式化代码...

代码格式化完成
◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
✓ 已在 <duration> 内安装依赖
• 已应用 1 项配置更新
• 已为框架组件文件添加 TypeScript 垫片
```

## `vpt print-file src/env.d.ts`

检查 Astro shim 是否已写入

```
/// <reference types="astro/client" />
```
