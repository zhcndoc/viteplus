# 命令钩子帮助

## `vp hooks -h`

```
VITE+ - The Unified Toolchain for the Web

Usage: vp hooks <COMMAND> [OPTIONS]

Manage the Vite+ Git hook dispatcher for this repository.

Commands:
  enable   Install or refresh the hook dispatcher (sets core.hooksPath)
  disable  Disable hooks: unset core.hooksPath, remove <dir>/_, persist preference
  status   Show preference, core.hooksPath, and dispatcher state

Options:
  --hooks-dir <path>  Custom hooks directory (default: .vite-hooks, or last used)
  -h, --help          Show this help message

Environment:
  VP_GIT_HOOKS=0  Skip dispatcher install in enable (and skip hooks at commit time)

Examples:
  vp hooks enable
  vp hooks enable --hooks-dir .custom-hooks
  vp hooks disable
  vp hooks status

Documentation: https://viteplus.dev/guide/commit-hooks
```

## `vp hooks --help`

```
VITE+ - Web 的统一工具链

用法：vp hooks <COMMAND> [OPTIONS]

管理此仓库的 Vite+ Git 钩子调度器。

命令：
  enable   安装或刷新钩子调度器（设置 core.hooksPath）
  disable  禁用钩子：取消设置 core.hooksPath，移除 <dir>/_，持久化偏好设置
  status   显示偏好设置、core.hooksPath 和调度器状态

选项：
  --hooks-dir <path>  自定义钩子目录（默认为 .vite-hooks，或上次使用的目录）
  -h, --help          显示此帮助信息

环境变量：
  VP_GIT_HOOKS=0  在 enable 时跳过调度器安装（并在提交时跳过钩子）

示例：
  vp hooks enable
  vp hooks enable --hooks-dir .custom-hooks
  vp hooks disable
  vp hooks status

文档：https://viteplus.dev/guide/commit-hooks
```

## `vp help hooks`

```
VITE+ - 面向 Web 的统一工具链

用法：vp hooks <COMMAND> [OPTIONS]

管理此仓库的 Vite+ Git 钩子分发器。

命令：
  enable   安装或刷新钩子分发器（设置 core.hooksPath）
  disable  禁用钩子：取消设置 core.hooksPath，移除 <dir>/_，保存偏好设置
  status   显示偏好设置、core.hooksPath 和分发器状态

选项：
  --hooks-dir <path>  自定义钩子目录（默认为 .vite-hooks，或上次使用的目录）
  -h, --help          显示此帮助信息

环境变量：
  VP_GIT_HOOKS=0  在 enable 中跳过分发器安装（并在提交时跳过钩子）

示例：
  vp hooks enable
  vp hooks enable --hooks-dir .custom-hooks
  vp hooks disable
  vp hooks status

文档：https://viteplus.dev/guide/commit-hooks
```
