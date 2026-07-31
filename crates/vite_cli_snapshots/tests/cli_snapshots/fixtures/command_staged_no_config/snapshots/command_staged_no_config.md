# command_staged_no_config

## `vp staged`

应在缺少 staged 配置时发出警告，并以代码 1 退出

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: No "staged" config found in vite.config.ts. Please add a staged config:

  // vite.config.ts
  export default defineConfig({
    staged: { '*': 'vp check --fix' },
  });
```
