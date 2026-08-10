# 命令列表_pnpm11_与工作区

## `vp install`

应先安装软件包

```
VITE+ - Web 的统一工具链

范围：全部 3 个工作区项目

使用 pnpm <version> 在 <duration> 内完成
```

## `vp pm list`

应列出当前工作区根依赖

```
Legend: production dependency, optional only, dev only

app@1.0.0 <workspace>/packages/app
│
│   dependencies:
├── @vite-plus-test/utils@link:../utils
└── test-vite-plus-package-optional@1.0.0

@vite-plus-test/utils@1.0.0 <workspace>/packages/utils (PRIVATE)
│
│   dependencies:
└── testnpm2@1.0.1

3 packages in 3 projects
```

## `vp pm list --recursive`

应递归列出工作区中的所有包

```
图例：生产依赖、仅可选依赖、仅开发依赖

app@1.0.0 <workspace>/packages/app
│
│   依赖：
├── @vite-plus-test/utils@link:../utils
└── test-vite-plus-package-optional@1.0.0

@vite-plus-test/utils@1.0.0 <workspace>/packages/utils（私有）
│
│   依赖：
└── testnpm2@1.0.1

3 个包，位于 3 个项目中
```

## `vp pm list --filter app`

应列出特定的工作区软件包（使用 `--filter app list`）

```
图例：生产依赖项、仅可选依赖项、仅开发依赖项

app@1.0.0 <workspace>/packages/app
│
│   依赖项：
├── @vite-plus-test/utils@link:../utils
└── test-vite-plus-package-optional@1.0.0

2 个软件包
```

## `vp pm list --filter app --filter @vite-plus-test/utils`

应列出多个工作区包

```
Legend: production dependency, optional only, dev only

app@1.0.0 <workspace>/packages/app
│
│   dependencies:
├── @vite-plus-test/utils@link:../utils
└── test-vite-plus-package-optional@1.0.0

@vite-plus-test/utils@1.0.0 <workspace>/packages/utils (PRIVATE)
│
│   dependencies:
└── testnpm2@1.0.1

3 packages in 2 projects
```

## `vp pm list --recursive --json`

应以 JSON 格式列出工作区中的所有软件包

```
[
  {
    "name": "command-list-pnpm11-with-workspace",
    "version": "1.0.0",
    "path": "<workspace>",
    "private": false
  },
  {
    "name": "app",
    "version": "1.0.0",
    "path": "<workspace>/packages/app",
    "private": false,
    "dependencies": {
      "@vite-plus-test/utils": {
        "from": "@vite-plus-test/utils",
        "version": "link:../utils",
        "path": "<workspace>/packages/utils"
      },
      "test-vite-plus-package-optional": {
        "from": "test-vite-plus-package-optional",
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/test-vite-plus-package-optional/-/test-vite-plus-package-optional-1.0.0.tgz",
        "path": "<workspace>/node_modules/.pnpm/test-vite-plus-package-optional@1.0.0/node_modules/test-vite-plus-package-optional"
      }
    }
  },
  {
    "name": "@vite-plus-test/utils",
    "version": "1.0.0",
    "path": "<workspace>/packages/utils",
    "private": true,
    "dependencies": {
      "testnpm2": {
        "from": "testnpm2",
        "version": "1.0.1",
        "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
        "path": "<workspace>/node_modules/.pnpm/testnpm2@1.0.1/node_modules/testnpm2"
      }
    }
  }
]
```

## `vp pm list --recursive --depth 0`

应列出具有深度限制的工作区软件包

```
图例：生产依赖、仅可选依赖、仅开发依赖

app@1.0.0 <workspace>/packages/app
│
│   依赖：
├── @vite-plus-test/utils@link:../utils
└── test-vite-plus-package-optional@1.0.0

@vite-plus-test/utils@1.0.0 <workspace>/packages/utils（私有）
│
│   依赖：
└── testnpm2@1.0.1

3 个软件包，位于 3 个项目中
```

## `vp pm list --recursive --only-projects`

应仅列出工作区项目（pnpm 专用）

```
图例：生产依赖、仅可选依赖、仅开发依赖

app@1.0.0 <workspace>/packages/app
│
│   依赖项：
└── @vite-plus-test/utils@link:../utils

3 个项目中有 1 个包
```

## `vp pm list --recursive --exclude-peers`

应在工作区中排除对等依赖

```
Legend: production dependency, optional only, dev only

app@1.0.0 <workspace>/packages/app
│
│   dependencies:
├── @vite-plus-test/utils@link:../utils
└── test-vite-plus-package-optional@1.0.0

@vite-plus-test/utils@1.0.0 <workspace>/packages/utils (PRIVATE)
│
│   dependencies:
└── testnpm2@1.0.1

3 packages in 3 projects
```

## `vp pm list --recursive --prod`

应列出工作区中的生产依赖

```
图例：生产依赖、仅可选依赖、仅开发依赖

app@1.0.0 <workspace>/packages/app
│
│   依赖：
├── @vite-plus-test/utils@link:../utils
└── test-vite-plus-package-optional@1.0.0

@vite-plus-test/utils@1.0.0 <workspace>/packages/utils（私有）
│
│   依赖：
└── testnpm2@1.0.1

3 个包，位于 3 个项目中
```
