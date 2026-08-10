# command_pm_global_rejected

## `vp install -g testnpm2`

拒绝：托管安装

**退出代码：** 1

```
error: Global package operations (`-g`/`--global`) are only supported by the globally-installed `vp` CLI. See https://viteplus.dev/guide/ to install it, then run the same command via the global `vp` binary.
```

## `vp install -g testnpm2 --node 20`

已拒绝：--node 已隐含覆盖

**退出代码：** 1

```
错误：全局软件包操作（`-g`/`--global`）仅由全局安装的 `vp` CLI 支持。请参阅 https://viteplus.dev/guide/ 安装它，然后通过全局 `vp` 二进制文件运行相同的命令。
```

## `vp add -g testnpm2`

已拒绝：托管添加

**退出代码：** 1

```
错误：全局软件包操作（`-g`/`--global`）仅由全局安装的 `vp` CLI 支持。请参阅 https://viteplus.dev/guide/ 进行安装，然后通过全局 `vp` 二进制文件运行相同的命令。
```

## `vp add -g testnpm2 --node 20`

已拒绝：--node 已隐式涵盖

**退出代码：** 1

```
error: Global package operations (`-g`/`--global`) are only supported by the globally-installed `vp` CLI. See https://viteplus.dev/guide/ to install it, then run the same command via the global `vp` binary.
```

## `vp remove -g testnpm2`

拒绝：托管卸载

**退出代码：** 1

```
错误：全局软件包操作（`-g`/`--global`）仅受全局安装的 `vp` CLI 支持。请参阅 https://viteplus.dev/guide/ 进行安装，然后通过全局 `vp` 二进制文件运行相同的命令。
```

## `vp remove -g --dry-run testnpm2`

拒绝：`--dry-run` 已隐式包含

**退出代码：** 1

```
错误：全局软件包操作（`-g`/`--global`）仅受全局安装的 `vp` CLI 支持。请参阅 https://viteplus.dev/guide/ 进行安装，然后通过全局 `vp` 二进制文件运行相同的命令。
```

## `vp update -g`

拒绝：受管理的更新

**退出代码：** 1

```
error: Global package operations (`-g`/`--global`) are only supported by the globally-installed `vp` CLI. See https://viteplus.dev/guide/ to install it, then run the same command via the global `vp` binary.
```

## `vp update -g testnpm2`

拒绝：使用软件包进行托管更新

**退出代码：** 1

```
error: Global package operations (`-g`/`--global`) are only supported by the globally-installed `vp` CLI. See https://viteplus.dev/guide/ to install it, then run the same command via the global `vp` binary.
```

## `vp pm ls -g`

已拒绝：托管包列表操作

**退出代码：** 1

```
错误：全局包操作（`-g`/`--global`）仅由全局安装的 `vp` CLI 支持。请参阅 https://viteplus.dev/guide/ 进行安装，然后通过全局 `vp` 二进制文件运行相同的命令。
```
