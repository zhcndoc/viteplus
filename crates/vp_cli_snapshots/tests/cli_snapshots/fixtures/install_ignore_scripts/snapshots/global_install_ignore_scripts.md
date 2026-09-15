# global_install_ignore_scripts

按请求管理全局安装并跳过依赖生命周期脚本。不带此标志时，脚本仍会运行。无论哪种情况，已安装的二进制文件都可以正常工作

## `npm pack ./scripted-dep --ignore-scripts`


## `vp install -g ./scripted-dep-1.0.0.tgz --ignore-scripts`


## `scripted-dep skipped`

```
postinstall: skipped
```

## `vp remove -g scripted-dep`


## `vp add -g --ignore-scripts ./scripted-dep-1.0.0.tgz`


## `scripted-dep skipped`

```
postinstall: skipped
```

## `vp remove -g scripted-dep`


## `vp install -g ./scripted-dep-1.0.0.tgz`


## `scripted-dep ran`

```
postinstall: ran
```
