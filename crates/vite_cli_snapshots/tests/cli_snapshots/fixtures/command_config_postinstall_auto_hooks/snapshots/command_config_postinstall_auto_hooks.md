# command_config_postinstall_auto_hooks

## `git init`


## `vp config`

应在不提示的情况下自动安装钩子

```
```

## `git config --local core.hooksPath`

应为 .vite-hooks/_

```
.vite-hooks/_
```

## `vpt print-file .vite-hooks/pre-commit`

应该包含 vp staged

```
vp staged
```

## `vpt print-file vite.config.ts`

应包含 staged 配置

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  staged: {
    "*": "vp check --fix"
  },

});
```
