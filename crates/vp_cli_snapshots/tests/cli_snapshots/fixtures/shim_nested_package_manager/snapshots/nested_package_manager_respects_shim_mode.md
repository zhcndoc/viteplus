# nested_package_manager_respects_shim_mode

## `vpt chmod +x system-bin/pnpm`


## `vp env on pnpm`


## `pnpm --version`


## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-bin${PATH_SEPARATOR}${PATH} npx --offline --call 'pnpm --version'`

托管模式即使系统 pnpm 可用，也会保留项目固定版本

```
10.19.0
```

## `vp env off pnpm`


## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-bin${PATH_SEPARATOR}${PATH} npx --offline --call 'pnpm --version'`

系统优先模式仍会选择系统 pnpm

```
system-pnpm
```
