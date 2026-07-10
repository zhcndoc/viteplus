# ctrlc_interrupt

脚本化一个 ctrl-c：`vpt exit-on-ctrlc` 发出一个 `ready` 里程碑，等待中断，然后打印并退出。这是运行器隔离的唯一场景：ctrl-c 情况会被自动检测为对信号敏感（参见 `case_needs_isolation`），并获取独占执行租约，因此并行 PTY 的信号路由在影响它们时不会造成干扰，而其他所有情况仍然可以并发运行。

## `vpt exit-on-ctrlc`

**→ 期望里程碑：** `ready`

```
```

**← 写入键：** `ctrl-c`

```
ctrl-c received
```
