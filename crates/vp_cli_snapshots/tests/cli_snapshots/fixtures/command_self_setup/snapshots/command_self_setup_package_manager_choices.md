# command_self_setup_package_manager_choices

## `vpt mkdir -p external home`


## `vpt cp $VP_HOME/bin/vp external/vp`


## `vpt chmod +x external/vp`


## `VP_HOME=${workspace}/home VP_VERSION=pm-default VP_PM_MANAGER=yes VP_PNPM_MANAGER=no VP_YARN_MANAGER=no ./external/vp`

包管理器选择独立于 Node；pnpm 和 Yarn 会覆盖组默认设置


## `vpt print-file home/config.json`

```
{
  "nodeShimMode": "system_first",
  "packageManagerShimModes": {
    "bun": "managed",
    "npm": "managed",
    "pnpm": "system_first",
    "yarn": "system_first"
  }
}
```

## `VP_HOME=${workspace}/home VP_VERSION=pm-overrides VP_PM_MANAGER=no VP_NPM_MANAGER=yes VP_BUN_MANAGER=yes ./external/vp`

npm 和 Bun 可以选择加入管理，而其他系列优先使用系统工具


## `vpt print-file home/config.json`

```
{
  "nodeShimMode": "system_first",
  "packageManagerShimModes": {
    "bun": "managed",
    "npm": "managed",
    "pnpm": "system_first",
    "yarn": "system_first"
  }
}
```

## `VP_HOME=${workspace}/home VP_VERSION=pm-preserved VP_NODE_MANAGER=yes ./external/vp`

仅更改 Node 管理设置会保留所有已保存的包管理器选择


## `vpt print-file home/config.json`

```
{
  "packageManagerShimModes": {
    "bun": "managed",
    "npm": "managed",
    "pnpm": "system_first",
    "yarn": "system_first"
  }
}
```
