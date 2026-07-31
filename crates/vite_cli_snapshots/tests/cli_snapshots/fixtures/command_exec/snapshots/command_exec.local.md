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
从本地 node_modules/.bin 执行命令

用法：vp exec [选项] [命令]...

参数：
  [命令]...
          要执行的命令及参数

选项：
  -r, --recursive
          选择工作区中的所有包

  -t, --transitive
          选择当前包及其传递依赖

  -w, --workspace-root
          选择工作区根包

  -F, --filter <过滤器>
          按名称、目录或 glob 模式匹配包。

            --filter <模式>        按包名称选择（例如 foo、@scope/*）
            --filter ./<目录>       选择目录下的包
            --filter {<目录>}      与 ./<目录> 相同，但允许遍历后缀
            --filter <模式>...     选择包及其依赖
            --filter ...<模式>     选择包及其依赖者
            --filter <模式>^...    仅选择依赖（排除包本身）
            --filter !<模式>       排除与模式匹配的包

      --fail-if-no-match
          如果 `--filter` 表达式未匹配到任何包，则以非零状态退出。

          不使用此标志时，未匹配的过滤器（拼写错误、空 glob，或叶子包上将结果折叠为零的 `{.}^...` 遍历）只会产生警告，命令仍会成功退出。

  -c, --shell-mode
          在 shell 环境中执行命令

      --parallel
          并发运行，不遵循拓扑排序

      --reverse
          反转执行顺序

      --resume-from <恢复起点>
          从指定的包恢复执行

      --report-summary
          将结果保存到 vp-exec-summary.json

  -h, --help
          打印帮助信息（使用 '-h' 查看摘要）

示例：
  vp exec node --version                             # 运行本地 node
  vp exec tsc --noEmit                               # 运行本地 TypeScript 编译器
  vp exec -c 'tsc --noEmit && prettier --check .'    # Shell 模式
  vp exec -r -- tsc --noEmit                         # 在所有工作区包中运行
  vp exec --filter 'app...' -- tsc                   # 在筛选出的包中运行
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
