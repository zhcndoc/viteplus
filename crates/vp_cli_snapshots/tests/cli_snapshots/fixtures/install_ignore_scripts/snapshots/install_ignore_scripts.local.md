# install_ignore_scripts

Install 和 add 支持在包名称之前或之后添加 --ignore-scripts。未使用该标志的普通 install 会运行根项目和依赖项的 postinstall 脚本。

## `npm pack ./scripted-dep --ignore-scripts`


## `vp install --ignore-scripts ./scripted-dep-1.0.0.tgz`


## `vpt stat-file node_modules/scripted-dep/package.json --assert file`

```
node_modules/scripted-dep/package.json: file
```

## `vpt stat-file root-postinstall-ran --assert missing`

```
root-postinstall-ran: missing
```

## `vpt stat-file node_modules/scripted-dep/postinstall-ran --assert missing`

```
node_modules/scripted-dep/postinstall-ran: missing
```

## `vpt rm -rf node_modules package-lock.json`


## `vp install ./scripted-dep-1.0.0.tgz --ignore-scripts`


## `vpt stat-file node_modules/scripted-dep/package.json --assert file`

```
node_modules/scripted-dep/package.json: file
```

## `vpt stat-file root-postinstall-ran --assert missing`

```
root-postinstall-ran: missing
```

## `vpt stat-file node_modules/scripted-dep/postinstall-ran --assert missing`

```
node_modules/scripted-dep/postinstall-ran: missing
```

## `vpt rm -rf node_modules package-lock.json`


## `vp add --ignore-scripts ./scripted-dep-1.0.0.tgz`


## `vpt stat-file node_modules/scripted-dep/package.json --assert file`

```
node_modules/scripted-dep/package.json: file
```

## `vpt stat-file root-postinstall-ran --assert missing`

```
root-postinstall-ran: missing
```

## `vpt stat-file node_modules/scripted-dep/postinstall-ran --assert missing`

```
node_modules/scripted-dep/postinstall-ran: missing
```

## `vpt rm -rf node_modules package-lock.json`


## `vp add ./scripted-dep-1.0.0.tgz --ignore-scripts`


## `vpt stat-file node_modules/scripted-dep/package.json --assert file`

```
node_modules/scripted-dep/package.json: file
```

## `vpt stat-file root-postinstall-ran --assert missing`

```
root-postinstall-ran: missing
```

## `vpt stat-file node_modules/scripted-dep/postinstall-ran --assert missing`

```
node_modules/scripted-dep/postinstall-ran: missing
```

## `vpt rm -rf node_modules package-lock.json`


## `vp install`


## `vpt stat-file root-postinstall-ran --assert file`

```
root-postinstall-ran: file
```

## `vpt stat-file node_modules/scripted-dep/postinstall-ran --assert file`

```
node_modules/scripted-dep/postinstall-ran: file
```
