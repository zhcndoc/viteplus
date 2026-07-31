# command_list_pnpm11

## `vp install`

应首先安装软件包

```
VITE+ - Web 的统一工具链

依赖项：
 test-vite-plus-package-optional 1.0.0
 testnpm2 1.0.1

开发依赖项：
 test-vite-plus-package 1.0.0

使用 pnpm <version> 在 <duration> 内完成
```

## `vp pm list --help`

应显示帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp pm list [选项] [模式] [-- <传递参数>...]

列出已安装的软件包

参数：
  [模式]                  用于筛选的软件包模式
  [传递参数]...            附加参数

选项：
  --depth <深度>           依赖树的最大深度
  --json                   以 JSON 格式输出
  --long                   显示扩展信息
  --parseable              可解析的输出格式
  -P, --prod               仅显示生产依赖
  -D, --dev                仅显示开发依赖
  --no-optional            排除可选依赖
  --exclude-peers          排除对等依赖
  --only-projects          仅显示项目软件包
  --find-by <查找器名称>   使用查找器函数
  -r, --recursive          列出所有工作区中的软件包
  --filter <模式>          筛选 monorepo 中的软件包
  -g, --global             列出全局软件包
  -h, --help               显示帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp pm list`

应列出已安装的软件包

```
图例：生产依赖项，仅可选依赖项，仅开发依赖项

command-list-pnpm11@1.0.0 <工作区>
│
│   依赖项：
├── test-vite-plus-package-optional@1.0.0
├── testnpm2@1.0.1
│
│   开发依赖项：
└── test-vite-plus-package@1.0.0

3 个软件包
```

## `vp pm list testnpm2`

应列出指定的软件包

```
Legend: production dependency, optional only, dev only

command-list-pnpm11@1.0.0 <workspace>
│
│   dependencies:
└── testnpm2@1.0.1

1 package
```

## `vp pm list --depth 0`

应列出具有深度限制的软件包

```
Legend: production dependency, optional only, dev only

command-list-pnpm11@1.0.0 <workspace>
│
│   dependencies:
├── test-vite-plus-package-optional@1.0.0
├── testnpm2@1.0.1
│
│   devDependencies:
└── test-vite-plus-package@1.0.0

3 packages
```

## `vp pm list --json`

应以 JSON 格式列出软件包

```
[
  {
    "name": "command-list-pnpm11",
    "version": "1.0.0",
    "path": "<workspace>",
    "private": false,
    "dependencies": {
      "test-vite-plus-package-optional": {
        "from": "test-vite-plus-package-optional",
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/test-vite-plus-package-optional/-/test-vite-plus-package-optional-1.0.0.tgz",
        "path": "<workspace>/node_modules/.pnpm/test-vite-plus-package-optional@1.0.0/node_modules/test-vite-plus-package-optional"
      },
      "testnpm2": {
        "from": "testnpm2",
        "version": "1.0.1",
        "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
        "path": "<workspace>/node_modules/.pnpm/testnpm2@1.0.1/node_modules/testnpm2"
      }
    },
    "devDependencies": {
      "test-vite-plus-package": {
        "from": "test-vite-plus-package",
        "version": "1.0.0",
        "resolved": "https://registry.npmjs.org/test-vite-plus-package/-/test-vite-plus-package-1.0.0.tgz",
        "path": "<workspace>/node_modules/.pnpm/test-vite-plus-package@1.0.0/node_modules/test-vite-plus-package"
      }
    }
  }
]
```

## `vp pm list --long`

应列出包含扩展信息的软件包

```
图例：生产依赖、仅可选依赖、仅开发依赖

command-list-pnpm11@1.0.0 <workspace>
│
│   依赖：
├── test-vite-plus-package-optional@1.0.0
│   仅用于 snap-test
│   <workspace>/node_modules/.pnpm/test-vite-plus-package-optional@1.0.0/node_modules/test-vite-plus-package-optional
├── testnpm2@1.0.1
│   <workspace>/node_modules/.pnpm/testnpm2@1.0.1/node_modules/testnpm2
│
│   开发依赖：
└── test-vite-plus-package@1.0.0
    仅用于 snap-test
    <workspace>/node_modules/.pnpm/test-vite-plus-package@1.0.0/node_modules/test-vite-plus-package

3 个软件包
```

## `vp pm list --parseable`

应以可解析格式列出软件包

```
<workspace>
<workspace>/node_modules/.pnpm/test-vite-plus-package@1.0.0/node_modules/test-vite-plus-package
<workspace>/node_modules/.pnpm/test-vite-plus-package-optional@1.0.0/node_modules/test-vite-plus-package-optional
<workspace>/node_modules/.pnpm/testnpm2@1.0.1/node_modules/testnpm2
```

## `vp pm list --prod`

应仅列出生产依赖

```
Legend: production dependency, optional only, dev only

command-list-pnpm11@1.0.0 <workspace>
│
│   dependencies:
├── test-vite-plus-package-optional@1.0.0
└── testnpm2@1.0.1

2 packages
```

## `vp pm list --dev`

应仅列出开发依赖

```
图例：生产依赖、仅可选依赖、仅开发依赖

command-list-pnpm11@1.0.0 <工作区>
│
│   开发依赖：
└── test-vite-plus-package@1.0.0

1 个包
```

## `vp pm list --no-optional`

应排除可选依赖

```
Legend: production dependency, optional only, dev only

command-list-pnpm11@1.0.0 <workspace>
│
│   dependencies:
├── test-vite-plus-package-optional@1.0.0
├── testnpm2@1.0.1
│
│   devDependencies:
└── test-vite-plus-package@1.0.0

3 packages
```

## `vp pm list --exclude-peers`

应排除对等依赖

```
Legend: production dependency, optional only, dev only

command-list-pnpm11@1.0.0 <workspace>
│
│   dependencies:
├── test-vite-plus-package-optional@1.0.0
├── testnpm2@1.0.1
│
│   devDependencies:
└── test-vite-plus-package@1.0.0

3 packages
```

## `vp pm list --only-projects`

应仅列出工作区项目（pnpm 专用）

```
```

## `vp pm list --find-by customFinder`

应使用自定义查找器（pnpm 特有）

**退出代码：** 1

```
[ERR_PNPM_FINDER_NOT_FOUND] No finder with name customFinder is found
```

## `vp pm list --recursive`

应递归列出工作区中的软件包

```
Legend: production dependency, optional only, dev only

command-list-pnpm11@1.0.0 <workspace>
│
│   dependencies:
├── test-vite-plus-package-optional@1.0.0
├── testnpm2@1.0.1
│
│   devDependencies:
└── test-vite-plus-package@1.0.0

3 packages
```

## `vp pm list -- --loglevel=warn`

应该支持透传参数

```
Legend: production dependency, optional only, dev only

command-list-pnpm11@1.0.0 <workspace>
│
│   dependencies:
├── test-vite-plus-package-optional@1.0.0
├── testnpm2@1.0.1
│
│   devDependencies:
└── test-vite-plus-package@1.0.0

3 packages
```
