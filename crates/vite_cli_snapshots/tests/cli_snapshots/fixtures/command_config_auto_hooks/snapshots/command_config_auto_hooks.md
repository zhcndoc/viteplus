# command_config_auto_hooks

## `git init`


## `vp config`

应在不提示的情况下自动安装钩子（暂存配置已存在）

```

## `git config --local core.hooksPath`

应为 .vite-hooks/_

```
.vite-hooks/_
```

## `vpt print-file .vite-hooks/pre-commit`

应包含 vp staged

```
vp staged
```

## `vpt print-file vite.config.ts`

应保持不变

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    '*': 'vp check --fix',
  },
});
```
