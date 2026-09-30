# 使用 VP 配置运行命令

## `vp run foo`

应该运行 vp config 命令

```
$ vp config ⊘ cache disabled
.git can't be found
```

## `vp run bar`

应抛出错误

**退出代码：** 2

```
$ vp not-exist-command ⊘ cache disabled

error: Command 'not-exist-command' not found

Did you mean `vp test`?
```
