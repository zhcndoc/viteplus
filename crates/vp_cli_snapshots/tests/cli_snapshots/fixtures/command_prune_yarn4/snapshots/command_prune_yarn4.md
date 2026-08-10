# command_prune_yarn4

## `vp pm prune --help`

应显示帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp pm prune [选项] [-- <PASS_THROUGH_ARGS>...]

移除不必要的软件包

参数：
  [PASS_THROUGH_ARGS]...  其他参数

选项：
  --prod         移除 devDependencies
  --no-optional  移除可选依赖
  -h, --help     显示帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp pm prune`

应显示警告，说明 yarn 不支持 prune 命令

```
warn: yarn does not have 'prune' command. yarn install will prune extraneous packages automatically.
```
