# env_node_list_ignores_package_manager_resolution

组件选择器不得解析被排除的组件，也不得将无关的本地列表操作转变为网络操作

## `vpt write-file package.json '{"name":"command-env-package-manager-mismatch","private":true,"devEngines":{"packageManager":{"name":"pnpm","version":"^10.0.0"}}}
'`


## `NPM_CONFIG_REGISTRY=http://127.0.0.1:9 vp env list node --json`

node 选择器不会解析被排除的包管理器

```
{
  "node": []
}
```

## `NPM_CONFIG_REGISTRY=http://127.0.0.1:9 vp env list-remote 20.18.0 --lts --json`

隐式 node 选择器不会解析被排除的包管理器

```
{
  "node": [
    {
      "version": "20.18.0",
      "lts": "Iron",
      "latest": false,
      "latest_lts": false,
      "installed": false,
      "current": false,
      "default": false
    }
  ]
}
```
