# 命令执行单体仓库顺序

## `vp exec -r -- node -e console.log(process.env.VP_PACKAGE_NAME)`

递归：拓扑顺序

```
lib-core$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-core
lib-utils$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-utils
lib-ui$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-ui
app-mobile$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-mobile
app-web$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-web
cycle-b$ node -e console.log(process.env.VP_PACKAGE_NAME)
cycle-b
cycle-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
cycle-a
cycle-e$ node -e console.log(process.env.VP_PACKAGE_NAME)
cycle-e
cycle-d$ node -e console.log(process.env.VP_PACKAGE_NAME)
cycle-d
cycle-c$ node -e console.log(process.env.VP_PACKAGE_NAME)
cycle-c
exec-monorepo-order$ node -e console.log(process.env.VP_PACKAGE_NAME)
exec-monorepo-order
```

## `vp exec --filter app-web... -- node -e console.log(process.env.VP_PACKAGE_NAME)`

筛选传递依赖

```
lib-core$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-core
lib-utils$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-utils
lib-ui$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-ui
app-web$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-web
```

## `vp exec --filter lib-ui... -- node -e console.log(process.env.VP_PACKAGE_NAME)`

筛选依赖关系图中间的包及其依赖项

```
lib-core$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-core
lib-utils$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-utils
lib-ui$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-ui
```

## `vp exec --filter ...lib-core -- node -e console.log(process.env.VP_PACKAGE_NAME)`

筛选依赖于 foundation 的包

```
lib-core$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-core
lib-utils$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-utils
lib-ui$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-ui
app-mobile$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-mobile
cycle-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
cycle-a
cycle-b$ node -e console.log(process.env.VP_PACKAGE_NAME)
cycle-b
app-web$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-web
```

## `vp exec -r --reverse -- node -e console.log(process.env.VP_PACKAGE_NAME)`

反向拓扑顺序

```
exec-monorepo-order$ node -e console.log(process.env.VP_PACKAGE_NAME)
exec-monorepo-order
cycle-c$ node -e console.log(process.env.VP_PACKAGE_NAME)
cycle-c
cycle-d$ node -e console.log(process.env.VP_PACKAGE_NAME)
cycle-d
cycle-e$ node -e console.log(process.env.VP_PACKAGE_NAME)
cycle-e
cycle-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
cycle-a
cycle-b$ node -e console.log(process.env.VP_PACKAGE_NAME)
cycle-b
app-web$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-web
app-mobile$ node -e console.log(process.env.VP_PACKAGE_NAME)
app-mobile
lib-ui$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-ui
lib-utils$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-utils
lib-core$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-core
```

## `vp exec --filter cycle-a... -- node -e console.log(process.env.VP_PACKAGE_NAME)`

具有非循环依赖的循环成员：cycle-a 之前的 lib-core

```
lib-core$ node -e console.log(process.env.VP_PACKAGE_NAME)
lib-core
cycle-a$ node -e console.log(process.env.VP_PACKAGE_NAME)
cycle-a
cycle-b$ node -e console.log(process.env.VP_PACKAGE_NAME)
cycle-b
```
