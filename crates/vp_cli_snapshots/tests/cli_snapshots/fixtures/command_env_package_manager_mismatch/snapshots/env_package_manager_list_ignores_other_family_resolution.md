# env_package_manager_list_ignores_other_family_resolution

具体的系列选择器不得解析来自其他系列的项目所选管理器。

## `vpt write-file package.json '{"name":"command-env-package-manager-mismatch","private":true,"devEngines":{"packageManager":{"name":"pnpm","version":"^10.0.0"}}}
'`


## `NPM_CONFIG_REGISTRY=http://127.0.0.1:9 vp env list yarn --json`

包管理器选择器不会解析被排除的包管理器系列

```
{
  "package_managers": {
    "yarn": []
  }
}
```
