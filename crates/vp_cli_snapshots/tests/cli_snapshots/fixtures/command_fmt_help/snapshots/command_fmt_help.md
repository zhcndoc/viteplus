# 命令格式帮助

## `vp fmt -h`

```
VITE+ - Web 统一工具链

用法：vp fmt [路径]... [选项]

格式化代码。
选项将转发给 Oxfmt。

可用的位置参数：
  [路径]...  单个文件、路径或路径列表。也支持 Glob 模式。（请务必将其括在引号中，否则 Shell 可能会在传递前展开它们。）也支持使用 `!` 前缀的排除模式，例如 `'!**/fixtures/*.js'`。如果未提供，则使用当前工作目录。

模式选项：
  --stdin-filepath=路径  指定用于推断解析器的文件名

输出选项：
  --write           就地格式化并写入文件（默认）
  --check           检查文件是否已格式化，同时显示统计信息
  --list-different  列出将被修改的文件

忽略选项：
  --ignore-path=路径   忽略文件的路径。可以多次指定。如果未指定，则使用当前目录中的 .gitignore 和 .prettierignore。
  --with-node-modules  格式化 node_modules 目录中的代码（默认跳过）

运行时选项：
  --no-error-on-unmatched-pattern  当模式未匹配时不以错误退出
  --threads=整数                    要使用的线程数。设置为 1 表示仅使用 1 个 CPU 核心。

可用选项：
  -h, --help  打印帮助信息

示例：
  vp fmt
  vp fmt src --check
  vp fmt . --write

文档：https://viteplus.dev/guide/fmt
```

## `vp fmt --help`

```
VITE+ - 面向 Web 的统一工具链

用法：vp fmt [PATH]... [OPTIONS]

格式化代码。
选项将传递给 Oxfmt。

可用的位置参数：
  [PATH]...  单个文件、路径或路径列表。也支持 Glob 模式。（请务必将其括起来，否则 Shell 可能会在传递之前展开它们。）也支持使用 `!` 前缀的排除模式，例如 `'!**/fixtures/*.js'`。如果未提供，则使用当前工作目录。

模式选项：
  --stdin-filepath=PATH  指定用于推断解析器的文件名

输出选项：
  --write           原地格式化并写入文件（默认）
  --check           检查文件是否已格式化，同时显示统计信息
  --list-different  列出将被修改的文件

忽略选项：
  --ignore-path=PATH   忽略文件的路径。可多次指定。如果未指定，则使用当前目录中的 .gitignore 和 .prettierignore。
  --with-node-modules  格式化 node_modules 目录中的代码（默认跳过）

运行时选项：
  --no-error-on-unmatched-pattern  当模式未匹配时不要退出并报错
  --threads=INT                    要使用的线程数。设置为 1 以仅使用 1 个 CPU 核心。

可用选项：
  -h, --help  显示帮助信息

示例：
  vp fmt
  vp fmt src --check
  vp fmt . --write

文档：https://viteplus.dev/guide/fmt
```

## `vp help fmt`

```
VITE+ - Web 统一工具链

用法：vp fmt [PATH]... [OPTIONS]

格式化代码。
选项将传递给 Oxfmt。

可用的位置参数：
  [PATH]...  单个文件、路径或路径列表。也支持 Glob 模式。（请务必将其括起来，否则 Shell 可能会在传递前展开它们。）也支持使用 `!` 前缀的排除模式，例如 `'!**/fixtures/*.js'`。如果未提供，则使用当前工作目录。

模式选项：
  --stdin-filepath=PATH  指定用于推断所用解析器的文件名

输出选项：
  --write           就地格式化并写入文件（默认）
  --check           检查文件是否已格式化，同时显示统计信息
  --list-different  列出将发生更改的文件

忽略选项：
  --ignore-path=PATH   要忽略的文件路径。可以多次指定。如果未指定，则使用当前目录中的 .gitignore 和 .prettierignore。
  --with-node-modules  格式化 node_modules 目录中的代码（默认跳过）

运行时选项：
  --no-error-on-unmatched-pattern  模式未匹配时不退出并报错
  --threads=INT                    要使用的线程数。设置为 1 表示仅使用 1 个 CPU 核心。

可用选项：
  -h, --help  显示帮助信息

示例：
  vp fmt
  vp fmt src --check
  vp fmt . --write

文档：https://viteplus.dev/guide/fmt
```

## `vp format --help`

```
VITE+ - Web 统一工具链

用法：vp fmt [PATH]... [OPTIONS]

格式化代码。
选项将传递给 Oxfmt。

可用的位置参数：
  [PATH]...  单个文件、路径或路径列表。也支持 Glob 模式。（请务必将其括起来，否则 Shell 可能会在传递之前展开它们。）也支持使用 `!` 前缀的排除模式，例如 `'!**/fixtures/*.js'`。如果未提供，则使用当前工作目录。

模式选项：
  --stdin-filepath=PATH  指定用于推断解析器的文件名

输出选项：
  --write           就地格式化并写入文件（默认）
  --check           检查文件是否已格式化，同时显示统计信息
  --list-different  列出将被修改的文件

忽略选项：
  --ignore-path=PATH   要忽略的文件路径。可以多次指定。如果未指定，则使用当前目录中的 .gitignore 和 .prettierignore。
  --with-node-modules  格式化 node_modules 目录中的代码（默认跳过）

运行时选项：
  --no-error-on-unmatched-pattern  当模式未匹配时不退出并报错
  --threads=INT                    要使用的线程数。设置为 1 表示仅使用 1 个 CPU 核心。

可用选项：
  -h, --help  打印帮助信息

示例：
  vp fmt
  vp fmt src --check
  vp fmt . --write

文档：https://viteplus.dev/guide/fmt
```
