# member_config_ignored

defaultPackage 是一个根指针概念：工作区成员自身声明的配置
（此处指向一个不存在的目录）不得重定向或导致已在该成员中运行的命令
失败；打包操作就在原位置执行。

## `cd packages/ui && vp pack`

```
ℹ entry: src/index.ts
ℹ Build start
ℹ dist/index.mjs  <size> kB │ gzip: <size> kB
ℹ 1 files, total: <size> kB
✔ Build complete in <duration>
```
