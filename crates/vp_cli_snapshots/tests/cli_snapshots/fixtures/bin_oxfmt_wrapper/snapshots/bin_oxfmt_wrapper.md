# bin_oxfmt_wrapper

## `node ../node_modules/vite-plus/bin/oxfmt`

应拒绝非 LSP 用法

**退出代码：** 1

```
此 oxfmt 包装器仅供 IDE 扩展使用（LSP 或 stdin 模式）。
如需格式化代码，请运行：vp fmt
```

## `node ../node_modules/vite-plus/bin/oxfmt --help`

应拒绝非 LSP 用法

**退出代码：** 1

```
此 oxfmt 包装器仅供 IDE 扩展使用（LSP 或标准输入模式）。
要格式化代码，请运行：vp fmt
```

## `node ../node_modules/vite-plus/bin/oxfmt --lsp --help`

应支持 LSP 模式

```
用法：[-c=PATH] [PATH]...

模式选项：
        --init               使用默认值初始化 `.oxfmtrc.json`
        --migrate=SOURCE     从指定来源将配置迁移到 `.oxfmtrc.json`
                             可用来源：prettier、biome
        --lsp                启动语言服务器协议（LSP）服务器
        --stdin-filepath=PATH  指定用于推断所使用解析器的文件名

输出选项：
        --write              就地格式化并写入文件（默认）
        --check              检查文件是否已格式化，同时显示统计信息
        --list-different     列出将被更改的文件

配置选项
    -c, --config=PATH        配置文件的路径（.json、.jsonc、.ts、.mts、.cts、.js、
                             .mjs、.cjs）
        --disable-nested-config  不要在子目录中搜索配置文件

忽略选项
        --ignore-path=PATH   忽略文件的路径。可以多次指定。如果未指定，则使用当前目录中的
                             .gitignore 和 .prettierignore。
        --with-node-modules  格式化 node_modules 目录中的代码（默认跳过）

运行时选项
        --no-error-on-unmatched-pattern  模式不匹配时不要以错误退出
        --threads=INT        要使用的线程数。设置为 1 时仅使用 1 个 CPU 核心。

可用的位置参数：
    PATH                     单个文件、路径或路径列表。也支持 Glob 模式。
                             （请务必将其放在引号中，否则 shell 可能会在传递之前将其展开。）
                             同样支持使用 `!` 前缀的排除模式，例如 `'!**/fixtures/*.js'`。
                             如果未提供，则使用当前工作目录。

可用选项：
    -h, --help               显示帮助信息
    -V, --version            显示版本信息
```

## `node ../node_modules/vite-plus/bin/oxfmt --stdin-filepath=a.ts --help`

应支持 Stdin 模式

```
用法：[-c=PATH] [PATH]...

模式选项：
        --init               使用默认值初始化 `.oxfmtrc.json`
        --migrate=SOURCE     从指定来源将配置迁移到 `.oxfmtrc.json`
                             可用来源：prettier、biome
        --lsp                启动语言服务器协议（LSP）服务器
        --stdin-filepath=PATH  指定用于推断解析器的文件名

输出选项：
        --write              就地格式化并写入文件（默认）
        --check              检查文件是否已格式化，同时显示统计信息
        --list-different     列出将被更改的文件

配置选项
    -c, --config=PATH        配置文件路径（.json、.jsonc、.ts、.mts、.cts、.js、
                             .mjs、.cjs）
        --disable-nested-config  不在子目录中搜索配置文件

忽略选项
        --ignore-path=PATH   忽略文件的路径。可多次指定。如果未指定，则使用当前目录中的
                             .gitignore 和 .prettierignore。
        --with-node-modules  格式化 node_modules 目录中的代码（默认跳过）

运行时选项
        --no-error-on-unmatched-pattern  当模式不匹配时不要以错误退出
        --threads=INT        要使用的线程数。设置为 1 则仅使用 1 个 CPU 核心。

可用的位置参数：
    PATH                     单个文件、路径或路径列表。也支持 Glob 模式。
                             （请务必将其放在引号中，否则 shell 可能会在传递之前展开它们。）
                             也支持使用 `!` 前缀排除模式，例如 `'!**/fixtures/*.js'`。
                             如果未提供，则使用当前工作目录。

可用选项：
    -h, --help               打印帮助信息
    -V, --version            打印版本信息
```
