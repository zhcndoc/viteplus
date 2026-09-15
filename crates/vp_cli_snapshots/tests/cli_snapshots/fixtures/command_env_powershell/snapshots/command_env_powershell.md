# command_env_powershell

## `vp env setup --refresh`


## `vpt write-file .node-version '22.18.0
'`


## `EXPECTED_VP_HOME=${VP_HOME} pwsh -NoLogo -NoProfile -NonInteractive -File assert.ps1`

通过点源加载 env.ps1，并验证 PowerShell 环境设置和包装器行为

```
Using Node.js <version> (resolved from 20.18.0)
Reverted selected components to project environment resolution
Using Node.js <version> (resolved from .node-version)
PowerShell environment checks passed
```
