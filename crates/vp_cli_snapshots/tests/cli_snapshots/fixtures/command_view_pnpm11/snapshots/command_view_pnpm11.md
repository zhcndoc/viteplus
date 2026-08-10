# command_view_pnpm11

## `vp pm view --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp pm view [选项] <PACKAGE> [FIELD] [-- <PASS_THROUGH_ARGS>...]

从注册表查看软件包信息

参数：
  <PACKAGE>               包名称，可包含版本号
  [FIELD]                 要查看的特定字段
  [PASS_THROUGH_ARGS]...  要传递给软件包管理器的其他参数

选项：
  --json      以 JSON 格式输出
  -h, --help  打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp pm view testnpm2`

应查看 lodash 软件包信息（使用 npm view）

```
testnpm2@1.0.1 | ISC | deps: none | versions: 2

dist
.tarball: https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz
.shasum: 8c7b209a673c360e540ab2777242171fd30fdee9
.integrity: sha512-F4AQ+KmzhbOSlt7ae+X2O8IJktFZAcN6OK169TT4ny7M3e4Vje7NITZTOU31AtEk9L/Z8lrCrqinl/eY6WPuEw==

maintainers:
- fengmk2

dist-tags:
latest: 1.0.1
release-1: 1.0.1
```

## `vp pm view testnpm2 version`

应查看 lodash 的版本字段（使用 npm view）

```
1.0.1
```

## `vp pm view testnpm2@1.0.0`

应查看 lodash 的特定版本（使用 npm view）

```
testnpm2@1.0.0 | ISC | deps: none | versions: 2

dist
.tarball: https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.0.tgz
.shasum: 3f9430987a1d4ff52c8c5162e99b5d8596efefa6
.integrity: sha512-8gdtqxKad+83Iog2v514VsHsSk/R+we9j5/9zX9tB+QC2ubvB06zJ08k0PSl5uzviXByEMiWm7EzSbBAh2GZ/w==

maintainers:
- fengmk2

dist-tags:
latest: 1.0.1
release-1: 1.0.1
```

## `vp pm view testnpm2 dist.tarball`

应查看嵌套字段（使用 npm view）

```
https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz
```

## `vp pm view testnpm2 dependencies`

应查看依赖项对象（使用 npm view）

```
```

## `vp pm view testnpm2 dist.tarball --json`

应以 JSON 格式查看 package.dist.tarball 信息（使用 npm view）

```
"https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz"
```

## `vp pm view testnpm2 version --json`

应以 JSON 格式查看字段（使用 npm view）

```
"1.0.1"
```

## `vp pm view testnpm2 -- --loglevel=warn`

应支持传递参数（使用 npm view）

```
testnpm2@1.0.1 | ISC | deps: none | versions: 2

dist
.tarball: https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz
.shasum: 8c7b209a673c360e540ab2777242171fd30fdee9
.integrity: sha512-F4AQ+KmzhbOSlt7ae+X2O8IJktFZAcN6OK169TT4ny7M3e4Vje7NITZTOU31AtEk9L/Z8lrCrqinl/eY6WPuEw==

maintainers:
- fengmk2

dist-tags:
latest: 1.0.1
release-1: 1.0.1
```
