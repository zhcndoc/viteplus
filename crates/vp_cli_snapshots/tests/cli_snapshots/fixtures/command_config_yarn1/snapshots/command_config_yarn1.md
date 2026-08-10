# command_config_yarn1

## `vp pm config --help`

应显示帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp pm config <COMMAND>

管理包管理器配置

命令：
  list    列出所有配置
  get     获取配置值
  set     设置配置值
  delete  删除配置键

选项：
  -h, --help  打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp pm config set vite-plus-pm-config-test-key test-value --location project`

应在项目作用域中设置配置值（对 yarn@1 显示警告）

```
警告：yarn@1 不支持 --location，忽略该标志
yarn config <version>
警告 package.json：未设置许可证字段
成功将“vite-plus-pm-config-test-key”设置为“test-value”。

已完成，耗时 <duration>。
```

## `vp pm config get vite-plus-pm-config-test-key --location project`

应从项目作用域获取配置值（针对 yarn@1 显示警告）

```
warn: yarn@1 does not support --location, ignoring flag
warning package.json: No license field
test-value
```

## `vp pm config delete vite-plus-pm-config-test-key --location project`

应从项目作用域删除配置键（对 yarn@1 显示警告）

```
warn: yarn@1 does not support --location, ignoring flag
yarn config <version>
warning package.json: No license field
success Deleted "vite-plus-pm-config-test-key".

Done in <duration>.
```
