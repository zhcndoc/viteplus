# 命令运行参数顺序

## `vp run -r hello`

新语法：在任务前使用 -r，递归运行

```
~/packages/lib-b$ echo hello from lib-b ⊘ cache disabled
hello from lib-b

~/packages/app-a$ echo hello from app-a ⊘ cache disabled
hello from app-a

---
vp run: 0/2 cache hit (0%). (Run `vp run --last-details` for full details)
```

## `vp run hello -r`

旧语法：`-r` 位于任务之后，会作为参数传递进去

**退出代码：** 1

```
Task "hello" not found. Did you mean:
  app-a#hello: echo hello from app-a
  lib-b#hello: echo hello from lib-b
```
