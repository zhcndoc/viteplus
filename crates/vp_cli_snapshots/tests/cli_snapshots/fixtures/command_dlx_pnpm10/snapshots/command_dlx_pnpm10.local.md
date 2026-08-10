# command_dlx_pnpm10

## `vp dlx --help`

应显示帮助信息

```
下载并执行软件包，而无需全局安装

用法：vp dlx [选项] <参数>...

参数：
  <参数>...  要执行的软件包及其参数

选项：
  -p, --package <名称>  运行前要安装的软件包
  -c, --shell-mode      在 shell 环境中执行
  -s, --silent          除所执行命令的输出外，抑制所有输出
  -h, --help            打印帮助信息
```

## `vp dlx -s cowsay hello`

应该使用 pnpm dlx 运行 cowsay

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
