# builtin_tools_without_node_on_path

## `node assert-runtime.cjs`

即使当前运行时的文件名不是 node 且 PATH 中没有可执行的 node 文件，内置工具也会重复使用当前运行时。

```
lint reused the current runtime without node on PATH
fmt reused the current runtime without node on PATH
```
