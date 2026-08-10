# npm_global_uninstall_link_cleanup

## `npm install -g ./npm-global-uninstall-pkg`

首先安装软件包

```

已添加 1 个软件包，耗时 <duration>
已将 'npm-global-uninstall-cli' 链接到 <home>/.vite-plus/bin/npm-global-uninstall-cli
```

## `vpt stat-file $VP_HOME/bin/npm-global-uninstall-cli --assert symlink`

安装后链接应存在

```
<home>/.vite-plus/bin/npm-global-uninstall-cli: symlink
```

## `npm uninstall -g npm-global-uninstall-pkg`

卸载应移除链接

```

已移除 1 个软件包，耗时 <duration>
已从 <home>/.vite-plus/bin/npm-global-uninstall-cli 移除链接 “npm-global-uninstall-cli”
```

## `vpt stat-file $VP_HOME/bin/npm-global-uninstall-cli --assert-not symlink`

链接应已消失

```
<home>/.vite-plus/bin/npm-global-uninstall-cli: missing
```
