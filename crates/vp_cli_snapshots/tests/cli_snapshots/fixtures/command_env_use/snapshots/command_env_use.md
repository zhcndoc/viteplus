# 命令环境使用

## `vp env use --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

Usage: vp env use [OPTIONS] [REQUESTS]...

Activate Node.js and package-manager versions for this shell session

Arguments:
  [REQUESTS]...  Component selectors or explicit versions to activate

选项：
  --unset                移除会话覆盖（恢复基于文件的解析）
  --no-install           如果版本不存在，则跳过自动安装
  --silent-if-unchanged  如果版本已处于激活状态，则不显示输出
  -h, --help             显示帮助（使用 “-h” 查看摘要）

Examples:
  vp env use 22.19.0  # Override Node.js for this session
  vp env use pnpm@12  # Override the package manager
  vp env use --unset  # Clear both session overrides

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
unset VP_NPM_VERSION
unset VP_PNPM_VERSION
unset VP_YARN_VERSION
unset VP_BUN_VERSION
Reverted selected components to project environment resolution
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

## `VP_NODE_VERSION=20.18.0 VP_NPM_VERSION=10.9.4 vp env use --silent-if-unchanged --no-install`

未发生变化的项目环境不会输出 shell 变更

```
```
