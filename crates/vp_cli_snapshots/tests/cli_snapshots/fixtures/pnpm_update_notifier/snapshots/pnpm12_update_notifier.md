# pnpm12_update_notifier

管理 pnpm 12 命令时，即使项目启用了更新通知，也会禁用更新通知。

## `vpt json-edit package.json packageManager pnpm@12.3.4`


## `vp pm config get updateNotifier`

```
false
```

## `vp install`

```
VITE+ - The Unified Toolchain for the Web

. postinstall$ node -e "console.log('PNPM_CONFIG_UPDATE_NOTIFIER=' + process.env.PNPM_CONFIG_UPDATE_NOTIFIER)"
│ PNPM_CONFIG_UPDATE_NOTIFIER=false
└─ Done in <duration}
Already up to date

Done in <duration} using pnpm <version}
```
