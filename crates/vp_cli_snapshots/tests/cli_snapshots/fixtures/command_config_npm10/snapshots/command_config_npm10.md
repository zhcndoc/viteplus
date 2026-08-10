# command_config_npm10

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

## `vp pm config get vite-plus-pm-config-test-key --location project`

应从项目作用域获取配置值

```
test-value
```

## `vp pm config delete vite-plus-pm-config-test-key --location project`

应从项目作用域删除配置键

```
```

## `vpt print-file .npmrc`

```
foo=bar
```
