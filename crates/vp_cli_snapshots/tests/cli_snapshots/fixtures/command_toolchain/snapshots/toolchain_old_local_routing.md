# toolchain_old_local_routing

## `vpt mkdir -p node_modules/vite-plus/dist`


## `vpt write-file node_modules/vite-plus/package.json '{"name":"vite-plus","version":"0.1.0"}
'`


## `vpt write-file node_modules/vite-plus/dist/bin.js 'console.error("error: Command '\''toolchain'\'' not found");
process.exitCode = 2;
'`


## `vp toolchain`

全局二进制文件进行委托，并让旧的本地 CLI 拒绝该命令

**退出代码：** 2

```
error: Command 'toolchain' not found
```

## `vpt rm -f node_modules/vite-plus/dist/bin.js`


## `vpt write-file node_modules/vite-plus/dist/toolchain.json '{"schemaVersion":1,"nodes":[{"id":"vite-plus","name":"vite-plus","version":"0.1.0","kind":"package","delivery":["dependency"],"aliases":[]},{"id":"vite","name":"vite","version":"0.1.0","kind":"tool","delivery":["bundled"],"aliases":[]}],"edges":[{"from":"vite-plus","to":"vite","relationship":"bundles"}]}
'`


## `vp toolchain`

没有可运行本地 CLI 的软件包会使用全局 toolchain

```
Vite+ toolchain (global)

vite-plus@<version>
├── depends on @voidzero-dev/vite-plus-core@<version>
│   ├── bundles vite@<version>
│   │   └── uses rolldown@<version>
│   │       ├── compiles oxc@<version>
│   │       └── compiles oxc-resolver@<version>
│   ├── bundles rolldown@<version>
│   │   ├── compiles oxc@<version>
│   │   └── compiles oxc-resolver@<version>
│   └── bundles tsdown@<version>
├── depends on vitest@<version>
├── depends on oxlint@<version>
├── depends on oxlint-tsgolint@<version>
├── depends on oxfmt@<version>
└── compiles vite-task (built <build-time>, revision <revision>)
```

## `vp why vite`

当本地 CLI 无法运行时，提示会使用全局清单

```

Vite+ also provides vite@<version> through its toolchain.
Run `vp toolchain vite` to show these versions and relationships.
```

## `vp toolchain --global`

--global 会跳过旧的本地软件包

```
Vite+ toolchain (global)

vite-plus@<version>
├── depends on @voidzero-dev/vite-plus-core@<version>
│   ├── bundles vite@<version>
│   │   └── uses rolldown@<version>
│   │       ├── compiles oxc@<version>
│   │       └── compiles oxc-resolver@<version>
│   ├── bundles rolldown@<version>
│   │   ├── compiles oxc@<version>
│   │   └── compiles oxc-resolver@<version>
│   └── bundles tsdown@<version>
├── depends on vitest@<version>
├── depends on oxlint@<version>
├── depends on oxlint-tsgolint@<version>
├── depends on oxfmt@<version>
└── compiles vite-task (built <build-time>, revision <revision>)
```
