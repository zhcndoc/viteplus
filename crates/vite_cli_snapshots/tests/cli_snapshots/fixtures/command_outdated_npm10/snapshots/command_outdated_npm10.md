# 命令过时_npm10

## `vp install`

应先安装软件包

```
VITE+ - Web 的统一工具链

已添加 4 个软件包，并在 <duration> 内审计了 5 个软件包

发现 0 个漏洞
```

## `vp outdated testnpm2`

应显示过期的软件包

**退出代码：** 1

```
Package   Current  Wanted  Latest  Location               Depended by
testnpm2    1.0.0   1.0.0   1.0.1  node_modules/testnpm2  workspace
```

## `vp outdated test-vite*`

在 npm 上使用 glob 模式时，outdated 无法正常工作

```
```

## `vp outdated --format json`

应支持 JSON 输出

**退出代码：** 1

```
{
  "test-vite-plus-other-optional": {
    "current": "1.0.0",
    "wanted": "1.0.0",
    "latest": "1.1.0",
    "dependent": "workspace",
    "location": "<workspace>/node_modules/test-vite-plus-other-optional"
  },
  "test-vite-plus-top-package": {
    "current": "1.0.0",
    "wanted": "1.0.0",
    "latest": "1.1.0",
    "dependent": "workspace",
    "location": "<workspace>/node_modules/test-vite-plus-top-package"
  },
  "testnpm2": {
    "current": "1.0.0",
    "wanted": "1.0.0",
    "latest": "1.0.1",
    "dependent": "workspace",
    "location": "<workspace>/node_modules/testnpm2"
  }
}
```

## `vp outdated --format list`

应支持列表输出

**退出代码：** 1

```
<workspace>/node_modules/test-vite-plus-other-optional:test-vite-plus-other-optional@1.0.0:test-vite-plus-other-optional@1.0.0:test-vite-plus-other-optional@1.1.0:workspace
<workspace>/node_modules/test-vite-plus-top-package:test-vite-plus-top-package@1.0.0:test-vite-plus-top-package@1.0.0:test-vite-plus-top-package@1.1.0:workspace
<workspace>/node_modules/testnpm2:testnpm2@1.0.0:testnpm2@1.0.0:testnpm2@1.0.1:workspace
```

## `vp outdated --format table`

应支持表格输出

**退出代码：** 1

```
Package                        Current  Wanted  Latest  Location                                    Depended by
test-vite-plus-other-optional    1.0.0   1.0.0   1.1.0  node_modules/test-vite-plus-other-optional  workspace
test-vite-plus-top-package       1.0.0   1.0.0   1.1.0  node_modules/test-vite-plus-top-package     workspace
testnpm2                         1.0.0   1.0.0   1.0.1  node_modules/testnpm2                       workspace
```

## `vp outdated testnpm2 --long`

应该支持 --long

**退出代码：** 1

```
Package   Current  Wanted  Latest  Location               Depended by  Package Type  Homepage
testnpm2    1.0.0   1.0.0   1.0.1  node_modules/testnpm2  workspace    dependencies
```

## `vp outdated -r`

应支持递归输出

**退出代码：** 1

```
Package                        Current  Wanted  Latest  Location                                    Depended by
test-vite-plus-other-optional    1.0.0   1.0.0   1.1.0  node_modules/test-vite-plus-other-optional  workspace
test-vite-plus-top-package       1.0.0   1.0.0   1.1.0  node_modules/test-vite-plus-top-package     workspace
testnpm2                         1.0.0   1.0.0   1.0.1  node_modules/testnpm2                       workspace
```

## `vp outdated -P`

应支持 prod 输出

**退出代码：** 1

```
warn: npm does not support --prod.
Package                        Current  Wanted  Latest  Location                                    Depended by
test-vite-plus-other-optional    1.0.0   1.0.0   1.1.0  node_modules/test-vite-plus-other-optional  workspace
test-vite-plus-top-package       1.0.0   1.0.0   1.1.0  node_modules/test-vite-plus-top-package     workspace
testnpm2                         1.0.0   1.0.0   1.0.1  node_modules/testnpm2                       workspace
```

## `vp outdated -D`

应支持 dev 输出

**退出代码：** 1

```
warn: npm does not support --dev.
Package                        Current  Wanted  Latest  Location                                    Depended by
test-vite-plus-other-optional    1.0.0   1.0.0   1.1.0  node_modules/test-vite-plus-other-optional  workspace
test-vite-plus-top-package       1.0.0   1.0.0   1.1.0  node_modules/test-vite-plus-top-package     workspace
testnpm2                         1.0.0   1.0.0   1.0.1  node_modules/testnpm2                       workspace
```

## `vp outdated --no-optional`

应支持无可选依赖项输出

**退出代码：** 1

```
warn: npm does not support --no-optional.
Package                        Current  Wanted  Latest  Location                                    Depended by
test-vite-plus-other-optional    1.0.0   1.0.0   1.1.0  node_modules/test-vite-plus-other-optional  workspace
test-vite-plus-top-package       1.0.0   1.0.0   1.1.0  node_modules/test-vite-plus-top-package     workspace
testnpm2                         1.0.0   1.0.0   1.0.1  node_modules/testnpm2                       workspace
```

## `vp outdated --compatible`

兼容模式应不输出任何内容

**退出代码：** 1

```
warn: npm does not support --compatible.
Package                        Current  Wanted  Latest  Location                                    Depended by
test-vite-plus-other-optional    1.0.0   1.0.0   1.1.0  node_modules/test-vite-plus-other-optional  workspace
test-vite-plus-top-package       1.0.0   1.0.0   1.1.0  node_modules/test-vite-plus-top-package     workspace
testnpm2                         1.0.0   1.0.0   1.0.1  node_modules/testnpm2                       workspace
```

## `vpt json-edit package.json optionalDependencies.test-vite-plus-other-optional '"^1.0.0"'`

应支持与可选依赖项兼容的输出。


## `vp outdated --compatible`

**退出代码：** 1

```
warn: npm does not support --compatible.
Package                        Current  Wanted  Latest  Location                                    Depended by
test-vite-plus-other-optional    1.0.0   1.1.0   1.1.0  node_modules/test-vite-plus-other-optional  workspace
test-vite-plus-top-package       1.0.0   1.0.0   1.1.0  node_modules/test-vite-plus-top-package     workspace
testnpm2                         1.0.0   1.0.0   1.0.1  node_modules/testnpm2                       workspace
```

## `vp outdated --sort-by name`

应支持按 sort-by 输出

**退出代码：** 1

```
warn: npm does not support --sort-by.
Package                        Current  Wanted  Latest  Location                                    Depended by
test-vite-plus-other-optional    1.0.0   1.1.0   1.1.0  node_modules/test-vite-plus-other-optional  workspace
test-vite-plus-top-package       1.0.0   1.0.0   1.1.0  node_modules/test-vite-plus-top-package     workspace
testnpm2                         1.0.0   1.0.0   1.0.1  node_modules/testnpm2                       workspace
```
