# npm_global_install_already_linked

## `npm config get prefix`

```
<npm-prefix>
```

## `vp install -g ./npm-global-linked-pkg`

首先通过 vp 安装（创建受管理的 shim）

```
VITE+ - The Unified Toolchain for the Web

info: Installing 1 global package with Node.js <version>
✓ Installed npm-global-linked-pkg 1.0.0
  Bins: npm-global-linked-cli
```

## `npm-global-linked-cli`

应可通过链接调用

```
npm-global-linked-cli works
```

## `npm install -g ./npm-global-linked-pkg`

不应创建重复链接

```

已添加 1 个包，用时 <duration>
已跳过“npm-global-linked-cli”：由 `vp install -g npm-global-linked-pkg` 管理。请先运行 `vp uninstall -g npm-global-linked-pkg` 将其移除。
```

## `vp remove -g npm-global-linked-pkg`

清理

```
Uninstalled npm-global-linked-pkg
```

## `vpt stat-file $VP_HOME/bin/npm-global-linked-cli`

应移除链接

```
<home>/.vite-plus/bin/npm-global-linked-cli: missing
```
