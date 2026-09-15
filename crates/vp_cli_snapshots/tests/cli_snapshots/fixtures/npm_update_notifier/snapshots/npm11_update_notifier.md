# npm11_update_notifier

即使项目启用了更新通知，由 Managed npm 11 commands 执行的命令也会禁用更新通知。

## `vp pm config get update-notifier`

```
false
```

## `vp install`

```
VITE+ - The Unified Toolchain for the Web

> npm-update-notifier@1.0.0 postinstall
> node -e "console.log('npm_config_update_notifier=' + process.env.npm_config_update_notifier)"

npm_config_update_notifier=false

up to date in <duration>
```
