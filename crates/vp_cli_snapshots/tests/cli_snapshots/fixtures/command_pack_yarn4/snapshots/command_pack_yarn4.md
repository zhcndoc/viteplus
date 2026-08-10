# command_pack_yarn4

## `vp pm pack`

应打包当前软件包

```
➤ YN0000: package.json
➤ YN0000: Package archive generated in <workspace>/package.tgz
➤ YN0000: Done in <duration> <duration>
```

## `vp pm pack --out ./dist/package.tgz`

应使用输出文件进行打包

```
➤ YN0000: package.json
➤ YN0000: Package archive generated in <workspace>/dist/package.tgz
➤ YN0000: Done in <duration> <duration>
```

## `vp pm pack --json`

应使用 JSON 输出进行打包

```
{"base":"<workspace>"}
{"location":"dist/package.tgz"}
{"location":"package.json"}
{"output":"<workspace>/package.tgz"}
```

## `vp pm pack -- --dry-run`

应支持透传参数

```
➤ YN0000: dist/package.tgz
➤ YN0000: package.json
➤ YN0000: Done in <duration> <duration>
```
