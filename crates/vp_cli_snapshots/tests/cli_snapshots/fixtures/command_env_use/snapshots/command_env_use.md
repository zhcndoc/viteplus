# 命令环境使用

## `vp env use --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp env use [选项] [版本]

为当前 Shell 会话使用指定的 Node.js 版本

参数：
  [VERSION]  要使用的版本（例如 “20”、“20.18.0”、“lts”、“latest”）。如果省略，则从 .node-version、package.json 或 .nvmrc 中读取

选项：
  --unset                移除会话覆盖（恢复基于文件的解析）
  --no-install           如果版本不存在，则跳过自动安装
  --silent-if-unchanged  如果版本已处于激活状态，则不显示输出
  -h, --help             显示帮助（使用 “-h” 查看摘要）

示例：
  vp env use lts        # 将会话覆盖为最新的 LTS 版本
  vp env use --unset    # 清除会话覆盖

文档：https://viteplus.dev/guide/env
```

## `vp env use 20.18.0 --no-install`

应将 export 命令输出到 stdout

```
export VP_NODE_VERSION=20.18.0
正在使用 Node.js <version>（由 20.18.0 解析）
```

## `vp env use --unset`

应将取消设置命令输出到标准输出

```
unset VP_NODE_VERSION
Reverted to file-based Node.js version resolution
```

## `vp env use d`

应针对无效版本显示友好的错误信息

**退出代码：** 1

```
错误：无效的 Node.js 版本：“d”

有效示例：
  vp env use 20          # 最新的 Node.js 20.x
  vp env use 20.18.0     # 精确版本
  vp env use lts         # 最新的 LTS 版本
  vp env use latest      # 最新版本
```

## `vp env use abc`

对于无效版本应显示友好的错误信息

**退出代码：** 1

```
错误：无效的 Node.js 版本：“abc”

有效示例：
  vp env use 20          # 最新的 Node.js 20.x 版本
  vp env use 20.18.0     # 精确版本
  vp env use lts         # 最新的 LTS 版本
  vp env use latest      # 最新版本
```
