# npm10 工作区中的过时命令

## `vp install`

```
VITE+ - The Unified Toolchain for the Web

added 6 packages, and audited 9 packages in <duration>

found 0 vulnerabilities
```

## `vp outdated testnpm2 -w`

应在工作区根目录显示过时信息

**退出代码：** 1

```
Package   Current  Wanted  Latest  Location               Depended by
testnpm2    1.0.0   1.0.0   1.0.1  node_modules/testnpm2  workspace
```

## `vp outdated testnpm2 --filter app`

应显示指定包中的过时依赖

```

## `vp outdated --filter * --format json`

应显示所有包中的过期依赖

**退出代码：** 1

```
{
  "test-vite-plus-other-optional": {
    "current": "1.0.0",
    "wanted": "1.0.0",
    "latest": "1.1.0",
    "dependent": "app",
    "location": "<workspace>/node_modules/test-vite-plus-other-optional"
  }
}
```

## `vp outdated -r`

应递归检查过时的依赖

**退出代码：** 1

```
Package                        Current  Wanted  Latest  Location                                    Depended by
test-vite-plus-other-optional    1.0.0   1.0.0   1.1.0  node_modules/test-vite-plus-other-optional  app@
testnpm2                         1.0.0   1.0.0   1.0.1  node_modules/testnpm2                       workspace
```
