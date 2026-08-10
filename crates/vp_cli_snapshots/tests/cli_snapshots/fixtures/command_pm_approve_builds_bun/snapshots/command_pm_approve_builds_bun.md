# command_pm_approve_builds_bun

## `vp pm approve-builds --help`

应显示包含 `--all` 注意事项的帮助信息

```
VITE+ - Web 统一工具链

用法：vp pm approve-builds [选项] [软件包]... [-- <透传参数>...]

批准运行依赖项生命周期脚本（install/postinstall）

参数：
  [软件包]...              要批准的软件包。以 `!` 为前缀表示拒绝（pnpm >= 11.0.0，npm >= 11.16.0）。省略此参数时，将启动交互模式（pnpm）或列出待处理的软件包（npm >= 11.16.0）
  [透传参数]...            要传递给软件包管理器的其他参数

选项：
  --all                    批准当前所有待批准的软件包（pnpm >= 10.32.0，npm >= 11.16.0）。不能与位置参数同时使用
  -h, --help               打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp pm approve-builds`

无参数运行 bun：打印上下文提示，退出码为 0

```
提示：bun pm trust 需要指定软件包名称。运行 `bun pm untrusted` 查看哪些软件包正在等待处理，然后显式传入它们：`vp pm approve-builds <pkg> [<pkg>...]` 或 `vp pm approve-builds --all`。
```

## `vp pm approve-builds !core-js`

仅拒绝：打印拒绝警告，不显示冗余说明

```
警告：bun 不支持将构建脚本列入拒绝列表。package.json 中 `trustedDependencies` 之外的软件包默认已被拒绝。跳过：core-js
```

## `vp pm approve-builds --all`

转发 bun pm trust --all（空项目时出错——没有锁文件）

**退出代码：** 1

```
bun pm trust <version> (af24e281)
error: Lockfile not found
```
