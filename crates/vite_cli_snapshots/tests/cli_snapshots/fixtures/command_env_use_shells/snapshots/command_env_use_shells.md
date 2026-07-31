# command_env_use_shells

## `VP_SHELL=bash vp env use 20.18.0 --no-install`

应检测 bash 并输出 posix export

```
export VP_NODE_VERSION=20.18.0
Using Node.js <version> (resolved from 20.18.0)
```

## `VP_SHELL=zsh vp env use 20.18.0 --no-install`

应检测到 zsh 并输出 POSIX 导出语句

```
export VP_NODE_VERSION=20.18.0
Using Node.js <version> (resolved from 20.18.0)
```

## `VP_SHELL=fish vp env use 20.18.0 --no-install`

应检测到 fish 并输出 fish export

```
set -gx VP_NODE_VERSION 20.18.0
Using Node.js <version> (resolved from 20.18.0)
```

## `VP_SHELL=nu vp env use 20.18.0 --no-install`

应检测到 nushell，并输出 nushell 导出内容

```
$env.VP_NODE_VERSION = "20.18.0"
Using Node.js <version> (resolved from 20.18.0)
```

## `VP_SHELL=pwsh vp env use 20.18.0 --no-install`

应检测 PowerShell 并输出 PowerShell 导出命令

```
$env:VP_NODE_VERSION = "20.18.0"
Using Node.js <version> (resolved from 20.18.0)
```

## `VP_SHELL=cmd vp env use 20.18.0 --no-install`

应检测到 cmd 并输出 cmd 导出内容

```
set VP_NODE_VERSION=20.18.0
Using Node.js <version> (resolved from 20.18.0)
```

## `VP_SHELL=BASH vp env use 20.18.0 --no-install`

应检测不区分大小写的 bash

```
export VP_NODE_VERSION=20.18.0
Using Node.js <version> (resolved from 20.18.0)
```

## `VP_SHELL=FISH vp env use 20.18.0 --no-install`

应检测不区分大小写的 fish

```
set -gx VP_NODE_VERSION 20.18.0
Using Node.js <version> (resolved from 20.18.0)
```

## `VP_SHELL=POWERSHELL vp env use 20.18.0 --no-install`

应检测不区分大小写的 powershell

```
$env:VP_NODE_VERSION = "20.18.0"
Using Node.js <version> (resolved from 20.18.0)
```
