# command_fmt_help

## `vp fmt -h`

```
VITE+ - Web 的统一工具链

用法：vp fmt [PATH]... [OPTIONS]

格式化代码。
选项将转发给 Oxfmt。

参数：
  [PATH]...  文件、目录或 glob 模式（默认：当前目录）

模式选项：
  --stdin-filepath <PATH>  指定用于推断 stdin 解析器的文件名

输出选项：
  --write           就地格式化并写入文件
  --check           检查文件是否已格式化并显示统计信息
  --list-different  列出将被更改的文件

忽略选项：
  --ignore-path <PATH>  忽略文件的路径；可以多次指定
  --with-node-modules   格式化 node_modules 中的文件，该目录默认会被跳过

运行时选项：
  --no-error-on-unmatched-pattern  当模式未匹配时不要以错误退出
  --threads <INT>                  使用的线程数；设置为 1 以使用一个 CPU 核心

选项：
  -h, --help  打印帮助信息

示例：
  vp fmt
  vp fmt src --check
  vp fmt . --write

文档：https://viteplus.dev/guide/fmt
```

## `vp fmt --help`

```
VITE+ - Web 统一工具链

用法：vp fmt [PATH]... [OPTIONS]

格式化代码。
选项将转发给 Oxfmt。

参数：
  [PATH]...  文件、目录或 glob 模式（默认为当前目录）

模式选项：
  --stdin-filepath <PATH>  指定用于推断标准输入解析器的文件名

输出选项：
  --write           就地格式化并写入文件
  --check           检查文件是否已格式化并显示统计信息
  --list-different  列出将被更改的文件

忽略选项：
  --ignore-path <PATH>  忽略文件的路径；可以多次指定
  --with-node-modules   格式化 node_modules 中的文件（默认跳过）

运行时选项：
  --no-error-on-unmatched-pattern  当模式未匹配时不要以错误退出
  --threads <INT>                  要使用的线程数；设置为 1 以使用一个 CPU 核心

选项：
  -h, --help  打印帮助信息

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

参数：
  [PATH]...  文件、目录或 glob 模式（默认：当前目录）

模式选项：
  --stdin-filepath <PATH>  指定用于推断 stdin 解析器的文件名

输出选项：
  --write           就地格式化并写入文件
  --check           检查文件是否已格式化并显示统计信息
  --list-different  列出将被更改的文件

忽略选项：
  --ignore-path <PATH>  忽略文件的路径；可以多次指定
  --with-node-modules   格式化 node_modules 中的文件，该目录默认会被跳过

运行时选项：
  --no-error-on-unmatched-pattern  当模式未匹配时不要以错误退出
  --threads <INT>                  要使用的线程数；设置为 1 可使用一个 CPU 核心

选项：
  -h, --help  打印帮助信息

示例：
  vp fmt
  vp fmt src --check
  vp fmt . --write

文档：https://viteplus.dev/guide/fmt
```

## `vp format --help`

```
VITE+ - Web 的统一工具链

用法：vp fmt [PATH]... [OPTIONS]

格式化代码。
选项将传递给 Oxfmt。

参数：
  [PATH]...  文件、目录或 glob 模式（默认为当前目录）

模式选项：
  --stdin-filepath <PATH>  指定用于推断 stdin 解析器的文件名

输出选项：
  --write           就地格式化并写入文件
  --check           检查文件是否已格式化并显示统计信息
  --list-different  列出将会被更改的文件

忽略选项：
  --ignore-path <PATH>  忽略文件的路径；可以多次指定
  --with-node-modules   格式化 node_modules 中的文件，该目录默认会被跳过

运行时选项：
  --no-error-on-unmatched-pattern  当模式未匹配时不要以错误退出
  --threads <INT>                  要使用的线程数；设置为 1 以使用一个 CPU 核心

选项：
  -h, --help  打印帮助信息

示例：
  vp fmt
  vp fmt src --check
  vp fmt . --write

文档：https://viteplus.dev/guide/fmt
```
