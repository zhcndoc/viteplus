# 在 PATH 上使用自定义前缀全局安装 npm

## `vpt mkdir -p custom-prefix-on-path/bin`


## `PATH=${workspace}/custom-prefix-on-path/bin:${PATH} NPM_CONFIG_PREFIX=${workspace}/custom-prefix-on-path npm install -g ./npm-global-on-path-pkg`

应在无需提示的情况下安装（bin 目录已在 PATH 中）

```

已添加 1 个软件包，用时 <duration>
```

## `vpt stat-file custom-prefix-on-path/bin/npm-global-on-path-cli --assert symlink`

验证已安装到自定义前缀

```
custom-prefix-on-path/bin/npm-global-on-path-cli: symlink
```

## `vpt stat-file $VP_HOME/bin/npm-global-on-path-cli --assert missing`

不应创建链接

```
<home>/.vite-plus/bin/npm-global-on-path-cli: missing
```
