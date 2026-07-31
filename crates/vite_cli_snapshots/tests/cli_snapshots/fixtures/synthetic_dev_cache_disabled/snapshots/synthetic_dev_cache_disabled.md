# 合成开发缓存已禁用

## `vp run dev`

即使启用了 cacheScripts，模拟 dev（vp dev）也应禁用缓存

```
$ vp dev --help ⊘ 已禁用缓存
vp/<版本>

用法：
  $ vp [根目录]

命令：
  [根目录]           启动开发服务器
  build [根目录]     构建生产版本
  optimize [根目录]  预打包依赖（已弃用，预打包过程会自动运行，无需手动调用）
  preview [根目录]   在本地预览生产构建

如需了解更多信息，请使用 `--help` 标志运行任意命令：
  $ vp --help
  $ vp build --help
  $ vp optimize --help
  $ vp preview --help

选项：
  --host [主机]            [字符串] 指定主机名
  --port <端口>            [数字] 指定端口
  --open [路径]            [布尔值 | 字符串] 启动时打开浏览器
  --cors                   [布尔值] 启用 CORS
  --strictPort             [布尔值] 如果指定的端口已被占用则退出
  --force                  [布尔值] 强制优化器忽略缓存并重新打包
  --experimentalBundle     [布尔值] 使用实验性的完整打包模式（高度实验性）
  -c, --config <文件>      [字符串] 使用指定的配置文件
  --base <路径>            [字符串] 公共基础路径（默认：/）
  -l, --logLevel <级别>    [字符串] info | warn | error | silent
  --clearScreen            [布尔值] 允许/禁用日志记录时清屏
  --configLoader <加载器>  [字符串] 使用 'bundle' 通过 Rolldown 打包配置，或使用 'runner'（实验性）即时处理，或使用 'native'（实验性）通过原生运行时加载（默认：bundle）
  -d, --debug [功能]       [字符串 | 布尔值] 显示调试日志
  -f, --filter <过滤器>    [字符串] 过滤调试日志
  -m, --mode <模式>        [字符串] 设置环境模式
  -h, --help               显示此消息
  -v, --version            显示版本号
```
