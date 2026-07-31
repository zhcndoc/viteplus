# 将无效引擎回退到开发引擎

## `vp exec node -e console.log(process.version)`

应使用 devEngines.runtime 22.18.0，而不是 LTS

```
VITE+ - The Unified Toolchain for the Web

warning: invalid version 'invalid' in engines.node, ignoring
<version>
```

## `vp env which node`

应显示 devEngines.runtime 来源

```
VITE+ - The Unified Toolchain for the Web

<home>/.vite-plus/js_runtime/node/<version>/bin/node
  Version:    22.18.0
  Source:     <workspace>/package.json
```
