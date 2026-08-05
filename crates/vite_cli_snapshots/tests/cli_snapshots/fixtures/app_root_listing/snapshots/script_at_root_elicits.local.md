# 根目录脚本触发目标选择提示

通过 `vp run` 运行根目录脚本 `"build": "vp build"` 时，会得到与直接裸调用相同的目标选择提示：派生的 vp 会打印列表，并且任务失败，而不是静默构建根目录。

## `vp run build`

**退出代码：** 1

```
$ vp build ⊘ cache disabled

[1m[31merror:[39m[0m `vp build` at the workspace root needs a target package.

  Packages in this workspace:
    admin  apps/admin
    web    apps/web
    ui     packages/ui

  Pass a directory:  vp -C apps/admin build
  Or run every package's build script:  vp run -r build
```
