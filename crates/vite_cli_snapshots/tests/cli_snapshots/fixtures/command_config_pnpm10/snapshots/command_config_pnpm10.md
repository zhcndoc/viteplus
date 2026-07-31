# 命令配置_pnpm10

## `vp pm config --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

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

## `vp pm config list --location project`

应列出所有项目配置


## `vp pm config set vite-plus-pm-config-test-key test-value --location project`

应在项目作用域设置配置值

```
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
