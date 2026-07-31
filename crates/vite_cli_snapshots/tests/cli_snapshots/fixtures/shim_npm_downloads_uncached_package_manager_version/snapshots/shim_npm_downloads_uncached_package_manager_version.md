# shim_npm 下载未缓存的包管理器版本

## `vpt write-file .node-version '22.11.0
'`

固定项目的 Node.js 版本


## `vpt rm -rf $VP_HOME/js_runtime/node/22.11.0`

确保固定版本的 Node.js 未被缓存


## `vpt rm -rf $VP_HOME/package_manager/npm/10.5.0 $VP_HOME/package_manager/npm/10.5.0.lock`

确保固定版本的 npm 未被缓存


## `vpt stat-file $VP_HOME/js_runtime/node/22.11.0 --assert missing`

固定版本的 Node.js@22.11.0 未缓存

```
<home>/.vite-plus/js_runtime/node/<version>: 缺失
```

## `vpt stat-file $VP_HOME/package_manager/npm/10.5.0 --assert missing`

固定版本的 npm@10.5.0 未缓存

```
<home>/.vite-plus/package_manager/npm/<version>: missing
```

## `node check-npm-version.mjs 10.5.0 'npm shim auto-downloaded Node.js and packageManager on first invocation'`

```
npm shim 在首次调用时自动下载了 Node.js 和 packageManager
```

## `vpt stat-file $VP_HOME/js_runtime/node/22.11.0/bin/node --assert file`

固定版本的 Node.js@22.11.0 现已缓存

```
<home>/.vite-plus/js_runtime/node/<version>/bin/node: file
```

## `vpt stat-file $VP_HOME/package_manager/npm/10.5.0/npm/bin/npm --assert file`

固定版本的 npm@10.5.0 现已缓存

```
<home>/.vite-plus/package_manager/npm/<version>/npm/bin/npm: file
```

## `node check-npm-version.mjs 10.5.0 'subsequent invocations reuse the cached version'`

```
subsequent invocations reuse the cached version
```
