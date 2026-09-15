# command_upgrade_parent_workspace_stale_lockfile

针对 #2639 的回归测试：在父级 pnpm 工作区外调用的升级不得读取其过期的锁文件

## `node setup.mjs`


## `VP_HOME=${workspace}/home/.vite-plus vp upgrade 0.3.1 --force`


## `vpt stat-file home/.vite-plus/current/node_modules/vite-plus/package.json --assert file`

```
home/.vite-plus/current/node_modules/vite-plus/package.json: file
```

## `vpt stat-file home/node_modules home/apps-ts/kami/node_modules --assert missing`

```
home/node_modules: missing
home/apps-ts/kami/node_modules: missing
```

## `vpt print-file home/pnpm-lock.yaml`

父级工作区锁文件未发生变化

```
lockfileVersion: '9.0'

settings:
  autoInstallPeers: true
  excludeLinksFromLockfile: false

importers:
  .:
    dependencies:
      kami:
        specifier: workspace:*
        version: link:apps-ts/kami
  apps-ts/kami: {}
```
