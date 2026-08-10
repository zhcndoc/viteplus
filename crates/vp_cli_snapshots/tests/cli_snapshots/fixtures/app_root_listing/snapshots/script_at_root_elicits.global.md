# script_at_root_elicits

通过 vp run 运行根包脚本 `"build": "vp build"` 时，会获得与直接裸调用相同的目标询问：生成的 vp 会打印列表，并且任务会失败，而不是静默地构建根包。

## `vp run build`

**退出代码：** 1

```
$ vp build ⊘ 缓存已禁用

[1m[31m错误：[39m[0m 工作区根目录中的 `vp build` 需要指定目标包。

  此工作区中的包：
    admin  apps/admin
    web    apps/web
    ui     packages/ui

  传入目录：  vp -C apps/admin build
  或运行每个包的构建脚本：  vp run -r build
```
