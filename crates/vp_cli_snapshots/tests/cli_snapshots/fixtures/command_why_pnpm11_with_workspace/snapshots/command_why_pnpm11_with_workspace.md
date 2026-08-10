# 命令：在工作区中使用 pnpm11 的原因

## `vp install`

```
VITE+ - 面向 Web 的统一工具链

范围：全部 3 个工作区项目

依赖项：
 testnpm2 1.0.0（1.0.1 可用）

使用 pnpm <version> 在 <duration> 内完成
```

## `vp why testnpm2 -w`

应检查工作区根目录中的依赖原因

```
testnpm2@1.0.0
└── command-why-pnpm11-with-workspace@1.0.0 (dependencies)

Found 1 version of testnpm2
```

## `vp why testnpm2 --filter app`

应检查特定软件包中的原因

```
testnpm2@1.0.0
├── @vite-plus-test/utils (dependencies)
└── app (dependencies)

Found 1 version of testnpm2
```

## `vp why test-vite-plus-package -D --filter app`

应检查 app 中的开发依赖

```
test-vite-plus-package@1.0.0
└── app (devDependencies)

Found 1 version of test-vite-plus-package
```

## `vp why testnpm2 --filter *`

应检查所有软件包中的原因

```
testnpm2@1.0.0
├── @vite-plus-test/utils (dependencies)
├── app (dependencies)
└── command-why-pnpm11-with-workspace@1.0.0 (dependencies)

Found 1 version of testnpm2
```

## `vp why testnpm2 -r`

应该检查递归依赖原因

```
testnpm2@1.0.0
├── @vite-plus-test/utils（依赖）
├── app（依赖）
└── command-why-pnpm11-with-workspace@1.0.0（依赖）

找到 1 个版本的 testnpm2
```

## `vp why testnpm2 --filter app --json`

应支持带筛选条件的 JSON 输出

```
[
  {
    "name": "testnpm2",
    "version": "1.0.0",
    "path": "<workspace>/node_modules/.pnpm/testnpm2@1.0.0/node_modules/testnpm2",
    "dependents": [
      {
        "name": "@vite-plus-test/utils",
        "version": "",
        "depField": "dependencies"
      },
      {
        "name": "app",
        "version": "",
        "depField": "dependencies"
      }
    ]
  }
]
```

## `vp why test-vite-plus-install --filter app --depth 1`

应支持对筛选结果进行深度限制

```
test-vite-plus-install@1.0.0
└── app (dependencies)

Found 1 version of test-vite-plus-install
```
