# 委托遵循默认节点版本

## `vp env default 22.18.0`

将全局默认版本设置为 22.18.0

```
VITE+ - Web 统一工具链

✓ 默认 Node.js 版本已设置为 22.18.0
```

## `vp run check-node`

还应使用 22.18.0

```
VITE+ - The Unified Toolchain for the Web

$ node -e "console.log(process.version)" ⊘ cache disabled
<version>
```

## `vp exec node -e console.log(process.version)`

也应使用 22.18.0

```
VITE+ - The Unified Toolchain for the Web

<version>
```

## `vp env which node`

应显示来自“默认”来源的 22.18.0

```
VITE+ - 面向 Web 的统一工具链

<home>/.vite-plus/js_runtime/node/<version>/bin/node
  版本：    22.18.0
  来源：    <home>/.vite-plus/config.json
```
