# toolchain_filters

## `vp toolchain vite`

工具过滤器保留其所有权和引擎链

```
Vite+ toolchain (local)

vite-plus@<version>
└── depends on @voidzero-dev/vite-plus-core@<version>
    └── bundles vite@<version>
        └── uses rolldown@<version>
            ├── compiles oxc@<version>
            └── compiles oxc-resolver@<version>
```

## `vp toolchain vite vitest`

多个过滤器返回稳定的并集

```
Vite+ toolchain (local)

vite-plus@<version>
├── depends on @voidzero-dev/vite-plus-core@<version>
│   └── bundles vite@<version>
│       └── uses rolldown@<version>
│           ├── compiles oxc@<version>
│           └── compiles oxc-resolver@<version>
└── depends on vitest@<version>
```

## `vp toolchain vite-plus-core tsgolint vite-task`

稳定的 ID 和声明的别名可以解析

```
Vite+ toolchain (local)

vite-plus@<version>
├── depends on @voidzero-dev/vite-plus-core@<version>
├── depends on oxlint-tsgolint@<version>
└── compiles vite-task (built <build-time>, revision <revision>)
```
