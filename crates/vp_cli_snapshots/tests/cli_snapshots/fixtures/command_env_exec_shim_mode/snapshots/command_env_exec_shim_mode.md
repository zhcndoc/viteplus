# command_env_exec_shim_mode

## `vp env exec node -v`

Shim 模式：版本根据 package.json 中的 engines.node 解析

```
<version>
```

## `vp env exec npm -v`

Shim 模式：npm 使用相同版本

```
10.8.2
```

## `vp env exec node -e 'console.log('\''Hello from shim mode'\'')'`

Shim 模式：运行内联脚本

```
Hello from shim mode
```

## `vp env exec nonexistent-tool --version`

预期错误：非 shim 命令需要 `--node`

**退出代码：** 1

```
vp env exec：运行非 shim 命令时需要 --node
用法：vp env exec --node <version> <command> [args...]

对于 shim 工具，--node 可选（自动解析版本）：
  vp env exec node script.js    # 核心工具
  vp env exec npm install       # 核心工具
  vp env exec tsc --version     # 全局包
```
