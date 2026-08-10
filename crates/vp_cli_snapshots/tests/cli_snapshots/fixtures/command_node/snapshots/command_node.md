# command_node

## `vp node -v`

简写：从 package.json 的 engines.node 中解析出的版本

```
<version>
```

## `vp node script.js`

执行本地 JS 文件（主要用例）

```
node version: <version>
script args: []
```

## `vp node script.js foo bar --flag`

将脚本参数传递给本地文件

```
node version: <version>
script args: ["foo","bar","--flag"]
```

## `vp node -e 'console.log('\''Hello from vp node'\'')'`

通过 -e 执行内联脚本

```
Hello from vp node
```

## `vp env exec node -v`

等价性检查：输出与简写形式相同

```
<version>
```
