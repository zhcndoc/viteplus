# command_why_npm10

## `vp install`

应先安装软件包

```
VITE+ - Web 统一工具链

已添加 3 个软件包，并审核了 4 个软件包，耗时 <duration>

发现 0 个漏洞
```

## `vp why testnpm2`

应显示安装该软件包的原因（使用 npm explain）

```
testnpm2@1.0.1
node_modules/testnpm2
  testnpm2@"1.0.1" from the root project
```

## `vp explain testnpm2`

应适用于 explain 别名

```
testnpm2@1.0.1
node_modules/testnpm2
  testnpm2@"1.0.1" from the root project
```

## `vp why test-vite-plus-package`

应显示安装 dev 包的原因

```
test-vite-plus-package@1.0.0 dev
node_modules/test-vite-plus-package
  dev test-vite-plus-package@"1.0.0" from the root project
```

## `vp why testnpm2 --json`

应支持 JSON 输出

```
[
  {
    "name": "testnpm2",
    "version": "1.0.1",
    "location": "node_modules/testnpm2",
    "isWorkspace": false,
    "dependents": [
      {
        "type": "prod",
        "name": "testnpm2",
        "spec": "1.0.1",
        "from": {
          "location": "<workspace>"
        }
      }
    ],
    "dev": false,
    "optional": false,
    "devOptional": false,
    "peer": false,
    "bundled": false,
    "overridden": false
  }
]
```

## `vp why testnpm2 test-vite-plus-package`

应支持多个软件包

```
testnpm2@1.0.1
node_modules/testnpm2
  testnpm2@"1.0.1" from the root project

test-vite-plus-package@1.0.0 dev
node_modules/test-vite-plus-package
  dev test-vite-plus-package@"1.0.0" from the root project
```

## `vp why testnpm2 --long`

应警告 --long 不受 npm 支持

```
warn: npm does not support --long.
testnpm2@1.0.1
node_modules/testnpm2
  testnpm2@"1.0.1" from the root project
```

## `vp why testnpm2 --parseable`

应警告 npm 不支持 --parseable

```
警告：npm 不支持 --parseable。
testnpm2@1.0.1
node_modules/testnpm2
  testnpm2@"1.0.1" 来自根项目
```

## `vp why testnpm2 -P`

应警告 `--prod` 不受 npm 支持

```
warn: npm does not support --prod.
testnpm2@1.0.1
node_modules/testnpm2
  testnpm2@"1.0.1" from the root project
```

## `vp why testnpm2 --find-by customFinder`

应警告 --find-by 不受 npm 支持

```
警告：npm 不支持 --find-by。
testnpm2@1.0.1
node_modules/testnpm2
  根项目中的 testnpm2@"1.0.1"
```

## `vp why testnpm2 -- --omit=dev`

应支持传递参数

```
testnpm2@1.0.1
node_modules/testnpm2
  testnpm2@"1.0.1" from the root project
```
