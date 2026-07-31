# 全局 CLI 回退

## `vp build -h`

应回退到全局 vite-plus 并显示构建帮助信息

```
VITE+ - The Unified Toolchain for the Web

Usage: vp build [ROOT] [OPTIONS]

Build for production.
Options are forwarded to Vite.

Arguments:
  [ROOT]  Project root directory (default: current directory)

Options:
  --target <TARGET>    Transpile target
  --outDir <DIR>       Output directory
  --sourcemap [MODE]   Output source maps
  --minify [MINIFIER]  Enable/disable minification
  -w, --watch          Rebuild when files change
  -c, --config <FILE>  Use specified config file
  -m, --mode <MODE>    Set env mode
  -h, --help           Print help

Examples:
  vp build
  vp build --watch
  vp build --sourcemap

Documentation: https://viteplus.dev/guide/build
```

## `vp dev -h`

应回退到全局 vite-plus 并显示 dev 帮助信息

```
VITE+ - Web 的统一工具链

用法：vp dev [ROOT] [OPTIONS]

运行开发服务器。
选项会传递给 Vite。

参数：
  [ROOT]  项目根目录（默认：当前目录）

选项：
  --host [HOST]        指定主机名
  --port <PORT>        指定端口
  --open [PATH]        启动时打开浏览器
  --strictPort         如果指定端口已被占用则退出
  -c, --config <FILE>  使用指定的配置文件
  --base <PATH>        公共基础路径
  -m, --mode <MODE>    设置环境模式
  -h, --help           显示帮助信息

示例：
  vp dev
  vp dev --open
  vp dev --host localhost --port 5173

文档：https://viteplus.dev/guide/dev
```

## `vp test -h`

应回退到全局 vite-plus 并显示测试帮助信息

```
VITE+ - Web 统一工具链

用法：vp test [COMMAND] [FILTERS] [OPTIONS]

运行测试。
选项将转发给 Vitest。

命令：
  run      运行一次测试
  watch    以监听模式运行测试
  dev      以开发模式运行测试
  related  运行与已更改文件相关的测试
  bench    运行基准测试
  init     初始化 Vitest 配置
  list     列出匹配的测试

选项：
  -c, --config <PATH>              配置文件路径
  -w, --watch                      启用监听模式
  -t, --testNamePattern <PATTERN>  运行匹配正则表达式的测试
  --ui                             启用 UI
  --coverage                       启用覆盖率
  --reporter <NAME>                指定报告器
  -h, --help                       显示帮助信息

示例：
  vp test
  vp test run src/foo.test.ts
  vp test watch --coverage

文档：https://viteplus.dev/guide/test
```
