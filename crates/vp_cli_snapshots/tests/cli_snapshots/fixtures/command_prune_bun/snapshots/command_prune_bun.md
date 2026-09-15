# command_prune_bun

## `vp install -- --silent`

应先安装软件包

```
VITE+ - The Unified Toolchain for the Web
```

## `vp pm prune`

应清理多余的依赖

```
bun prune <version> (<hash>)

Done! Checked 2 packages across 1 folder (nothing to prune) [<duration>]
```

## `vp pm prune --prod`

应清理开发依赖

```
bun prune <version> (<hash>)

- test-vite-plus-package@1.0.0
1 package removed (checked 2) [<duration>]
```

## `vp pm prune --no-optional`

由于 bun prune 没有 optional 标志，应发出警告

```
warn: bun does not support --no-optional.
bun prune <version> (<hash>)

Done! Checked 1 package across 1 folder (nothing to prune) [<duration>]
```
