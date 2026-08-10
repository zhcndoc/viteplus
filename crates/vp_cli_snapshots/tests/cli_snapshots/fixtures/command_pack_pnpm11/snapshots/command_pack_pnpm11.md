# command_pack_pnpm11

## `vp pm pack --help`

应显示帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp pm pack [选项] [-- <PASS_THROUGH_ARGS>...]

创建软件包的 tarball

参数：
  [PASS_THROUGH_ARGS]...  其他参数

选项：
  -r, --recursive                        打包所有工作区软件包
  --filter <PATTERN>                     筛选要打包的软件包
  --out <OUT>                            tarball 的输出路径
  --pack-destination <PACK_DESTINATION>  保存 tarball 的目录
  --pack-gzip-level <PACK_GZIP_LEVEL>    Gzip 压缩级别（0-9）
  --json                                 以 JSON 格式输出
  -h, --help                             显示帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp pm pack`

应打包当前软件包

```
package: command-pack-pnpm11@1.0.0
Tarball Contents
package.json
Tarball Details
command-pack-pnpm11-1.0.0.tgz
```

## `vpt rm -f command-pack-pnpm11-1.0.0.tgz`


## `vp pm pack --out ./dist/package.tgz`

应使用输出文件进行打包

```
package: command-pack-pnpm11@1.0.0
Tarball Contents
package.json
Tarball Details
<workspace>/dist/package.tgz
```

## `vpt rm -rf ./dist`

```
```

## `vp pm pack --pack-destination ./dist`

应使用指定的目标目录进行打包

```
package: command-pack-pnpm11@1.0.0
Tarball Contents
package.json
Tarball Details
<workspace>/dist/command-pack-pnpm11-1.0.0.tgz
```

## `vpt rm -rf ./dist`

```
```

## `vp pm pack --json --pack-gzip-level 9`

应使用 gzip 压缩级别进行打包

```
{
  "name": "command-pack-pnpm11",
  "version": "1.0.0",
  "filename": "command-pack-pnpm11-1.0.0.tgz",
  "files": [
    {
      "path": "package.json"
    }
  ]
}
```

## `vpt rm -f command-pack-pnpm11-1.0.0.tgz`


## `vp pm pack --json`

应以 JSON 输出进行打包

```
{
  "name": "command-pack-pnpm11",
  "version": "1.0.0",
  "filename": "command-pack-pnpm11-1.0.0.tgz",
  "files": [
    {
      "path": "package.json"
    }
  ]
}
```

## `vpt rm -f command-pack-pnpm11-1.0.0.tgz`


## `vp pm pack -- --loglevel=warn`

应支持透传参数

```
package: command-pack-pnpm11@1.0.0
Tarball Contents
package.json
Tarball Details
command-pack-pnpm11-1.0.0.tgz
```

## `vpt rm -f command-pack-pnpm11-1.0.0.tgz`

