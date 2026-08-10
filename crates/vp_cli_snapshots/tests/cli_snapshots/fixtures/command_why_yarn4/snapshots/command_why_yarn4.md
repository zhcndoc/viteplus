# 为什么使用 Yarn 4

## `vp install -- --mode=update-lockfile`

应先安装软件包

```
VITE+ - Web 的统一工具链

➤ YN0000: · Yarn <版本>
➤ YN0000: ┌ 解析步骤
➤ YN0085: │ + test-vite-plus-package-optional@npm:1.0.0、test-vite-plus-package@npm:1.0.0、testnpm2@npm:1.0.1
➤ YN0000: └ 已完成
➤ YN0000: ┌ 获取步骤
➤ YN0013: │ 已向项目添加 3 个软件包（+ <大小> KiB）。
➤ YN0000: └ 已完成
➤ YN0000: ┌ 链接步骤
➤ YN0073: │ 因 mode=update-lockfile 而跳过
➤ YN0000: └ 已完成
➤ YN0000: · 已完成，但有警告，用时 <时长> <时长>
```

## `vp why testnpm2`

应显示软件包为何被安装

```
└─ command-why-yarn4@workspace:.
   └─ testnpm2@npm:1.0.1 (via npm:1.0.1)
```

## `vp explain testnpm2`

应与 explain 别名一起正常工作

```
└─ command-why-yarn4@workspace:.
   └─ testnpm2@npm:1.0.1 (via npm:1.0.1)
```

## `vp why test-vite-plus-package`

应显示为何安装了开发依赖包

```
└─ command-why-yarn4@workspace:.
   └─ test-vite-plus-package@npm:1.0.0 (via npm:1.0.0)
```

## `vp why testnpm2 -r`

应支持 yarn@2+ 中的递归查询

```
└─ command-why-yarn4@workspace:.
   └─ testnpm2@npm:1.0.1 (via npm:1.0.1)
```

## `vp why testnpm2 test-vite-plus-package`

应警告存在多个包，并使用第一个包

```
警告：yarn 一次只支持检查一个包，正在使用第一个包
└─ command-why-yarn4@workspace:.
   └─ testnpm2@npm:1.0.1 (via npm:1.0.1)
```

## `vp why testnpm2 --json`

应警告 `--json` 不受 yarn 支持

```
warn: yarn does not support --json.
└─ command-why-yarn4@workspace:.
   └─ testnpm2@npm:1.0.1 (via npm:1.0.1)
```

## `vp why testnpm2 --long`

应警告 yarn 不支持 --long

```
warn: yarn does not support --long.
└─ command-why-yarn4@workspace:.
   └─ testnpm2@npm:1.0.1 (via npm:1.0.1)
```

## `vp why testnpm2 --parseable`

应警告 `--parseable` 不受 yarn 支持

```text
warn: yarn does not support --parseable.
└─ command-why-yarn4@workspace:.
   └─ testnpm2@npm:1.0.1 (via npm:1.0.1)
```

## `vp why testnpm2 -P`

应警告 `--prod` 不受 yarn 支持

```
warn: yarn does not support --prod.
└─ command-why-yarn4@workspace:.
   └─ testnpm2@npm:1.0.1 (via npm:1.0.1)
```

## `vp why testnpm2 --find-by customFinder`

应警告 `--find-by` 不受 yarn 支持

```
warn: yarn does not support --find-by.
└─ command-why-yarn4@workspace:.
   └─ testnpm2@npm:1.0.1 (via npm:1.0.1)
```

## `vp why testnpm2 --exclude-peers`

应通过移除 `--peers` 标志来排除对等依赖

```
└─ command-why-yarn4@workspace:.
   └─ testnpm2@npm:1.0.1 (via npm:1.0.1)
```
