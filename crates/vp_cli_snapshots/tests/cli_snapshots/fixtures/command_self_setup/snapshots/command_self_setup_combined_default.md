# command_self_setup_combined_default

## `vpt mkdir -p external home`


## `vpt cp $VP_HOME/bin/vp external/vp`


## `vpt chmod +x external/vp`


## `VP_HOME=${workspace}/home VP_SKIP_DEPS_INSTALL=1 VP_VERSION=combined-default VP_SELF_SETUP_NO_MODIFY_PATH=1 CI=true VP_PNPM_MANAGER=no ./external/vp`

在未显式覆盖 Node 的情况下，自动设置仍会启用两者；家族覆盖优先


## `vpt print-file home/config.json`

```
{
  "packageManagerShimModes": {
    "bun": "managed",
    "npm": "managed",
    "pnpm": "system_first",
    "yarn": "managed"
  }
}
```
