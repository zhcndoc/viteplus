# 命令执行

## `node setup-bin.js`


## `vp exec hello-test`

从 node_modules/.bin 执行二进制文件

```
hello from test-bin
```

## `vp exec echo hello`

基本执行

```
hello
```

## `vp exec -- echo with-separator`

显式的 -- 分隔符

```
with-separator
```

## `vp exec node -e 'console.log('\''from node'\'')'`

使用参数执行 node

```
from node
```

## `vp exec -c 'echo hello from shell'`

Shell 模式

```
hello from shell
```

## `vp exec --parallel -- echo hello`

单个包使用 --parallel 时应流式输出

```
hello
```

## `cd subdir && vp exec ./my-local`

从调用者的当前工作目录解析相对可执行文件

```
hello from subdir
```

## `vp exec --help`

帮助信息

```
VITE+ - The Unified Toolchain for the Web

用法：vp exec [选项] [命令]...

Execute a command from local node_modules/.bin.

Arguments:
  [COMMAND]...  Command and arguments to execute

Options:
  -r, --recursive          Select all packages in the workspace
  -t, --transitive         Select the current package and its transitive dependencies
  -w, --workspace-root     Select the workspace root package
  -F, --filter <FILTERS>   Match packages by name, directory, or glob pattern
  --fail-if-no-match       Exit with a non-zero status if a `--filter` expression matches no packages
                           Without this flag, unmatched filters only warn and exit successfully
  -c, --shell-mode         Execute the command within a shell environment
  --parallel               Run concurrently without topological ordering
  --reverse                Reverse execution order
  --resume-from <PACKAGE>  Resume from a specific package
  --report-summary         Save results to vp-exec-summary.json
  -h, --help               Print help

Filter Patterns:
  --filter <pattern>        Select by package name (e.g. foo, @scope/*)
  --filter ./<dir>          Select packages under a directory
  --filter {<dir>}          Same as ./<dir>, but allows traversal suffixes
  --filter <pattern>...     Select package and its dependencies
  --filter ...<pattern>     Select package and its dependents
  --filter <pattern>^...    Select only the dependencies (exclude the package itself)
  --filter !<pattern>       Exclude packages matching the pattern

Examples:
  vp exec node --version                             # 运行本地 node
  vp exec tsc --noEmit                               # 运行本地 TypeScript 编译器
  vp exec -c 'tsc --noEmit && prettier --check .'    # Shell 模式
  vp exec -r -- tsc --noEmit                         # 在所有工作区包中运行
  vp exec --filter 'app...' -- tsc                   # 在筛选出的包中运行

Documentation: https://viteplus.dev/guide/vpx
```

## `vp exec`

缺少命令时应报错

**退出代码：** 1

```
error: 'vp exec' requires a command to run

Usage: vp exec [--] <command> [args...]

Examples:
  vp exec node --version
  vp exec tsc --noEmit
```

## `vp exec nonexistent-cmd-12345`

找不到命令错误

**退出代码：** 1

```
错误：在 node_modules/.bin 中找不到命令“nonexistent-cmd-12345”

运行 `vp install` 安装依赖，或使用 `vpx` 调用远程命令。
```

## `vp run foo`

vp exec 可在 package.json 脚本中使用

```
$ vp exec node -e "console.log(5173)" ⊘ cache disabled
5173
```
