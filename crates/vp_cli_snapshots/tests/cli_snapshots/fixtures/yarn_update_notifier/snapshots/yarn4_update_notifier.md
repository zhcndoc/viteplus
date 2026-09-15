# yarn4_update_notifier

Managed Yarn 4 会禁用每日提示，包括版本通知，但不会更改遥测设置

## `vpt json-edit package.json packageManager yarn@4.12.0`


## `vpt write-file .yarnrc.yml 'enableTelemetry: true
enableTips: true
'`


## `vp pm config get enableTips`

```
false
```

## `vp pm config get enableTelemetry`

```
true
```

## `vp install`

```
VITE+ - The Unified Toolchain for the Web

➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```
