# command_exec

## `node setup-bin.js`


## `vp exec hello-test`

从 node_modules/.bin 执行二进制文件

```
VITE+ - 面向 Web 的统一工具链

来自 test-bin 的问候
```

## `vp exec echo hello`

基础执行

```
VITE+ - The Unified Toolchain for the Web

hello
```

## `vp exec -- echo with-separator`

显式 -- 分隔符

```
VITE+ - Web 统一工具链

with-separator
```

## `vp exec node -e 'console.log('\''from node'\'')'`

使用参数执行 node

```
VITE+ - The Unified Toolchain for the Web

from node
```

## `vp exec -c 'echo hello from shell'`

Shell 模式

```
VITE+ - Web 统一工具链

来自 shell 的问候
```

## `vp exec --parallel -- echo hello`

使用单个软件包时，--parallel 应该流式输出

```
VITE+ - The Unified Toolchain for the Web

hello
```

## `cd subdir && vp exec ./my-local`

从调用者当前工作目录解析相对可执行文件

```
VITE+ - Web 的统一工具链

来自子目录的问候
```

## `vp exec --help`

帮助信息

```
VITE+ - Web 的统一工具链

用法：vp exec [选项] [命令]...

执行本地 node_modules/.bin 中的命令。

参数：
  [命令]...  要执行的命令及参数

选项：
  -r, --recursive          选择工作区中的所有包
  -t, --transitive         选择当前包及其传递依赖
  -w, --workspace-root     选择工作区根包
  -F, --filter <FILTERS>   按名称、目录或 glob 模式匹配包
  --fail-if-no-match       如果 `--filter` 表达式未匹配任何包，则以非零状态退出
                           不使用此标志时，未匹配的筛选条件只会发出警告并成功退出
  -c, --shell-mode         在 Shell 环境中执行命令
  --parallel               并发运行，不遵循拓扑顺序
  --reverse                反转执行顺序
  --resume-from <PACKAGE>  从指定的包继续执行
  --report-summary         将结果保存到 vp-exec-summary.json
  -h, --help               显示帮助

筛选模式：
  --filter <pattern>        按包名称选择（例如 foo、@scope/*）
  --filter ./<dir>          选择目录下的包
  --filter {<dir>}          与 ./<dir> 相同，但允许遍历后缀
  --filter <pattern>...     选择包及其依赖项
  --filter ...<pattern>     选择包及其依赖包
  --filter <pattern>^...    仅选择依赖项（排除包本身）
  --filter !<pattern>       排除匹配该模式的包

示例：
  vp exec node --version                             # 运行本地 node
  vp exec tsc --noEmit                               # 运行本地 TypeScript 编译器
  vp exec -c 'tsc --noEmit && prettier --check .'    # Shell 模式
  vp exec -r -- tsc --noEmit                         # 在所有工作区包中运行
  vp exec --filter 'app...' -- tsc                   # 在筛选出的包中运行

文档：https://viteplus.dev/guide/vpx
```

## `vp exec`

缺少命令时应报错

**退出代码：** 1

```
VITE+ - Web 统一工具链

错误：'vp exec' 需要一个要运行的命令

用法：vp exec [--] <command> [args...]

示例：
  vp exec node --version
  vp exec tsc --noEmit
```

## `vp exec nonexistent-cmd-12345`

找不到命令错误

**退出代码：** 1

```
VITE+ - Web 的统一工具链

错误：在 node_modules/.bin 中找不到命令 'nonexistent-cmd-12345'

运行 `vp install` 以安装依赖，或使用 `vpx` 调用远程命令。
```

## `vp run foo`

vp exec 可在 package.json 脚本中使用

```
VITE+ - The Unified Toolchain for the Web

$ vp exec node -e "console.log(5173)" ⊘ cache disabled
VITE+ - The Unified Toolchain for the Web

5173
```
