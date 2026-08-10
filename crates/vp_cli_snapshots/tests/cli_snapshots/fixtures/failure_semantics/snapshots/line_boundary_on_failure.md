# line_boundary_on_failure

锁定失败流程契约：一个失败的步骤会跳过其所在行的其余部分（直到并包括下一个 continue-on-failure 步骤，在迁移后的 fixture 中即行终止符），而下一行会恢复执行；如果前方没有边界，则该用例停止。

## `vpt exit 1`

链成员失败：此行其余部分将被跳过

**退出代码：** 1

```
```

*（跳过 1 个步骤到下一行边界：步骤失败）*

## `vpt print '下一行仍会运行'`

```
next line still runs
```
