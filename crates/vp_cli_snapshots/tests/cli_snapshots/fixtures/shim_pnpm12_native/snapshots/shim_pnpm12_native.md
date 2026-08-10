# shim_pnpm12_native

pnpm 12 通过 @pnpm/exe.* 平台软件包提供原生二进制文件；pnpm shim 直接运行该文件，而 pnpx shim 注入 dlx 子命令。

## `vp install -g pnpm`

暴露 pnpm/pnpx shim


## `vp env exec node --version`

请先确保已安装 Node.js


## `pnpm --version`

pnpm shim 下载原生二进制文件并解析固定的 packageManager 版本（12.0.0-beta.0）

```
12.0.0-beta.0
```

## `pnpx --silent cowsay hello`

pnpx shim 注入 dlx，使原生二进制文件运行该软件包

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
