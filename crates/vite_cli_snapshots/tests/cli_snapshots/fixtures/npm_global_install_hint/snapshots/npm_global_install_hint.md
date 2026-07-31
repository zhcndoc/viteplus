# npm 全局安装提示

## `npm install -g ./npm-global-hint-pkg`

应安装并创建链接

```

已在 <duration> 内添加 1 个软件包
已将 'npm-global-hint-cli' 链接到 <home>/.vite-plus/bin/npm-global-hint-cli
```

## `vpt stat-file $VP_HOME/bin/npm-global-hint-cli --assert symlink`

链接应存在

```
<home>/.vite-plus/bin/npm-global-hint-cli: symlink
```

## `vp env which npm-global-hint-cli`

应报告由 npm 创建的链接

```
VITE+ - Web 的统一工具链

<workspace>/npm-global-hint-pkg/cli.js
  包：        npm-global-hint-pkg
  来源：      npm
  Node：      <version>
```

## `npm-global-hint-cli`

应该可以通过链接调用

```
npm-global-hint-cli works
```

## `vpt rm -f $VP_HOME/bin/npm-global-hint-cli`

清理链接

```
```

## `npm uninstall -g npm-global-hint-pkg`

清理 npm 安装

```

removed 1 package in <duration>
```
