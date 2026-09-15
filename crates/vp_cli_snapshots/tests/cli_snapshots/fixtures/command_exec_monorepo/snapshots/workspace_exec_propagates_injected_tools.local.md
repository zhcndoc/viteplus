# workspace_exec_propagates_injected_tools

## `vpt json-edit package.json packageManager pnpm@10.19.0`


## `vp exec --filter app-* -- node ../../assert-injected-pnpm.cjs`

顺序工作区执行会携带包管理器 PATH 及其工具集

```
app-a$ node ../../assert-injected-pnpm.cjs
Workspace exec preserves injected pnpm
app-b$ node ../../assert-injected-pnpm.cjs
Workspace exec preserves injected pnpm
```

## `vp exec --filter app-* --parallel -- node ../../assert-injected-pnpm.cjs`

并行工作区执行会携带相同的环境

```
app-a$ node ../../assert-injected-pnpm.cjs
Workspace exec preserves injected pnpm
app-b$ node ../../assert-injected-pnpm.cjs
Workspace exec preserves injected pnpm
```
