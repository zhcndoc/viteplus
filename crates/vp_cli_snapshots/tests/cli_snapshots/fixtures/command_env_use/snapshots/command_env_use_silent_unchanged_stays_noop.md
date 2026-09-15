# command_env_use_silent_unchanged_stays_noop

未更改检查必须在安装前返回，以便 --silent-if-unchanged 始终不会产生下载和文件系统副作用。

## `vpt write-file package.json '{"name":"command-env-use","private":true,"packageManager":"pnpm@10.18.0"}
'`


## `VP_PNPM_VERSION=10.18.0 vp env use pm --silent-if-unchanged`


## `vpt stat-file $VP_HOME/package_manager/pnpm/10.18.0/pnpm/bin/pnpm --assert missing`

静默未更改模式保留传统的无操作行为

```
<home>/.vite-plus/package_manager/pnpm/<version>/pnpm/bin/pnpm: missing
```
