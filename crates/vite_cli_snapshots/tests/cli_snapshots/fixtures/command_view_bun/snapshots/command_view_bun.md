# command_view_bun

## `vp pm view --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp pm view [选项] <软件包> [字段] [-- <传递参数>...]

从注册表查看软件包信息

参数：
  <软件包>                带可选版本的软件包名称
  [字段]                  要查看的特定字段
  [传递参数]...            其他参数

选项：
  --json      以 JSON 格式输出
  -h, --help  打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp pm view testnpm2`

应显示软件包信息

```
testnpm2@1.0.1 | ISC | deps: 0 | versions: 2

dist
 .tarball: https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz
 .shasum: 8c7b209a673c360e540ab2777242171fd30fdee9
 .integrity: sha512-F4AQ+KmzhbOSlt7ae+X2O8IJktFZAcN6OK169TT4ny7M3e4Vje7NITZTOU31AtEk9L/Z8lrCrqinl/eY6WPuEw==

dist-tags:
latest: 1.0.1
release-1: 1.0.1

maintainers:
- fengmk2 <fengmk2@gmail.com>

Published: 2015-07-18T18:23:59.560Z
```

## `vp pm view testnpm2 version`

应查看版本字段

```
1.0.1
```
