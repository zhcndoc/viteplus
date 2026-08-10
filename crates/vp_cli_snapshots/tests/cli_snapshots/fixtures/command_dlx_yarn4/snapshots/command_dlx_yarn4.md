# command_dlx_yarn4

## `vp dlx --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp dlx [OPTIONS] <ARGS>...

下载并执行软件包，而无需全局安装

参数：
  <ARGS>...  要执行的软件包及其参数

选项：
  -p, --package <NAME>  运行前要安装的软件包
  -c, --shell-mode      在 shell 环境中执行
  -s, --silent          除被执行命令的输出外，抑制所有输出
  -h, --help            显示帮助信息

文档：https://viteplus.dev/guide/vpx
```

## `vp dlx -s cowsay hello`

应该使用 yarn dlx 运行 cowsay

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
