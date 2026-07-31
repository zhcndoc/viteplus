# npm 全局安装自定义前缀

## `vpt mkdir -p custom-prefix`

```
```

## `NPM_CONFIG_PREFIX=./custom-prefix npm install -g ./npm-global-custom-prefix-pkg`

应安装到自定义前缀并创建链接

```

added 1 package in <duration>
Linked 'npm-global-custom-prefix-cli' to <home>/.vite-plus/bin/npm-global-custom-prefix-cli
```

## `vpt stat-file custom-prefix/bin/npm-global-custom-prefix-cli --assert file`

验证已安装到自定义前缀

**退出代码：** 1

```
custom-prefix/bin/npm-global-custom-prefix-cli: symlink
stat-file assertion failed
```

## `vpt stat-file $VP_HOME/bin/npm-global-custom-prefix-cli --assert symlink`

链接应存在

```
<home>/.vite-plus/bin/npm-global-custom-prefix-cli: symlink
```

## `npm-global-custom-prefix-cli`

应可通过该链接调用

```
npm-global-custom-prefix-cli works
```

## `vpt rm -f $VP_HOME/bin/npm-global-custom-prefix-cli`

清理链接

```
```

## `NPM_CONFIG_PREFIX=./custom-prefix npm uninstall -g npm-global-custom-prefix-pkg`

清理

```

removed 1 package in <duration>
```

## `vpt rm -rf custom-prefix`

```
```
