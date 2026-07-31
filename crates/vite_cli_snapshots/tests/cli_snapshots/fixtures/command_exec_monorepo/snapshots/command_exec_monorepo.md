# command_exec_monorepo

## `vp exec -r -- node -e console.log(process.env.VP_PACKAGE_NAME)`

带环境变量的递归执行

```
lib-c$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-c
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
app-b$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-b
exec-monorepo$ node -e console.log(process.env.VP_PACKAGE_NAME)
exec-monorepo
```

## `vp exec --filter app-* -- node -e console.log(process.env.VP_PACKAGE_NAME)`

glob 筛选

```
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
app-b$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-b
```

## `vp exec --filter lib-c -- echo lib-only`

精确名称过滤器

```
lib-only
```

## `vp exec --filter app-a... -- node -e console.log(process.env.VP_PACKAGE_NAME)`

带依赖项的筛选

```
lib-c$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-c
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
```

## `vp exec --filter app-a^... -- node -e console.log(process.env.VP_PACKAGE_NAME)`

仅依赖项，不包括自身

```
lib-c
```

## `vp exec -r --parallel -- node -e console.log(process.env.VP_PACKAGE_NAME)`

并行模式

```
lib-c$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-c
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
app-b$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-b
exec-monorepo$ node -e console.log(process.env.VP_PACKAGE_NAME)
exec-monorepo
```

## `vp exec -r -c 'echo shell-$VP_PACKAGE_NAME'`

递归 + shell 模式（vp 自己的 shell 会展开变量）

```
lib-c$ echo shell-$VP_PACKAGE_NAME
shell-lib-c
app-a$ echo shell-$VP_PACKAGE_NAME
shell-app-a
app-b$ echo shell-$VP_PACKAGE_NAME
shell-app-b
exec-monorepo$ echo shell-$VP_PACKAGE_NAME
shell-exec-monorepo
```

## `vp exec --filter ./packages/app-a -- node -e console.log(process.env.VP_PACKAGE_NAME)`

路径过滤器

```
app-a
```

## `vp exec --filter {./packages/app-a} -- node -e console.log(process.env.VP_PACKAGE_NAME)`

带大括号的路径过滤器

```
app-a
```

## `vp exec --filter {./packages/app-a}... -- node -e console.log(process.env.VP_PACKAGE_NAME)`

带依赖的花括号路径过滤器

```
lib-c$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-c
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
```

## `vp exec -r --reverse -- node -e console.log(process.env.VP_PACKAGE_NAME)`

逆序

```
exec-monorepo$ node -e console.log(process.env.VP_PACKAGE_NAME)
exec-monorepo
app-b$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-b
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
lib-c$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-c
```

## `vp exec -r --resume-from lib-c -- node -e console.log(process.env.VP_PACKAGE_NAME)`

从以下位置恢复

```
lib-c$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-c
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
app-b$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-b
exec-monorepo$ node -e console.log(process.env.VP_PACKAGE_NAME)
exec-monorepo
```

## `vp exec --filter !app-b -- node -e console.log(process.env.VP_PACKAGE_NAME)`

仅排除过滤器

```
lib-c$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-c
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
exec-monorepo$ node -e console.log(process.env.VP_PACKAGE_NAME)
exec-monorepo
```

## `vp exec --filter !app-a --filter !app-b -- node -e console.log(process.env.VP_PACKAGE_NAME)`

多个仅排除筛选器

```
exec-monorepo$ node -e console.log(process.env.VP_PACKAGE_NAME)
exec-monorepo
lib-c$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-c
```

## `vp exec --filter app-a --filter lib-c -- node -e console.log(process.env.VP_PACKAGE_NAME)`

多个包含过滤器（并集）

```
lib-c$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-c
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
```

## `vp exec --filter app-* --filter !app-b -- node -e console.log(process.env.VP_PACKAGE_NAME)`

混合使用包含和排除筛选器

```
app-a
```

## `vp exec --filter !no-such-pkg -- node -e console.log(process.env.VP_PACKAGE_NAME)`

排除不存在的软件包会返回全部软件包

```
lib-c$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-c
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
exec-monorepo$ node -e console.log(process.env.VP_PACKAGE_NAME)
exec-monorepo
app-b$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-b
```

## `vp exec --filter=app-* -- node -e console.log(process.env.VP_PACKAGE_NAME)`

等号形式的筛选器

```
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
app-b$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-b
```

## `vp exec --filter * -- node -e console.log(process.env.VP_PACKAGE_NAME)`

glob 星号包含根目录

```
lib-c$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-c
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
exec-monorepo$ node -e console.log(process.env.VP_PACKAGE_NAME)
exec-monorepo
app-b$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-b
```

## `vp exec -w -- node -e console.log(process.env.VP_PACKAGE_NAME)`

仅限工作区根目录

```
exec-monorepo
```

## `vp exec -r --report-summary -- node -e console.log(process.env.VP_PACKAGE_NAME)`

报告摘要

```
lib-c$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-c
app-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-a
app-b$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-b
exec-monorepo$ node -e console.log(process.env.VP_PACKAGE_NAME)
exec-monorepo
```

## `node -e 'const r=JSON.parse(require('\''fs'\'').readFileSync('\''vp-exec-summary.json'\'','\''utf8'\''));const s=r.executionStatus;for(const[k,v]of Object.entries(s)){console.log(k+'\'': '\''+v.status+'\'' '\''+(typeof v.duration==='\''number'\''?'\''has_duration'\'':'\''no_duration'\''))}'`

验证摘要文件

```
app-a: passed has_duration
app-b: passed has_duration
exec-monorepo: passed has_duration
lib-c: passed has_duration
```
