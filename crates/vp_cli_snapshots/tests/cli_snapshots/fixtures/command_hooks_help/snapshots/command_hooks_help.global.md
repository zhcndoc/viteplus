# 命令钩子帮助

## `vp hooks -h`

```
VITE+ - 面向 Web 的统一工具链

用法：vp hooks <COMMAND] [OPTIONS]

管理此仓库的 Vite+ Git 钩子分发器。

Options:
  -h, --help  Show this help message

Commands:
  enable   Install or refresh the hook dispatcher (sets core.hooksPath)
  disable  Disable hooks: unset core.hooksPath, remove <dir>/_, persist preference
  status   Show preference, core.hooksPath, and dispatcher state

Environment:
  VP_GIT_HOOKS=0  Skip dispatcher install in enable (and skip hooks at commit time)

示例：
  vp hooks enable
  vp hooks enable --hooks-dir .custom-hooks
  vp hooks disable
  vp hooks status

文档：https://viteplus.dev/guide/commit-hooks
```

## `vp hooks --help`

```
VITE+ - Web 的统一工具链

用法：vp hooks <COMMAND] [OPTIONS]

管理此仓库的 Vite+ Git 钩子分发器。

Options:
  -h, --help  Show this help message

Commands:
  enable   Install or refresh the hook dispatcher (sets core.hooksPath)
  disable  Disable hooks: unset core.hooksPath, remove <dir>/_, persist preference
  status   Show preference, core.hooksPath, and dispatcher state

Environment:
  VP_GIT_HOOKS=0  Skip dispatcher install in enable (and skip hooks at commit time)

示例：
  vp hooks enable
  vp hooks enable --hooks-dir .custom-hooks
  vp hooks disable
  vp hooks status

文档：https://viteplus.dev/guide/commit-hooks
```

## `vp hooks enable --help`

```
VITE+ - The Unified Toolchain for the Web

Usage: vp hooks enable [OPTIONS]

Install or refresh the hook dispatcher (sets core.hooksPath)

Options:
  --hooks-dir <path]  Custom hooks directory (default: .vite-hooks, or last used)
  -h, --help          Show this help message

Documentation: https://viteplus.dev/guide/commit-hooks
```

## `vp help hooks`

```
VITE+ - 面向 Web 的统一工具链

用法：vp hooks <COMMAND] [OPTIONS]

管理此仓库的 Vite+ Git 钩子分发器。

Options:
  -h, --help  Show this help message

Commands:
  enable   Install or refresh the hook dispatcher (sets core.hooksPath)
  disable  Disable hooks: unset core.hooksPath, remove <dir>/_, persist preference
  status   Show preference, core.hooksPath, and dispatcher state

Environment:
  VP_GIT_HOOKS=0  Skip dispatcher install in enable (and skip hooks at commit time)

示例：
  vp hooks enable
  vp hooks enable --hooks-dir .custom-hooks
  vp hooks disable
  vp hooks status

文档：https://viteplus.dev/guide/commit-hooks
```
