# vpx_system_command_preserves_local_bin_path

## `vpt mkdir -p node_modules/.bin`


## `vpt write-file node_modules/.bin/probe '#'\!'/bin/sh
echo local-probe
'`


## `vpt chmod +x node_modules/.bin/probe`


## `vpx sh -c probe`

通过 vpx 启动的系统命令仍然可以启动项目本地二进制文件

```
local-probe
```
