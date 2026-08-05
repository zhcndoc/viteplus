# command_tool_help_global_delegation

全局帮助和任务脚本帮助委托给本地 vite-plus CLI。

## `vp dev --help`

```
VITE+ - Web 的统一工具链

用法：vp dev [ROOT] [OPTIONS]

运行开发服务器。
选项将传递给 Vite。

参数：
  [ROOT]  项目根目录（默认：当前目录）

选项：
  --host [HOST]           指定主机名
  --port <PORT>           指定端口
  --open [PATH]           启动时打开浏览器
  --cors                  启用 CORS
  --strictPort            如果指定端口已被占用则退出
  --force                 忽略优化器缓存并重新打包
  --experimentalBundle    使用实验性的完整打包模式
  --base <PATH>           公共基础路径
  -l, --logLevel <LEVEL>  设置日志级别
  --clearScreen           允许或禁用清屏
  -d, --debug [FEAT]      显示调试日志
  -f, --filter <FILTER>   筛选调试日志
  -m, --mode <MODE>       设置环境模式
  -h, --help              打印帮助信息

示例：
  vp dev
  vp dev --open
  vp dev --host localhost --port 5173

文档：https://viteplus.dev/guide/dev
```

## `vpr localhelp --help`

```
$ vp dev --help --help ⊘ 缓存已禁用
VITE+ - Web 的统一工具链

用法：vp dev [ROOT] [OPTIONS]

运行开发服务器。
选项将转发给 Vite。

参数：
  [ROOT]  项目根目录（默认为当前目录）

选项：
  --host [HOST]           指定主机名
  --port <PORT>           指定端口
  --open [PATH]           启动时打开浏览器
  --cors                  启用 CORS
  --strictPort            如果指定端口已被占用则退出
  --force                 忽略优化器缓存并重新打包
  --experimentalBundle    使用实验性的完整打包模式
  --base <PATH>           公共基础路径
  -l, --logLevel <LEVEL>  设置日志级别
  --clearScreen           允许或禁用清屏
  -d, --debug [FEAT]      显示调试日志
  -f, --filter <FILTER>   筛选调试日志
  -m, --mode <MODE>       设置环境模式
  -h, --help              打印帮助信息

示例：
  vp dev
  vp dev --open
  vp dev --host localhost --port 5173

文档：https://viteplus.dev/guide/dev
```
