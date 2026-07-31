# 环境安装二进制冲突

## `vp install -g ./env-binary-conflict-pkg-a`

安装提供 env-binary-conflict-cli 二进制文件的 pkg-a

```
VITE+ - Web 统一工具链

信息：正在使用 Node.js <version> 安装 1 个全局软件包
✓ 已安装 env-binary-conflict-pkg-a 1.0.0
  二进制文件：env-binary-conflict-cli
```

## `vpt print-file $VP_HOME/bins/env-binary-conflict-cli.json`

Bin 配置应指向 pkg-a

```
{
  "name": "env-binary-conflict-cli",
  "package": "env-binary-conflict-pkg-a",
  "version": "1.0.0",
  "nodeVersion": "<version>",
  "source": "vp"
}
```

## `vp install -g ./env-binary-conflict-pkg-b`

尝试在不使用强制选项的情况下安装 pkg-b——应该失败

**退出代码：** 1

```
VITE+ - Web 统一工具链

info: 正在使用 Node.js <version> 安装 1 个全局软件包
error: 安装 env-binary-conflict-pkg-b 失败：可执行文件 'env-binary-conflict-cli' 已由 env-binary-conflict-pkg-a 安装

请先移除 env-binary-conflict-pkg-a，然后再安装 env-binary-conflict-pkg-b，或者使用 --force 自动替换
```

## `vpt print-file $VP_HOME/bins/env-binary-conflict-cli.json`

Bin 配置仍应指向 pkg-a

```
{
  "name": "env-binary-conflict-cli",
  "package": "env-binary-conflict-pkg-a",
  "version": "1.0.0",
  "nodeVersion": "<version>",
  "source": "vp"
}
```

## `vp install -g --force ./env-binary-conflict-pkg-b`

强制安装 pkg-b - 应自动卸载 pkg-a

```
VITE+ - The Unified Toolchain for the Web

info: Installing 1 global package with Node.js <version>
Uninstalling env-binary-conflict-pkg-a (conflicts with env-binary-conflict-pkg-b)...
Uninstalled env-binary-conflict-pkg-a
✓ Installed env-binary-conflict-pkg-b 2.0.0
  Bins: env-binary-conflict-cli
```

## `vpt print-file $VP_HOME/bins/env-binary-conflict-cli.json`

Bin 配置现在应指向 pkg-b

```
{
  "name": "env-binary-conflict-cli",
  "package": "env-binary-conflict-pkg-b",
  "version": "2.0.0",
  "nodeVersion": "<version>",
  "source": "vp"
}
```

## `vp remove -g env-binary-conflict-pkg-b`

清理

```
已卸载 env-binary-conflict-pkg-b
```

## `vpt stat-file $VP_HOME/bins/env-binary-conflict-cli.json --assert missing`

Bin 配置应被删除

```
<home>/.vite-plus/bins/env-binary-conflict-cli.json: missing
```
