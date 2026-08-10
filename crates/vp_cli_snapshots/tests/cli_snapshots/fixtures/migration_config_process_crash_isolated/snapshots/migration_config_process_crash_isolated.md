# 迁移配置进程崩溃隔离

## `vp migrate --no-interactive --no-hooks`

项目配置处理程序不得终止迁移

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 1 个文件中的导入已重写
```

## `vpt print-file vite.config.ts`

兼容性探测崩溃后，迁移仍会重写配置

```
import { defineConfig } from 'vite-plus';

// 模拟一个项目插件：在加载其配置时安装进程级错误兜底处理。
// 在此处理程序中重新抛出错误会使 Node 以代码 7 退出，这曾导致
// `vp migrate` 在尽力进行兼容性检查期间终止，而不是继续迁移。
process.on('uncaughtException', (error) => {
  throw error;
});
queueMicrotask(() => {
  throw new Error('simulated project config crash');
});

export default defineConfig({
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
});
```
