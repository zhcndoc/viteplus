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

[1m[31merror:[39m[0m Command '[94mnot-exist-command[39m' not found

Did you mean [94m`vp test`[39m?
```
