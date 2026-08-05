# 全局命令已过时

## `vp install -g testnpm2@1.0.0`

应准备一个固定版本的全局包


## `vp outdated definitely-not-installed-vite-plus-snap-pkg -g --format json`

应支持为空的全局 JSON 输出

```
{}
```

## `vp outdated testnpm2 -g --format json`

应报告一个没有可更新 wanted 版本的固定版本包

**退出代码：** 1

```
{
  "testnpm2": {
    "current": "1.0.0",
    "wanted": "1.0.0",
    "latest": "1.0.1",
    "dependent": "global",
    "location": "<home>/.vite-plus/packages/testnpm2/<uuid>/lib/node_modules/testnpm2"
  }
}
```

## `vp outdated testnpm2 -g --format list`

应在列表格式中将更新的最新版本作为提示显示

**退出代码：** 1

```
testnpm2 (global)
1.0.0 => 1.0.0 (latest: 1.0.1)
```

## `vp update -g`

不应将固定版本的软件包更新到最新版本

```
All global packages are up to date.
```

## `vpt json-edit $VP_HOME/packages/testnpm2.json versionSpec no-such-tag`

当记录的版本规格不再能解析时，应发出警告并跳过


## `vp update -g`

**退出代码：** 1

```
All global packages are up to date.
[1m[33mwarn:[39m[0m npm view failed for testnpm2@no-such-tag: npm error code E404; skipping
```

## `vpt json-edit $VP_HOME/packages/testnpm2.json versionSpec null`

一旦清除已记录的版本规格，应再次遵循最新版本


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
    "location": "<home>/.vite-plus/packages/testnpm2/<uuid>/lib/node_modules/testnpm2"
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

## `vpt json-edit $VP_HOME/packages/testnpm2.json versionSpec 1.0.0`

应使用 `--latest` 覆盖已记录的版本规格


## `vp update -g --latest`

```
[1m[94minfo:[39m[0m 正在使用 Node.js <version> 更新 1 个全局软件包
[32m✓[39m 已将 [1mtestnpm2[0m 更新至 [1m1.0.1[0m
```

## `vpt grep-file $VP_HOME/packages/testnpm2.json versionSpec`

在执行 --latest 后应清除记录的版本规范（grep-file 显示缺失）

**退出代码：** 1

```
<home>/.vite-plus/packages/testnpm2.json: missing "versionSpec"
pattern not found
```

## `vpt json-edit $VP_HOME/packages/testnpm2.json versionSpec 1.0.1`

即使不重新安装，也应使用 --latest 清除已记录的版本规范


## `vp update -g --latest`

```
所有全局软件包均已是最新版本。
```

## `vpt grep-file $VP_HOME/packages/testnpm2.json versionSpec`

应该已从最新的软件包中移除固定版本（grep-file 显示缺失）

**退出代码：** 1

```
<home>/.vite-plus/packages/testnpm2.json: missing "versionSpec"
pattern not found
```

## `vpt json-edit $VP_HOME/packages/testnpm2.json versionSpec 1.0.0`

应在不重新安装的情况下持久化明确的规格切换


## `vp update -g testnpm2@1.0.1`

```
所有全局软件包均已是最新版本。
```

## `vpt grep-file $VP_HOME/packages/testnpm2.json 'versionSpec": "1.0.1'`

```
<home>/.vite-plus/packages/testnpm2.json: found "versionSpec\": \"1.0.1"
```

## `vp update -g testnpm2@no-such-tag`

不应持久化无法解析的显式规范

**退出代码：** 1

```
All global packages are up to date.
[1m[33mwarn:[39m[0m npm view failed for testnpm2@no-such-tag: npm error code E404; skipping
```

## `vpt grep-file $VP_HOME/packages/testnpm2.json 'versionSpec": "1.0.1'`

```
<home>/.vite-plus/packages/testnpm2.json: found "versionSpec\": \"1.0.1"
```
