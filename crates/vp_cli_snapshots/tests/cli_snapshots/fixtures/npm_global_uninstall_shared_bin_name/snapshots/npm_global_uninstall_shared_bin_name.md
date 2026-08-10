# npm_全局_卸载_共享_bin_名称

## `npm install -g ./pkg-a`

安装 pkg-a（为 npm-global-shared-cli 创建链接）

```

已添加 1 个包，耗时 <duration>
已将“npm-global-shared-cli”链接到 <home>/.vite-plus/bin/npm-global-shared-cli
```

## `vpt stat-file $VP_HOME/bin/npm-global-shared-cli --assert symlink`

```
<home>/.vite-plus/bin/npm-global-shared-cli: symlink
```

## `vpt print-file $VP_HOME/bins/npm-global-shared-cli.json`

BinConfig 应指向 pkg-a

```
{
  "name": "npm-global-shared-cli",
  "package": "npm-global-shared-pkg-a",
  "version": "",
  "nodeVersion": "<version>",
  "source": "npm"
}
```

## `npm install -g --force ./pkg-b`

强制安装 pkg-b（覆盖 npm-global-shared-cli）

```

added 1 package in <duration>
npm warn using --force Recommended protections disabled.
Linked 'npm-global-shared-cli' to <home>/.vite-plus/bin/npm-global-shared-cli
```

## `vpt stat-file $VP_HOME/bin/npm-global-shared-cli --assert symlink`

```
<home>/.vite-plus/bin/npm-global-shared-cli: symlink
```

## `vpt print-file $VP_HOME/bins/npm-global-shared-cli.json`

BinConfig 现在应指向 pkg-b

```
{
  "name": "npm-global-shared-cli",
  "package": "npm-global-shared-pkg-b",
  "version": "",
  "nodeVersion": "<version>",
  "source": "npm"
}
```

## `npm-global-shared-cli`

应打印 pkg-b 消息（已安装的最新版本）

```
shared-cli from pkg-b
```

## `npm uninstall -g npm-global-shared-pkg-a`

卸载 pkg-a，不应移除链接（现在由 pkg-b 拥有）

```

removed 1 package in <duration>
Linked 'npm-global-shared-cli' to <home>/.vite-plus/bin/npm-global-shared-cli
```

## `vpt stat-file $VP_HOME/bin/npm-global-shared-cli`

链接仍应存在

```
<home>/.vite-plus/bin/npm-global-shared-cli: 符号链接
```

## `npm-global-shared-cli`

应该仍然有效（由 pkg-b 所有）

```
shared-cli from pkg-b
```

## `npm uninstall -g npm-global-shared-pkg-b`

卸载 pkg-b，现在应移除链接

```

已移除 <duration> 内的 1 个包
已从 <home>/.vite-plus/bin/npm-global-shared-cli 移除链接“npm-global-shared-cli”
```

## `vpt stat-file $VP_HOME/bin/npm-global-shared-cli`

应移除链接

```
<home>/.vite-plus/bin/npm-global-shared-cli: missing
```
