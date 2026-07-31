# command_exec_monorepo_filter_v2

## `vp exec -F app-a -- echo hello`

-F 是 --filter 的短选项

```
hello
```

## `vp exec -F app-a -F lib-c -- echo hello`

-F 短标志可多次使用

```
lib-c$ echo hello
hello
app-a$ echo hello
hello
```

## `vp exec -F app-* -- echo hello`

-F 带 glob 的短标志

```
app-a$ echo hello
hello
app-b$ echo hello
hello
```

## `vp exec --filter 'app-a lib-c' -- node -e console.log(process.env.VP_PACKAGE_NAME)`

按空白分割：'a b' => 两个筛选器

```
lib-c$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-c
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
```

## `vp exec --filter 'app-a  app-b' -- node -e console.log(process.env.VP_PACKAGE_NAME)`

使用空白字符分割，包含多余空格

```
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
app-b$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-b
```

## `vp exec --filter nonexistent-pkg -- echo hello`

未匹配过滤器警告

```
warn: No packages matched the filter 'nonexistent-pkg'
warn: No packages matched the filter(s)
```

## `vp exec --fail-if-no-match --filter nonexistent-pkg -- echo hello`

未匹配筛选器严格错误

**退出代码：** 1

```
error: No packages matched the filter: nonexistent-pkg
```

## `vp exec --fail-if-no-match --filter nonexistent-pkg --filter app-a -- echo hello`

未匹配 + 已匹配的严格错误

**退出代码：** 1

```
error: No packages matched the filter: nonexistent-pkg
```

## `vp exec --fail-if-no-match --filter nope1 --filter nope2 -- echo hello`

多个筛选条件均未匹配时的严格错误

**退出代码：** 1

```
error: No packages matched the filter: nope1, nope2
```

## `vp exec --fail-if-no-match --filter app-a -- echo hello`

过滤器匹配时严格模式成功

```
hello
```

## `vp exec --filter nonexistent-pkg --filter app-a -- node -e console.log(process.env.VP_PACKAGE_NAME)`

未匹配 + 已匹配的筛选器

```
warn: No packages matched the filter 'nonexistent-pkg'
app-a
```

## `vp exec -w --filter app-a -- node -e console.log(process.env.VP_PACKAGE_NAME)`

-w + --filter 是叠加的（根目录 + 过滤后的目录）

```
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
exec-monorepo-filter-v2$ node -e console.log(process.env.VP_PACKAGE_NAME)
exec-monorepo-filter-v2
```

## `vp exec -w --filter app-* -- node -e console.log(process.env.VP_PACKAGE_NAME)`

-w + glob 过滤器为叠加关系

```
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
exec-monorepo-filter-v2$ node -e console.log(process.env.VP_PACKAGE_NAME)
exec-monorepo-filter-v2
app-b$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-b
```

## `vp exec -r --filter app-a -- echo hello`

-r 与 --filter 冲突错误

**退出代码：** 1

```
error: --filter and --recursive cannot be used together
```
