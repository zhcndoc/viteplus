# prefers_existing_family_and_records_choice

## `vpt rm -f $VP_HOME/config.json`


## `vpt chmod +x system-bin/pnpm`


## `vpt chmod +x system-bin/yarn`


## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-bin${PATH_SEPARATOR}${PATH} pnpm --version`


## `vpt print-file $VP_HOME/config.json`

明确的系统选择仅记录 pnpm

```
{
  "packageManagerShimModes": {
    "pnpm": "system_first"
  }
}
```

## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-bin${PATH_SEPARATOR}${PATH} pnpm --version`

之后对 pnpm 的调用会使用已记录的选择，而不会提示

```
system-pnpm
```

## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-bin${PATH_SEPARATOR}${PATH} yarn --version`


## `vpt print-file $VP_HOME/config.json`

Yarn 记录自己的决定，而不会更改 pnpm

```
{
  "packageManagerShimModes": {
    "pnpm": "system_first",
    "yarn": "system_first"
  }
}
```
