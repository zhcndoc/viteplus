# command_env_use_shells

## `VP_SHELL=bash vp env use 20.18.0 pnpm@10.18.0 --no-install`

应检测 bash 并输出两条 POSIX export

```
export VP_NODE_VERSION=20.18.0
export VP_PNPM_VERSION=10.18.0
Using Node.js <version> (resolved from 20.18.0)
Using pnpm <version> (resolved from 10.18.0)
```

## `VP_SHELL=zsh vp env use 20.18.0 pnpm@10.18.0 --no-install`

应检测 zsh 并输出两条 POSIX export

```
export VP_NODE_VERSION=20.18.0
export VP_PNPM_VERSION=10.18.0
Using Node.js <version> (resolved from 20.18.0)
Using pnpm <version> (resolved from 10.18.0)
```

## `VP_SHELL=fish vp env use 20.18.0 pnpm@10.18.0 --no-install`

应检测 fish 并输出两条 fish export

```
set -gx VP_NODE_VERSION 20.18.0
set -gx VP_PNPM_VERSION 10.18.0
Using Node.js <version> (resolved from 20.18.0)
Using pnpm <version> (resolved from 10.18.0)
```

## `VP_SHELL=nu vp env use 20.18.0 pnpm@10.18.0 --no-install`

应检测 nushell 并输出两条 nushell export

```
$env.VP_NODE_VERSION = "20.18.0"
$env.VP_PNPM_VERSION = "10.18.0"
Using Node.js <version> (resolved from 20.18.0)
Using pnpm <version> (resolved from 10.18.0)
```

## `VP_SHELL=pwsh vp env use 20.18.0 pnpm@10.18.0 --no-install`

应检测 powershell 并输出两条 powershell export

```
$env:VP_NODE_VERSION = "20.18.0"
$env:VP_PNPM_VERSION = "10.18.0"
Using Node.js <version> (resolved from 20.18.0)
Using pnpm <version> (resolved from 10.18.0)
```

## `VP_SHELL=cmd vp env use 20.18.0 pnpm@10.18.0 --no-install`

应检测 cmd 并输出两条 cmd export

```
set VP_NODE_VERSION=20.18.0
set VP_PNPM_VERSION=10.18.0
Using Node.js <version> (resolved from 20.18.0)
Using pnpm <version> (resolved from 10.18.0)
```

## `VP_SHELL=BASH vp env use 20.18.0 pnpm@10.18.0 --no-install`

应检测不区分大小写的 bash

```
export VP_NODE_VERSION=20.18.0
export VP_PNPM_VERSION=10.18.0
Using Node.js <version> (resolved from 20.18.0)
Using pnpm <version> (resolved from 10.18.0)
```

## `VP_SHELL=FISH vp env use 20.18.0 pnpm@10.18.0 --no-install`

应检测不区分大小写的 fish

```
set -gx VP_NODE_VERSION 20.18.0
set -gx VP_PNPM_VERSION 10.18.0
Using Node.js <version> (resolved from 20.18.0)
Using pnpm <version> (resolved from 10.18.0)
```

## `VP_SHELL=POWERSHELL vp env use 20.18.0 pnpm@10.18.0 --no-install`

应检测不区分大小写的 powershell

```
$env:VP_NODE_VERSION = "20.18.0"
$env:VP_PNPM_VERSION = "10.18.0"
Using Node.js <version> (resolved from 20.18.0)
Using pnpm <version> (resolved from 10.18.0)
```
