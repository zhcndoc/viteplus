# command_env_posix_sh

## `VP_HOME=${workspace}/vp "$project\with `spaces`" vp env setup --refresh`


## `vpt cp assert_posix.sh 'vp "$project\with `spaces`"/assert_posix.sh'`


## `vpt write-file 'vp "$project\with `spaces`"/.node-version' '22.23.4
'`


## `cd 'vp "$project\with `spaces`"' && EXPECTED_VP_HOME=${workspace} SHELL_LABEL=sh PATH=${workspace}/bin:${workspace}/bin:${PATH} sh assert_posix.sh`

在 sh 中加载生成的环境文件，并验证 PATH、wrapper 和版本切换

```
Using Node.js <version> (resolved from 20.20.2)
Reverted selected components to project environment resolution
Using Node.js <version> (resolved from .node-version)
POSIX environment checks passed (sh)
```
