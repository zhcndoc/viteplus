# command_env_nushell_metachar_dirs

## `HOME=${workspace}/shell-home USERPROFILE=${workspace}/shell-home VP_HOME= VP_BIN_DIR=${workspace}/bin-$USER-"quote"-'single'-`tick`-\slash VP_DATA_DIR=${workspace}/data-$USER-"quote"-'single'-`tick`-\slash VP_CACHE_DIR=${workspace}/cache-$USER-"quote"-'single'-`tick`-\slash XDG_CONFIG_HOME=${workspace}/config-$USER-"quote"-'single'-`tick`-\slash vp env setup --refresh`

## `vpt cp assert_dirs.nu 'config-$USER-"quote"-'\''single'\''-`tick`-\slash/vite-plus/assert_dirs.nu'`

## `HOME=${workspace}/shell-home USERPROFILE=${workspace}/shell-home VP_HOME= EXPECTED_VP_BIN_DIR=${workspace}/bin-$USER-"quote"-'single'-`tick`-\slash PATH=${workspace}/bin-$USER-"quote"-'single'-`tick`-\slash:${workspace}/bin-$USER-"quote"-'single'-`tick`-\slash:${PATH} nu 'config-$USER-"quote"-'\''single'\''-`tick`-\slash/vite-plus/assert_dirs.nu'`

Nushell 加载 env.nu，保留包含 shell 元字符的 PATH，并省略内部目录变量

```
Nushell metacharacter path checks passed
```
