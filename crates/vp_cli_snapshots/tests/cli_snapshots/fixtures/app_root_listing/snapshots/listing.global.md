# 列表

在工作区根目录中执行不带交互式终端的裸应用命令时，会打印带有 -C
提示的已排序软件包列表，并以 1 退出，而不是构建根目录（rfcs/cwd-flag.md）。

## `vp build`

**退出代码：** 1

```
[1m[2m提示：[0m[0m 您正在将 [94m`vp build`[39m 作为 Vite+ 内置命令运行。如果您想运行 build npm 脚本，请改用 [94m`vpr build`[39m。
[1m[31m错误：[39m[0m 工作区根目录中的 `vp build` 需要指定目标软件包。

  此工作区中的软件包：
    admin  apps/admin
    web    apps/web
    ui     packages/ui

  传入一个目录：  vp -C apps/admin build
  或运行每个软件包的 build 脚本：  vp run -r build
```

## `vp dev`

根目录下的 dev 不再针对根目录启动服务器

**退出代码：** 1

```
[1m[31m错误：[39m[0m 工作区根目录下的 `vp dev` 需要指定目标包。

  此工作区中的包：
    admin  apps/admin
    web    apps/web
    ui     packages/ui

  传入目录：  vp -C apps/admin dev
  或运行每个包的 dev 脚本：  vp run -r dev
```
