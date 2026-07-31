# env_node_child_process_npm

旧版案例通过 shell 命令替换，将 `$(npm --version)` 与 node 子进程的
`npm --version` 进行比较。这里没有 shell，但两个项目都以确定性方式固定了解析结果（node/ 固定运行时，因此其内置 npm 版本也随之固定；specific/ 固定了 devEngines.packageManager），因此快照本身断言了解析出的版本，而 print-path.js 断言子进程将 npm 解析为 vp shim。

## `cd node && node ../print-version.js`

子进程 npm 是固定运行时捆绑的 npm

```
10.8.2
```

## `cd node && node ../print-path.js`

子进程中的 npm 解析为 vp shim

```
<home>/.vite-plus/js_runtime/node/<version>/bin/npm
```

## `cd specific && node ../print-version.js`

child-process npm 是 devEngines.packageManager 的固定版本

```
11.17.0
```

## `cd specific && node ./print-package-json-pm-version.js`

该固定版本本身，用于与上面的步骤进行比较

```
11.17.0
```

## `cd specific && node ../print-path.js`

子进程中的 npm 解析为 vp shim

```
<home>/.vite-plus/package_manager/npm/<version>/npm/bin/npm
```
