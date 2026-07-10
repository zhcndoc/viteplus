# 创建 framework_shim_vue

## `vp create vite:application --no-interactive -- --template vue-ts`

创建 Vue+TS 应用


## `vpt print-file vite-plus-application/src/env.d.ts`

检查是否已添加 Vue shim

```
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, unknown>;
  export default component;
}
```

## `cd vite-plus-application && vp install`

安装依赖


## `cd vite-plus-application && vp check --fix`

修复生成的格式并确保没有错误

```
VITE+ - 面向 Web 的统一工具链

通过：已完成所检查文件的格式化（<duration>）
通过：在 5 个文件中未发现警告、lint 错误或类型错误（<duration>，<n> 线程）
```
