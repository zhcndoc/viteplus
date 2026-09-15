# 未决定时，非交互式使用默认为托管模式

升级后的安装可能没有记录家庭模式；非交互式使用必须保持确定性，不能代表用户持久化记录同意。

## `vpt rm -f $VP_HOME/config.json`


## `vpt chmod +x system-bin/pnpm`


## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-bin${PATH_SEPARATOR}${PATH} pnpm --version`

未决定的非交互式 shim 使用托管 pnpm，不会提示

```
11.25.0
```

## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-bin${PATH_SEPARATOR}${PATH} NPM_CONFIG_REGISTRY=http://127.0.0.1:9 vp env current pnpm --json`

环境检查使用相同的稳定托管默认值

```
{
  "package_manager": {
    "name": "pnpm",
    "version": "<version>",
    "source": "registry fallback",
    "bin_paths": {
      "pnpm": "<home>/.vite-plus/package_manager/pnpm/<version>/pnpm/bin/pnpm",
      "pnpx": "<home>/.vite-plus/package_manager/pnpm/<version>/pnpm/bin/pnpx"
    },
    "installed": true,
    "mode": "managed"
  }
}
```

## `vpt stat-file $VP_HOME/config.json --assert missing`

非交互式使用不会记录选择

```
<home>/.vite-plus/config.json: missing
```
