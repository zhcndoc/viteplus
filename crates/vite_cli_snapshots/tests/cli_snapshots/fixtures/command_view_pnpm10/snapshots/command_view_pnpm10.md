# command_view_pnpm10

## `vp pm view --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp pm view [选项] <软件包> [字段] [-- <传递参数>...]

查看注册表中的软件包信息

Arguments:
  <PACKAGE>               Package name with optional version
  [FIELD]                 Specific field to view
  [PASS_THROUGH_ARGS]...  Additional arguments to pass through to the package manager

选项：
  --json      以 JSON 格式输出
  -h, --help  打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp pm view testnpm2`

应查看 lodash 包信息（使用 npm view）

```

testnpm2@1.0.1 | ISC | 依赖项：无 | 版本数：2

分发信息
.tarball: https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz
.shasum: 8c7b209a673c360e540ab2777242171fd30fdee9
.integrity: sha512-F4AQ+KmzhbOSlt7ae+X2O8IJktFZAcN6OK169TT4ny7M3e4Vje7NITZTOU31AtEk9L/Z8lrCrqinl/eY6WPuEw==

维护者：
- fengmk2 <fengmk2@gmail.com>

分发标签：
latest: 1.0.1
release-1: 1.0.1

由 fengmk2 <fengmk2@gmail.com> 发布于一年多前
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
- fengmk2 <fengmk2@gmail.com>

dist-tags:
latest: 1.0.1
release-1: 1.0.1

published over a year ago by fengmk2 <fengmk2@gmail.com>
```

## `vp pm view testnpm2 dist.tarball`

应该查看嵌套字段（使用 npm view）

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

应该支持传递参数（使用 npm view）

```

testnpm2@1.0.1 | ISC | 依赖项：无 | 版本数：2

发行信息
.tarball: https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz
.shasum: 8c7b209a673c360e540ab2777242171fd30fdee9
.integrity: sha512-F4AQ+KmzhbOSlt7ae+X2O8IJktFZAcN6OK169TT4ny7M3e4Vje7NITZTOU31AtEk9L/Z8lrCrqinl/eY6WPuEw==

维护者：
- fengmk2 <fengmk2@gmail.com>

发行标签：
latest: 1.0.1
release-1: 1.0.1

一年多前由 fengmk2 <fengmk2@gmail.com> 发布
```
