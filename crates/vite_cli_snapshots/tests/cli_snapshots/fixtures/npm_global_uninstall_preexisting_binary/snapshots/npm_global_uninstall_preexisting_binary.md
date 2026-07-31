# npm 全局卸载预先存在的二进制文件

## `vpt write-file $VP_HOME/bin/npm-global-preexist-cli '#'\!'/bin/sh
echo preexisting-binary-works'`

创建归用户所有的二进制文件

```
```

## `vpt chmod +x $VP_HOME/bin/npm-global-preexist-cli`

```
```

## `npm-global-preexist-cli`

请先验证它是否正常工作

```
preexisting-binary-works
```

## `npm install -g ./npm-global-preexist-pkg`

安装声明了相同 bin 名称的软件包

```

已添加 1 个软件包，用时 <duration>
```

## `npm uninstall -g npm-global-preexist-pkg`

不应删除预先存在的二进制文件

```

removed 1 package in <duration>
```

## `npm-global-preexist-cli`

应该仍然有效

```
preexisting-binary-works
```

## `vpt rm $VP_HOME/bin/npm-global-preexist-cli`

清理

```
```
