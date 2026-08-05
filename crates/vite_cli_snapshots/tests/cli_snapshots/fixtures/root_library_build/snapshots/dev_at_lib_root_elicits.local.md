# dev_at_lib_root_elicits

build-config 信号仅用于构建：lib/SSR 根目录没有可供服务的应用，
因此在该根目录直接运行 vp dev 仍必须触发（没有 index.html），即使
vp build 会在原位置运行它。

## `vp dev`

**退出代码：** 1

```
[1m[31m错误：[39m[0m 工作区根目录中的 `vp dev` 需要指定目标包。

  此工作区中的包：
    ui  packages/ui

  传入一个目录：  vp -C packages/ui dev
  或运行每个包的 dev 脚本：  vp run -r dev
```
