# 命令执行工作目录

## `node setup.js`


## `vp exec -c 'basename $(pwd)'`

当前工作目录是包根目录

```
workspace
```

## `cd src && vp exec -c 'basename $(pwd)'`

在子目录中保留 cwd

```
src
```

## `cd src/nested && vp exec -c 'basename $(pwd)'`

在嵌套子目录中保留当前工作目录

```
nested
```

## `cd src && vp exec node -e 'const p = require('\''path'\''); console.log(p.basename(process.cwd()))'`

非 shell 模式同样会保留工作目录

```
src
```
