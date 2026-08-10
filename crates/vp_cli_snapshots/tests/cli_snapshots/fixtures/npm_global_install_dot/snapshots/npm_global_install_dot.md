# npm_global_install_dot

## `cd npm-global-dot-pkg && npm install -g .`

应安装并创建链接

```

已添加 1 个包，耗时 <duration>
已将 'npm-global-dot-cli' 链接到 <home>/.vite-plus/bin/npm-global-dot-cli
```

## `vpt stat-file $VP_HOME/bin/npm-global-dot-cli --assert symlink`

链接应存在

```
<home>/.vite-plus/bin/npm-global-dot-cli: symlink
```

## `npm-global-dot-cli`

应可通过链接调用

```
npm-global-dot-cli works
```

## `vpt rm -f $VP_HOME/bin/npm-global-dot-cli`

清理链接

```
```

## `npm uninstall -g npm-global-dot-pkg`

清理 npm 安装

```

removed 1 package in <duration>
```
