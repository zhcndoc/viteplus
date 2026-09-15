# env_package_manager_list_stays_offline_for_selected_range

即使标记选定的软件包管理器范围需要尽力解析，本地清单也必须保持离线可用

## `vpt write-file package.json '{"name":"command-env-package-manager-mismatch","private":true,"devEngines":{"packageManager":{"name":"pnpm","version":"^10.0.0"}}}
'`


## `NPM_CONFIG_REGISTRY=http://127.0.0.1:9 vp env list pm --json`

当选定范围无法访问注册表时，本地列表仍然可用

```
{
  "package_managers": {
    "bun": [],
    "npm": [],
    "pnpm": [],
    "yarn": []
  }
}
```
