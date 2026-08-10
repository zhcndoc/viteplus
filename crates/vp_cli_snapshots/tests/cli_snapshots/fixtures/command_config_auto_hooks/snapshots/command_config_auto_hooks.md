# 命令配置自动钩子

## `git init`


## `vp config`

prepare 应安装调度器，但不应更改项目钩子策略

```

## `git config --local core.hooksPath`

应为 .vite-hooks/_

```
.vite-hooks/_
```

## `vpt print-file .vite-hooks/pre-commit`

项目拥有的钩子应保持不变

```
vp run lint
vp exec tsc --noEmit
```

## `vpt print-file vite.config.ts`

应保持不变

```
import { defineConfig } from 'vite-plus';

export default defineConfig({});
```
