# 命令工具帮助全局委托

全局顶层帮助将委托给本地的 vite-plus CLI。

## `vp dev --help`

```
VITE+ - Web 统一工具链

用法: vp dev [ROOT] [OPTIONS]

运行开发服务器。
选项将传递给 Vite。

参数:
  [ROOT]  项目根目录（默认: 当前目录）

选项:
  --host [host]           [string] 指定主机名
  --port <port>           [number] 指定端口
  --open [path]           [boolean | string] 启动时打开浏览器
  --cors                  [boolean] 启用 CORS
  --strictPort            [boolean] 如果指定端口已被占用则退出
  --force                 [boolean] 强制优化器忽略缓存并重新打包
  --experimentalBundle    [boolean] 使用实验性的完整打包模式（此功能高度实验性）
  --base <path>           [string] 公共基础路径（默认: /）
  -l, --logLevel <level>  [string] info | warn | error | silent
  --clearScreen           [boolean] 允许/禁用日志记录时清屏
  -d, --debug [feat]      [string | boolean] 显示调试日志
  -f, --filter <filter>   [string] 筛选调试日志
  -m, --mode <mode>       [string] 设置环境模式
  -h, --help              显示此消息

示例:
  vp dev
  vp dev --open
  vp dev --host localhost --port 5173

文档: https://viteplus.dev/guide/dev
```
