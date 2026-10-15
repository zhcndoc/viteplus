# 运行二进制文件

使用 `vpx`、`vp exec` 和 `vp dlx` 运行二进制文件，无需在本地安装、下载的包和项目特定工具之间切换。

## 概述

`vpx` 执行来自本地或远程 npm 包的命令。它可以运行已有的本地包，按需下载包，或指定目标版本。

当需要更严格的控制时，使用其他二进制命令：

- `vpx` 默认按顺序在本地 `node_modules/.bin` 目录、Vite+ 管理的全局软件包和系统 `PATH` 中查找二进制文件，找不到时回退到 `vp dlx`。通过 `pkg@version`、`--package/-p` 或 `--shell-mode`，它会直接通过 `vp dlx` 运行
- `vp exec` 从本地 `node_modules/.bin` 目录运行命令，找不到时回退到 `PATH`
- `vp dlx` 在不将软件包添加为依赖项的情况下运行软件包二进制文件

## `vpx`

使用 `vpx` 运行任意本地或远程二进制文件：

```bash
vpx <pkg[@version]> [args...]
```

### 选项

- `-p, --package <name>` 在运行命令前安装一个或多个额外的包
- `-c, --shell-mode` 在 shell 中执行命令
- `-s, --silent` 抑制 Vite+ 输出，只显示命令输出

### 示例

```bash
vpx eslint .
vpx create-vue my-app
vpx oxlint@1.85.0 --version
vpx -p cowsay -c 'echo "hi" | cowsay'
```

## `vp exec`

使用 `vp exec` 运行已安装在项目中或可在环境中使用的工具。

```bash
vp exec <command> [args...]
```

示例：

```bash
vp exec eslint .
vp exec tsc --noEmit
```

## `vp dlx`

使用 `vp dlx` 在不将包添加到项目依赖项的情况下执行一次性包。

```bash
vp dlx <package> [args...]
```

示例：

```bash
vp dlx create-vite
vp dlx oxlint@1.85.0 --version
```
