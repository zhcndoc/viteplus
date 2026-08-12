# toolchain_full_global

全局标志读取与全局二进制文件配对的 manifest。

## `vp toolchain --global`

```
Vite+ toolchain (global)

vite-plus@<version>
|-- depends on @voidzero-dev/vite-plus-core@<version>
|   |-- bundles vite@<version>
|   |   `-- uses rolldown@<version>
|   |       |-- compiles oxc@<version>
|   |       `-- compiles oxc-resolver@<version>
|   |-- bundles rolldown@<version>
|   |   |-- compiles oxc@<version>
|   |   `-- compiles oxc-resolver@<version>
|   `-- bundles tsdown@<version>
|-- depends on vitest@<version>
|-- depends on oxlint@<version>
|-- depends on oxlint-tsgolint@<version>
|-- depends on oxfmt@<version>
`-- compiles vite-task (built <build-time>, revision <revision>)
```
