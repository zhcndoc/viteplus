# command_fmt_help

## `vp fmt -h`

```
VITE+ - Web 的统一工具链

用法：vp fmt [PATH]... [OPTIONS]

格式化代码。
选项将转发给 Oxfmt。

选项：
  --write               就地格式化并写入文件
  --check               检查文件是否已格式化
  --list-different      列出将被更改的文件
  --ignore-path <PATH>  要忽略的文件路径
  --threads <INT>       要使用的线程数
  -h, --help            显示帮助

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

选项：
  --write               就地格式化并写入文件
  --check               检查文件是否已格式化
  --list-different      列出将发生更改的文件
  --ignore-path <PATH>  要忽略的文件路径
  --threads <INT>       要使用的线程数
  -h, --help            显示帮助

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

选项：
  --write               就地格式化并写入文件
  --check               检查文件是否已格式化
  --list-different      列出将被更改的文件
  --ignore-path <PATH>  要忽略的文件路径
  --threads <INT>       要使用的线程数
  -h, --help            显示帮助

示例：
  vp fmt
  vp fmt src --check
  vp fmt . --write

文档：https://viteplus.dev/guide/fmt
```
