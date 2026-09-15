# env_package_manager_list_stays_offline_for_floating_default

本地清单会复用浮动默认值的缓存具体结果，而无需访问注册表。

## `vpt write-file $VP_HOME/package_manager/pnpm/10.18.0/pnpm/bin/pnpm '#'\!'/bin/sh
'`


## `vpt write-file $VP_HOME/package_manager/pnpm/10.18.0/pnpm/bin/pnpx '#'\!'/bin/sh
'`


## `vp env default pnpm@latest`


## `NPM_CONFIG_REGISTRY=http://127.0.0.1:9 vp env list pnpm --json`

当浮动默认值无法访问注册表时，本地列表仍然可用

```
{
  "package_managers": {
    "pnpm": [
      {
        "version": "10.18.0",
        "current": true,
        "default": false
      }
    ]
  }
}
```
