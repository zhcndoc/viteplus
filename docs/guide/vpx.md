# 运行二进制文件

使用 `vpx`、`vp exec` 和 `vp dlx` 运行二进制文件，无需在本地安装、下载的包和项目特定工具之间切换。

## 概述

`vpx` 执行来自本地或远程 npm 包的命令。它可以运行已有的本地包，按需下载包，或指定目标版本。

当需要更严格的控制时，使用其他二进制命令：

- `vpx` 默认先在本地解析包的二进制文件，如果找不到则下载；通过 `pkg@version`、`--package/-p` 或 `--shell-mode`，它会通过 `vp dlx` 运行
- `vp exec` 从当前项目的 `node_modules/.bin` 运行二进制文件
- `vp dlx` 在不将包添加为依赖项的情况下运行包二进制文件

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
vpx typescript@5.5.4 tsc --version
vpx -p cowsay -c 'echo "hi" | cowsay'
```

## `vp exec`

当二进制文件必须来自当前项目时使用 `vp exec`，例如来自依赖项并安装在 `node_modules/.bin` 中的二进制文件。

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
vp dlx typescript tsc --version
```
