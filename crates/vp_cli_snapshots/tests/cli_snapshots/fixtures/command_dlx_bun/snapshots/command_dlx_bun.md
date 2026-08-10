# command_dlx_bun

## `vp dlx --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp dlx [选项] <参数>...

下载并执行软件包，无需全局安装

参数：
  <参数>...  要执行的软件包及参数

选项：
  -p, --package <名称>  运行前要安装的软件包
  -c, --shell-mode      在 Shell 环境中执行
  -s, --silent          除所执行命令的输出外，禁止所有输出
  -h, --help            显示帮助

文档：https://viteplus.dev/guide/vpx
```

## `vp dlx -s cowsay hello`

应使用 bun x 运行 cowsay

```
 _______
< hello >
 -------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```

## `vp dlx -s cowsay@1.6.0 hello`

应运行指定版本

```
 _______
< hello >
 -------
        \   ^__^
         \  (oo)\_______
            (__)\       )\/\
                ||----w |
                ||     ||
```
