# npm_全局卸载_vp_管理

## `vp install -g ./npm-global-vp-managed-pkg`

通过 vp 安装（创建受管理的 shim）

```
VITE+ - Web 的统一工具链

信息：正在使用 Node.js <version> 安装 1 个全局软件包
✓ 已安装 npm-global-vp-managed-pkg 1.0.0
  可执行文件：npm-global-vp-managed-cli
```

## `npm install -g ./npm-global-vp-managed-pkg`

npm install（应警告冲突）

```

added 1 package in <duration>
Skipped 'npm-global-vp-managed-cli': managed by `vp install -g npm-global-vp-managed-pkg`. Run `vp uninstall -g npm-global-vp-managed-pkg` to remove it first.
```

## `npm uninstall -g npm-global-vp-managed-pkg`

npm uninstall 不应删除 vp 管理的 shim

```

已删除 1 个软件包，用时 <duration>
```

## `vpt stat-file $VP_HOME/bin/npm-global-vp-managed-cli`

Shim 应仍然存在

```
<home>/.vite-plus/bin/npm-global-vp-managed-cli: symlink
```

## `npm-global-vp-managed-cli`

验证 shim 仍然有效

```
npm-global-vp-managed-cli works
```

## `vp remove -g npm-global-vp-managed-pkg`

清理

```
已卸载 npm-global-vp-managed-pkg
```
