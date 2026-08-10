# command_list_yarn1

## `vp install`

应该先安装软件包

```
VITE+ - Web 的统一工具链

yarn install <version>
警告 package.json：未设置许可证字段
信息 未找到锁文件。
警告 command-list-yarn1@1.0.0：未设置许可证字段
[1/4] 正在解析软件包...
[2/4] 正在获取软件包...
[3/4] 正在链接依赖...
[4/4] 正在构建全新软件包...

成功保存锁文件。

耗时 <duration>。
```

## `vp pm list`

应列出已安装的软件包

```
yarn list <version>
警告 package.json：没有 license 字段
警告 command-list-yarn1@1.0.0：没有 license 字段
├─ test-vite-plus-package@1.0.0
└─ testnpm2@1.0.1

已在 <duration> 内完成。
```

## `vp pm list testnpm2`

应列出指定的软件包

```
yarn list <version>
warning package.json: No license field
warning command-list-yarn1@1.0.0: No license field
warning Filtering by arguments is deprecated. Please use the pattern option instead.
└─ testnpm2@1.0.1

Done in <duration>.
```

## `vp pm list --depth 0`

应列出具有深度限制的软件包

```
yarn list <version>
warning package.json: No license field
warning command-list-yarn1@1.0.0: No license field
├─ test-vite-plus-package@1.0.0
└─ testnpm2@1.0.1

Done in <duration>.
```

## `vp pm list --json`

应以 JSON 格式列出软件包

```
{"type":"warning","data":"package.json: No license field"}
{"type":"warning","data":"command-list-yarn1@1.0.0: No license field"}
{"type":"activityStart","data":{"id":0}}
{"type":"activityTick","data":{"id":0,"name":"testnpm2@1.0.1"}}
{"type":"activityTick","data":{"id":0,"name":"test-vite-plus-package@1.0.0"}}
{"type":"activityEnd","data":{"id":0}}
{"type":"tree","data":{"type":"list","trees":[{"name":"testnpm2@1.0.1","children":[],"hint":null,"color":"bold","depth":0},{"name":"test-vite-plus-package@1.0.0","children":[],"hint":null,"color":"bold","depth":0}]}}
```

## `vp pm list --prod`

应显示警告，说明 yarn@1 不支持 --prod

```
warn: yarn does not support --prod.
yarn list <version>
警告 package.json：未设置许可证字段
警告 command-list-yarn1@1.0.0：未设置许可证字段
├─ test-vite-plus-package@1.0.0
└─ testnpm2@1.0.1

已完成，用时 <duration>。
```

## `vp pm list --dev`

应显示警告，说明 yarn@1 不支持 --dev

```
警告：yarn 不支持 --dev。
yarn list <version>
警告 package.json：没有许可证字段
警告 command-list-yarn1@1.0.0：没有许可证字段
├─ test-vite-plus-package@1.0.0
└─ testnpm2@1.0.1

已完成，耗时 <duration>。
```

## `vp pm list --no-optional`

应显示警告，说明 yarn@1 不支持 --no-optional

```
warn: yarn does not support --no-optional.
yarn list <version>
警告 package.json：没有许可证字段
警告 command-list-yarn1@1.0.0：没有许可证字段
├─ test-vite-plus-package@1.0.0
└─ testnpm2@1.0.1

在 <duration> 内完成。
```

## `vp pm list --exclude-peers`

应显示警告，说明 yarn@1 不支持 --exclude-peers

```
warn: yarn does not support --exclude-peers.
yarn list <version>
警告 package.json：没有许可证字段
警告 command-list-yarn1@1.0.0：没有许可证字段
├─ test-vite-plus-package@1.0.0
└─ testnpm2@1.0.1

已完成，用时 <duration>。
```

## `vp pm list --only-projects`

应显示警告，说明 yarn@1 不支持 --only-projects

```
warn: yarn does not support --only-projects.
yarn list <version>
warning package.json: No license field
warning command-list-yarn1@1.0.0: No license field
├─ test-vite-plus-package@1.0.0
└─ testnpm2@1.0.1

在 <时长> 内完成。
```

## `vp pm list --find-by customFinder`

应显示警告，说明 yarn@1 不支持 --find-by

```
警告：yarn 不支持 --find-by。
yarn list <version>
警告 package.json：未设置许可证字段
警告 command-list-yarn1@1.0.0：未设置许可证字段
├─ test-vite-plus-package@1.0.0
└─ testnpm2@1.0.1

在 <duration> 内完成。
```

## `vp pm list --recursive`

应显示警告，说明 yarn@1 不支持 --recursive

```
warn: yarn does not support --recursive.
yarn list <version>
警告 package.json：无许可证字段
警告 command-list-yarn1@1.0.0：无许可证字段
├─ test-vite-plus-package@1.0.0
└─ testnpm2@1.0.1

耗时 <duration>。
```

## `vp pm list --filter app`

应显示警告，说明 yarn@1 不支持 --filter

```
warn: yarn does not support --filter.
yarn list <version>
warning package.json: No license field
warning command-list-yarn1@1.0.0: No license field
├─ test-vite-plus-package@1.0.0
└─ testnpm2@1.0.1

Done in <duration>.
```

## `vp pm list -- --loglevel=warn`

应支持透传参数

```
yarn list <version>
warning package.json: No license field
warning command-list-yarn1@1.0.0: No license field
├─ test-vite-plus-package@1.0.0
└─ testnpm2@1.0.1

Done in <duration>.
```
