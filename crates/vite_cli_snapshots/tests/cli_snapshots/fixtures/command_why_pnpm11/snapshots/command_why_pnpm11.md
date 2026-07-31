# command_why_pnpm11

## `vp why --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp why [选项] <软件包>... [-- <透传参数>...]

显示安装某个软件包的原因

参数：
  <PACKAGES>...           要检查的软件包
  [PASS_THROUGH_ARGS]...  要传递给软件包管理器的其他参数

选项：
  --json                   以 JSON 格式输出
  --long                   显示扩展信息
  --parseable              显示可解析的输出
  -r, --recursive          在所有工作区中递归检查
  --filter <PATTERN>       筛选 monorepo 中的软件包
  -w, --workspace-root     在工作区根目录中检查
  -P, --prod               仅检查生产依赖
  -D, --dev                仅检查开发依赖
  --depth <DEPTH>          限制树的深度
  --no-optional            排除可选依赖
  --exclude-peers          排除对等依赖
  --find-by <FINDER_NAME>  使用 .pnpmfile.cjs 中定义的查找器函数
  -h, --help               显示帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp install`

应该先安装软件包

```
VITE+ - The Unified Toolchain for the Web

dependencies:
 testnpm2 1.0.1

optionalDependencies:
 test-vite-plus-package-optional 1.0.0

devDependencies:
 test-vite-plus-package 1.0.0

Done in <duration> using pnpm <version>
```

## `vp why testnpm2`

应显示软件包为何被安装

```
testnpm2@1.0.1
└── command-why-pnpm11@1.0.0 (dependencies)

Found 1 version of testnpm2
```

## `vp explain testnpm2`

应与 explain 别名一起正常工作

```
testnpm2@1.0.1
└── command-why-pnpm11@1.0.0 (dependencies)

Found 1 version of testnpm2
```

## `vp why test-vite-plus-package`

应显示为何安装了 dev 包

```
test-vite-plus-package@1.0.0
└── command-why-pnpm11@1.0.0 (devDependencies)

Found 1 version of test-vite-plus-package
```

## `vp why testnpm2 test-vite-plus-package`

应支持多个包

```
test-vite-plus-package@1.0.0
└── command-why-pnpm11@1.0.0 (devDependencies)

testnpm2@1.0.1
└── command-why-pnpm11@1.0.0 (dependencies)

Found 1 version of test-vite-plus-package
Found 1 version of testnpm2
```

## `vp why testnpm2 --json`

应支持 JSON 输出

```
[
  {
    "name": "testnpm2",
    "version": "1.0.1",
    "path": "<workspace>/node_modules/.pnpm/testnpm2@1.0.1/node_modules/testnpm2",
    "dependents": [
      {
        "name": "command-why-pnpm11",
        "version": "1.0.0",
        "depField": "dependencies"
      }
    ]
  }
]
```

## `vp why testnpm2 --long`

应支持长输出

```
testnpm2@1.0.1
│ <workspace>/node_modules/.pnpm/testnpm2@1.0.1/node_modules/testnpm2
└── command-why-pnpm11@1.0.0 (依赖项)

找到 1 个版本的 testnpm2
```

## `vp why testnpm2 --parseable`

应支持可解析输出

```
command-why-pnpm11@1.0.0 > testnpm2@1.0.1
```

## `vp why testnpm2 -P`

应仅支持生产依赖

```
testnpm2@1.0.1
└── command-why-pnpm11@1.0.0 (dependencies)

Found 1 version of testnpm2
```

## `vp why test-vite-plus-package -D`

应仅支持开发依赖

```
test-vite-plus-package@1.0.0
└── command-why-pnpm11@1.0.0 (devDependencies)

Found 1 version of test-vite-plus-package
```

## `vp why testnpm2 --depth 1`

应支持深度限制

```
testnpm2@1.0.1
└── command-why-pnpm11@1.0.0 (dependencies)

Found 1 version of testnpm2
```

## `vp why test-vite-plus-package-optional --no-optional`

应排除可选依赖

```
```

## `vp why testnpm2 --find-by customFinder`

应支持 find-by 选项（pnpm 专用）

**退出代码：** 1

```
[ERR_PNPM_FINDER_NOT_FOUND] No finder with name customFinder is found
```

## `vp why testnpm2 -- --reporter=silent`

应支持传递参数

```
testnpm2@1.0.1
└── command-why-pnpm11@1.0.0 (dependencies)

Found 1 version of testnpm2
```
