# 帮助

顶层帮助输出，每种风味各一份快照。对等性矩阵让两个命令界面保持一致。

## `vp help`

```
VITE+ - 面向 Web 的统一工具链

用法：vp [COMMAND]

启动：
  create      从模板创建新项目
  migrate     将现有项目迁移到 Vite+
  config      配置钩子和代理集成
  hooks       管理 Git 钩子分发器
  staged      对暂存文件运行代码检查器
  install, i  安装所有依赖，或在提供包名称时添加包
  env         管理 Node.js 版本

开发：
  dev          运行开发服务器
  check        运行格式化、lint 和类型检查
  lint         检查代码
  fmt, format  格式化代码
  test         运行测试

执行：
  run    运行任务（也可作为独立命令 `vpr` 使用）
  exec   从本地 node_modules/.bin 执行命令
  node   运行 Node.js 脚本（`env exec node` 的简写）
  dlx    执行包二进制文件而不将其作为依赖安装
  cache  管理任务缓存

构建：
  build    为生产环境构建
  pack     构建库
  preview  预览生产构建结果

管理依赖：
  add                        添加包到依赖中
  remove, rm, un, uninstall  从依赖中移除包
  update, up                 将包更新到最新版本
  dedupe                     通过移除旧版本去重依赖
  outdated                   检查过期包
  list, ls                   列出已安装的包
  why, explain               显示包为何被安装
  info, view, show           查看注册表中的包信息
  link, ln                   连接包以用于本地开发
  unlink                     取消包的链接
  rebuild                    重建原生模块
  pm                         将命令转发给包管理器

Maintain:
  toolchain  Show active Vite+ tools, versions, and relationships
  upgrade    Update vp itself to the latest version
  implode    Remove vp and all related data

文档：https://viteplus.dev/guide/

选项：
  -V, --version  打印版本
  -C <DIR>       如同在 <DIR> 中启动 vp，而不是在当前工作目录中启动
  -h, --help     打印帮助信息
```
