# 创建项目

`vp create` 可以在现有的工作区中交互式地搭建新的 Vite+ 项目、单体仓库和应用。

## 概述

`create` 命令是开始使用 Vite+ 的最快方式。它可以通过以下几种方式使用：

- 启动一个新的 Vite+ 单体仓库
- 创建一个新的独立应用程序或库
- 在现有项目中添加新的应用程序或库

此命令可以使用内置模板、社区模板或远程 GitHub 模板。

## 用法

```bash
vp create
vp create <template>
vp create <template> -- <template-options>
```

## 内置模板

Vite+ 提供以下内置模板：

- `vite:monorepo` 创建一个新的单体仓库
- `vite:application` 创建一个新的应用程序
- `vite:library` 创建一个新的库
- `vite:generator` 创建一个新的生成器

## 模板来源

`vp create` 不仅限于内置模板。

- 使用简写模板，如 `vite`、`@tanstack/start`、`svelte`、`next-app`、`nuxt`、`react-router` 和 `vue`
- 使用完整的包名，如 `create-vite` 或 `create-next-app`
- 使用本地模板，如 `./tools/create-ui-component` 或 `@acme/generator-*`
- 使用远程模板，如 `github:user/repo` 或 `https://github.com/user/template-repo`

运行 `vp create --list` 可查看 Vite+ 识别的内置模板和常用简写模板。

## 选项

- `--directory <dir>` 将生成的项目写入指定的目标目录
- `--agent` 在搭建过程中创建代理指令文件
- `--editor` 写入编辑器配置文件
- `--hooks` 启用预提交钩子设置
- `--no-hooks` 跳过钩子设置
- `--no-interactive` 无提示运行
- `--verbose` 显示详细的搭建输出
- `--list` 打印可用的内置和流行模板

## 模板选项

`--` 后的参数会直接传递给选定的模板。

当模板本身接受标志时，这一点很重要。例如，可以像这样转发 Vite 模板选择：

```bash
vp create vite -- --template react-ts
```

## 示例

```bash
# 交互模式
vp create

# 创建 Vite+ 单体仓库、应用程序、库或生成器
vp create vite:monorepo
vp create vite:application
vp create vite:library
vp create vite:generator

# 使用简写社区模板
vp create vite
vp create @tanstack/start
vp create svelte

# 使用完整的包名
vp create create-vite
vp create create-next-app

# 使用远程模板
vp create github:user/repo
vp create https://github.com/user/template-repo
```
