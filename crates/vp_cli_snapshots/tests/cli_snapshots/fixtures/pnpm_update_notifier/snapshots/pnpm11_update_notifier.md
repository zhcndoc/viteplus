# pnpm11_update_notifier

托管的 pnpm 11 命令会禁用更新通知，即使项目启用了更新通知

## `vp pm config get updateNotifier`

```
false
```

## `vp install`

```
VITE+ - The Unified Toolchain for the Web

Already up to date
. postinstall$ node -e "console.log('PNPM_CONFIG_UPDATE_NOTIFIER=' + process.env.PNPM_CONFIG_UPDATE_NOTIFIER)"
│ PNPM_CONFIG_UPDATE_NOTIFIER=false
└─ Done in <duration>

Done in <duration> using pnpm <version>
```
