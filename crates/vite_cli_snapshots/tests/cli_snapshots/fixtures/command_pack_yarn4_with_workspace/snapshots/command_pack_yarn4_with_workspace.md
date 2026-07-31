# command_pack_yarn4_with_workspace

## `vp install -- --mode=update-lockfile`

应该先安装软件包

```
VITE+ - 面向 Web 的统一工具链

➤ YN0000: · Yarn <version>
➤ YN0000: ┌ 解析步骤
➤ YN0000: └ 已完成
➤ YN0000: ┌ 获取步骤
➤ YN0000: └ 已完成
➤ YN0000: ┌ 链接步骤
➤ YN0073: │ 因 mode=update-lockfile 而跳过
➤ YN0000: └ 已完成
➤ YN0000: · 已完成，但存在警告，用时 <duration> <duration>
```

## `vp pm pack`

应打包当前工作区根目录

```
➤ YN0000: package.json
➤ YN0000: 已在 <workspace>/package.tgz 中生成软件包归档
➤ YN0000: 已在 <duration> <duration> 内完成
```

## `vp pm pack --recursive`

应打包工作区中的所有软件包（使用 workspaces foreach --all pack）

```
[command-pack-yarn4-with-workspace]: 进程已启动
[command-pack-yarn4-with-workspace]: ➤ YN0000: package.json
[command-pack-yarn4-with-workspace]: ➤ YN0000: 软件包归档已生成于 <workspace>/package.tgz
[command-pack-yarn4-with-workspace]: ➤ YN0000: 完成，用时 <duration> <duration>
[command-pack-yarn4-with-workspace]: 进程已退出（退出代码 0），已完成，用时 <duration> <duration>

[app]: 进程已启动
[app]: ➤ YN0000: package.json
[app]: ➤ YN0000: 软件包归档已生成于 <workspace>/packages/app/package.tgz
[app]: ➤ YN0000: 完成，用时 <duration> <duration>
[app]: 进程已退出（退出代码 0），已完成，用时 <duration> <duration>

[@vite-plus-test/utils]: 进程已启动
[@vite-plus-test/utils]: ➤ YN0000: package.json
[@vite-plus-test/utils]: ➤ YN0000: 软件包归档已生成于 <workspace>/packages/utils/package.tgz
[@vite-plus-test/utils]: ➤ YN0000: 完成，用时 <duration> <duration>
[@vite-plus-test/utils]: 进程已退出（退出代码 0），已完成，用时 <duration> <duration>

已完成，用时 <duration> <duration>
```

## `vp pm pack --filter app`

应打包指定的软件包（使用 workspaces foreach --all --include app pack）

```
[app]: 进程已启动
[app]: ➤ YN0000: package.json
[app]: ➤ YN0000: 已在 <workspace>/packages/app/package.tgz 生成软件包归档
[app]: ➤ YN0000: 已完成，用时 <duration> <duration>
[app]: 进程已退出（退出代码：0），已完成，用时 <duration> <duration>

已完成，用时 <duration> <duration>
```

## `vp pm pack --filter app --filter @vite-plus-test/utils`

应打包多个软件包

```
[app]: Process started
[app]: ➤ YN0000: package.json
[app]: ➤ YN0000: Package archive generated in <workspace>/packages/app/package.tgz
[app]: ➤ YN0000: Done in <duration> <duration>
[app]: Process exited (exit code 0), completed in <duration> <duration>

[@vite-plus-test/utils]: Process started
[@vite-plus-test/utils]: ➤ YN0000: package.json
[@vite-plus-test/utils]: ➤ YN0000: Package archive generated in <workspace>/packages/utils/package.tgz
[@vite-plus-test/utils]: ➤ YN0000: Done in <duration> <duration>
[@vite-plus-test/utils]: Process exited (exit code 0), completed in <duration> <duration>

Done in <duration> <duration>
```

## `vp pm pack --out ./dist/package.tgz`

应使用输出文件进行打包

```
➤ YN0000: package.json
➤ YN0000: Package archive generated in <workspace>/dist/package.tgz
➤ YN0000: Done in <duration> <duration>
```

## `vp pm pack --json`

应以 JSON 输出进行打包

```
{"base":"<workspace>"}
{"location":"dist/package.tgz"}
{"location":"package.json"}
{"output":"<workspace>/package.tgz"}
```
