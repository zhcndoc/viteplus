# npm_global_uninstall_prefix

## `vpt mkdir -p custom-prefix`

```
```

## `npm install -g --prefix ./custom-prefix ./npm-global-prefix-pkg`

安装到自定义前缀目录，应创建链接

```

已添加 1 个包，耗时 <duration>
已将 'npm-global-prefix-cli' 链接到 <home>/.vite-plus/bin/npm-global-prefix-cli
```

## `vpt stat-file $VP_HOME/bin/npm-global-prefix-cli --assert symlink`

链接应存在

```
<home>/.vite-plus/bin/npm-global-prefix-cli: symlink
```

## `npm-global-prefix-cli`

验证可通过链接调用

```
npm-global-prefix-cli works
```

## `npm uninstall -g --prefix ./custom-prefix npm-global-prefix-pkg`

卸载也应移除链接

```

已移除 1 个软件包，耗时 <duration>
已从 <home>/.vite-plus/bin/npm-global-prefix-cli 移除链接“npm-global-prefix-cli”
```

## `vpt stat-file $VP_HOME/bin/npm-global-prefix-cli`

应该已被移除

```
<home>/.vite-plus/bin/npm-global-prefix-cli: missing
```

## `vpt rm -rf custom-prefix`

清理

```
```
