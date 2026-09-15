# command_self_setup_retry

## `vpt rm $VP_HOME/current/bin/.vp-setup-complete $VP_HOME/env`


## `vpt mkdir $VP_HOME/env`


## `vp env setup --refresh`

失败的设置不会将已部署的二进制文件标记为完成

**退出代码：** 1

```
error: Command execution failed: Is a directory (os error 21)
```

## `vpt stat-file $VP_HOME/current/bin/.vp-setup-complete --assert missing`

```
<home>/.vite-plus/current/bin/.vp-setup-complete: missing
```

## `vpt rm -r $VP_HOME/env`


## `vp env setup --refresh`

同一个升级交接会在故障修复后重试设置

## `vpt stat-file $VP_HOME/current/bin/.vp-setup-complete --assert file`

```
<home>/.vite-plus/current/bin/.vp-setup-complete: file
```
