# command_vpx_pnpm10

## `vpx --help`

应显示 vpx 帮助信息

```
从本地或远程 npm 包中执行命令

用法：vpx [选项] <pkg[@version]> [参数...]

参数：
  <pkg[@version]>  要执行的包二进制文件
  [参数...]        要传递给命令的参数

选项：
  -p, --package <NAME>  如果本地未找到，则安装的包
  -c, --shell-mode      在 shell 环境中执行命令
  -s, --silent          除命令输出外，禁止所有输出
  -h, --help            显示帮助信息

示例：
  vpx eslint .                                           # 运行本地 eslint（或下载）
  vpx create-vue my-app                                  # 下载并运行 create-vue
  vpx typescript@5.5.4 tsc --version                     # 运行指定版本
  vpx -p cowsay -c 'echo "hi" | cowsay'                  # 使用包运行 shell 模式
```

## `vpx -s cowsay hello`

应通过 dlx 回退机制运行 cowsay

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
