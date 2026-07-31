# 为什么在工作区中使用 pnpm10

## `vp install`

```
VITE+ - Web 的统一工具链

范围：所有 3 个工作区项目

依赖：
 testnpm2 1.0.0（可用 1.0.1）

已完成，用时 <duration>，使用 pnpm <version>
```

## `vp why testnpm2 -w`

应检查工作区根目录中的原因

```
Legend: production dependency, optional only, dev only

command-why-pnpm10-with-workspace@1.0.0 <workspace>

dependencies:
testnpm2 1.0.0
```

## `vp why testnpm2 --filter app`

应检查特定软件包中的依赖原因

```
Legend: production dependency, optional only, dev only

app <workspace>/packages/app

dependencies:
@vite-plus-test/utils link:../utils
└── testnpm2 1.0.0
testnpm2 1.0.0
```

## `vp why test-vite-plus-package -D --filter app`

应检查 app 中的开发依赖

```
Legend: production dependency, optional only, dev only

app <workspace>/packages/app

devDependencies:
test-vite-plus-package 1.0.0
```

## `vp why testnpm2 --filter *`

应检查所有包中为何会依赖该包

```
Legend: production dependency, optional only, dev only

command-why-pnpm10-with-workspace@1.0.0 <workspace>

dependencies:
testnpm2 1.0.0

app <workspace>/packages/app

dependencies:
@vite-plus-test/utils link:../utils
└── testnpm2 1.0.0
testnpm2 1.0.0

@vite-plus-test/utils <workspace>/packages/utils

dependencies:
testnpm2 1.0.0
```

## `vp why testnpm2 -r`

应检查递归依赖原因

```
Legend: production dependency, optional only, dev only

command-why-pnpm10-with-workspace@1.0.0 <workspace>

dependencies:
testnpm2 1.0.0

app <workspace>/packages/app

dependencies:
@vite-plus-test/utils link:../utils
└── testnpm2 1.0.0
testnpm2 1.0.0

@vite-plus-test/utils <workspace>/packages/utils

dependencies:
testnpm2 1.0.0
```

## `vp why testnpm2 --filter app --json`

应支持带筛选条件的 JSON 输出

```
[
  {
    "name": "app",
    "path": "<workspace>/packages/app",
    "private": false,
    "dependencies": {
      "testnpm2": {
        "from": "testnpm2",
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.0.tgz",
        "path": "<workspace>/node_modules/.pnpm/testnpm2@1.0.0/node_modules/testnpm2"
      },
      "@vite-plus-test/utils": {
        "from": "@vite-plus-test/utils",
        "version": "link:../utils",
        "path": "<workspace>/packages/utils",
        "dependencies": {
          "testnpm2": {
            "from": "testnpm2",
            "version": "1.0.0",
            "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.0.tgz",
            "path": "<workspace>/node_modules/.pnpm/testnpm2@1.0.0/node_modules/testnpm2"
          }
        }
      }
    }
  }
]
```

## `vp why test-vite-plus-install --filter app --depth 1`

应支持通过 filter 限制深度

```
Legend: production dependency, optional only, dev only

app <workspace>/packages/app

dependencies:
test-vite-plus-install 1.0.0
```
