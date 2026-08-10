# dev_at_lib_root_elicits

构建配置的信号仅适用于构建：lib/SSR 根目录没有可供服务的应用，
因此在该根目录直接运行 vp dev 仍必须触发（没有 index.html），即使
vp build 会在原位置运行它。

## `vp dev`

**退出代码：** 1

```
[1m[31merror:[39m[0m `vp dev` at the workspace root needs a target package.

  Packages in this workspace:
    ui  packages/ui

  Pass a directory:  vp -C packages/ui dev
  Or run every package's dev script:  vp run -r dev
```
