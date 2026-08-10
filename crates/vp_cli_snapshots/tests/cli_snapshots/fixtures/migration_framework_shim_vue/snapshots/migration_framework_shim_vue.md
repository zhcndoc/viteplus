# Vue 迁移框架适配层

## `vp migrate --no-interactive --no-hooks`

检测到 Vue 依赖时，迁移应添加 Vue 类型垫片

```
VITE+ - Web 的统一工具链

正在格式化代码...

代码已格式化
◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
✓ 已在 <duration> 内安装依赖
• 已应用 1 项配置更新
• 已为框架组件文件添加 TypeScript 类型垫片
```

## `vpt print-file src/env.d.ts`

检查 Vue shim 是否已写入

```
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, unknown>;
  export default component;
}
```
