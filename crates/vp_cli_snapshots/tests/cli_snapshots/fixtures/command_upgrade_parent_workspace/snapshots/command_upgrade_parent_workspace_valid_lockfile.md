# command_upgrade_parent_workspace_valid_lockfile

即使父工作区锁定文件有效，升级也必须安装其自身的依赖项

## `node setup.mjs --valid-lockfile`


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

父工作区锁定文件未更改。

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
