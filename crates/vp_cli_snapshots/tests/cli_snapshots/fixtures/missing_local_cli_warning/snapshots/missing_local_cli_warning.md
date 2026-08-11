# 缺少本地 CLI 警告

## `vpt write-file node_modules/vite-plus/package.json '{"name":"vite-plus","version":"0.0.0"}'`


## `vp lint src/index.js`

未声明使用 vite-plus 的项目将获得迁移指导

```
VITE+ - Web 的统一工具链

警告：此项目未使用 vite-plus。了解如何迁移：https://viteplus.dev/guide/migrate
发现 0 个警告和 0 个错误。
使用 <n> 条规则和 <n> 个线程在 1 个文件上完成，耗时 <duration>。
```

## `vpt json-edit package.json devDependencies.vite-plus 0.0.0`


## `vp lint src/index.js`

声明了 vite-plus 但没有本地 CLI 的项目会获得安装指导

```
VITE+ - 面向 Web 的统一工具链

警告：未找到项目本地的 vite-plus 安装。运行 `vp install` 在 `<workspace>` 中安装依赖。
发现 0 个警告和 0 个错误。
使用 <n> 个规则和 <n> 个线程，在 1 个文件上完成，耗时 <duration>。
```

## `vpt rm package.json`


## `node assert-silent-fallback.mjs`

在项目外，全局回退保持静默

```
Global fallback remained silent.
```
