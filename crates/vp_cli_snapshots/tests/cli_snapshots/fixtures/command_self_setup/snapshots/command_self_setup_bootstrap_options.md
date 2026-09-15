# command_self_setup_bootstrap_options

## `vpt mkdir -p external home user`


## `vpt cp $VP_HOME/bin/vp external/vp`


## `vpt chmod +x external/vp`


## `vpt write-file user/.bashrc '# Existing shell configuration
'`


## `HOME=${workspace}/user VP_HOME=${workspace}/home VP_SKIP_DEPS_INSTALL=1 VP_VERSION=bootstrap-test VP_NODE_MANAGER=no VP_SELF_SETUP_NO_MODIFY_PATH=1 ./external/vp`

管道传输的独立二进制文件会使用 bootstrap 的选项进行安装


## `vpt stat-file home/current/bin/.vp-setup-complete --assert file`

```
home/current/bin/.vp-setup-complete: file
```

## `vpt print-file home/config.json`

```
{
  "nodeShimMode": "system_first"
}
```

## `vpt print-file user/.bashrc`

```
# Existing shell configuration
```

## `vpt stat-file user/.zshenv --assert missing`

```
user/.zshenv: missing
```
