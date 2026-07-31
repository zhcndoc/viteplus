# 将所有无效值回退到用户默认值

## `vp env default 22.18.0`

设置用户默认版本

```
VITE+ - The Unified Toolchain for the Web

✓ Default Node.js version set to 22.18.0
```

## `vp exec node -e console.log(process.version)`

应使用默认版本 22.18.0，而不是 LTS 版本

```
VITE+ - The Unified Toolchain for the Web

warning: invalid version 'invalid' in engines.node, ignoring
<version>
```
