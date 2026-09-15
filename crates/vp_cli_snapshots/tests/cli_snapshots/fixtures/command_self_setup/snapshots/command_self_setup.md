# command_self_setup

## `vpt rm $VP_HOME/current/bin/.vp-setup-complete`


## `VP_SELF_SETUP_SUPPORT_CHECK=1 vp --help`

能力探测不会执行设置

```
vite-plus-self-setup-v1
```

## `vpt stat-file $VP_HOME/current/bin/.vp-setup-complete --assert missing`

```
<home>/.vite-plus/current/bin/.vp-setup-complete: missing
```

## `vp --help`

未标记的已部署二进制文件会完成设置并执行请求的命令


## `vpt stat-file $VP_HOME/current/bin/.vp-setup-complete --assert file`

```
<home>/.vite-plus/current/bin/.vp-setup-complete: file
```

## `vp not-a-command`

标记后，二进制文件会正常分发命令

**退出代码：** 2

```
VITE+ - The Unified Toolchain for the Web

error: Command 'not-a-command' not found
```
