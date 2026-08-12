# toolchain_full_local

本地 CLI 读取其 vite-plus package 中附带的 manifest。

## `vp toolchain`

```
Vite+ toolchain (local)

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
