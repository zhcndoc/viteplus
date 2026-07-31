# 全局命令已过时

## `vp install -g testnpm2@1.0.0`

应准备全局过时的软件包


## `vp outdated definitely-not-installed-vite-plus-snap-pkg -g --format json`

应支持为空的全局 JSON 输出

```
{}
```

## `vp outdated testnpm2 -g --format json`

应支持全局 JSON 输出

**退出代码：** 1

```
{
  "testnpm2": {
    "current": "1.0.0",
    "wanted": "1.0.1",
    "latest": "1.0.1",
    "dependent": "global",
    "location": "<home>/.vite-plus/packages/testnpm2#<uuid>/lib/node_modules/testnpm2"
  }
}
```

## `vp outdated testnpm2 -g --format list --concurrency 5`

应支持全局列表输出

**退出代码：** 1

```
testnpm2 (global)
1.0.0 => 1.0.1
```
