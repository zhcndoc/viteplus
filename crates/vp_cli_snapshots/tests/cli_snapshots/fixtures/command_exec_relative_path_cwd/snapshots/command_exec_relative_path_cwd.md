# command_exec_relative_path_cwd

相对 PATH 条目必须解析为相对于选定 package 的 cwd，而不是 vp 进程的 cwd。

## `node setup.js`


## `PATH=./tools${PATH_SEPARATOR}${PATH} vp exec --filter app -- fake-node`

相对 PATH 条目从选定的 package 解析

```
resolved from package cwd
```

## `PATH=tools${PATH_SEPARATOR}${PATH} vp exec --filter app -- fake-node`

普通相对 PATH 条目从选定的 package 解析

```
resolved from package cwd
```

## `PATH=../shared-tools${PATH_SEPARATOR}${PATH} vp exec --filter app -- fake-node`

父级相对 PATH 条目从选定的 package 解析

```
resolved from parent relative PATH
```
