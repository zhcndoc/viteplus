# command_env_unset_session_independently_of_override

作用域取消设置必须独立于任何不同的环境覆盖，检查并清除会话文件

## `vp env use pnpm@10.18.0 --no-install`


## `VP_PACKAGE_MANAGER=yarn@4.12.0 vp env use --unset pnpm`


## `vpt stat-file $VP_HOME/.session-pnpm-version --assert missing`

不同的环境覆盖不会在作用域清理期间隐藏匹配的会话文件

```
<home>/.vite-plus/.session-pnpm-version: missing
```
