# pnpm 10 工作区中的过时命令

## `vp install`

```
VITE+ - Web 的统一工具链

范围：全部 3 个工作区项目

依赖：
 testnpm2 1.0.0（可用 1.0.1）

使用 pnpm <version> 在 <duration> 内完成
```

## `vp outdated testnpm2 -w`

应在工作区根目录显示过时依赖

**退出代码：** 1

```
┌──────────┬─────────┬────────┐
│ Package  │ Current │ Latest │
├──────────┼─────────┼────────┤
│ testnpm2 │ 1.0.0   │ 1.0.1  │
└──────────┴─────────┴────────┘
```

## `vp outdated testnpm2 --filter app`

应显示指定软件包中的过时依赖

**退出代码：** 1

```
┌──────────┬─────────┬────────┬────────────┐
│ 软件包   │ 当前    │ 最新   │ 依赖方     │
├──────────┼─────────┼────────┼────────────┤
│ testnpm2 │ 1.0.0   │ 1.0.1  │ app        │
└──────────┴─────────┴────────┴────────────┘
```

## `vp outdated -D --filter app`

应列出 app 中已过时的开发依赖项

```
```

## `vp outdated --filter * --format json`

应显示所有包中的过时依赖

**退出代码：** 1

```
{
  "testnpm2": {
    "current": "1.0.0",
    "latest": "1.0.1",
    "wanted": "1.0.0",
    "isDeprecated": false,
    "dependencyType": "dependencies",
    "dependentPackages": [
      {
        "name": "command-outdated-pnpm10-with-workspace",
        "location": "<workspace>"
      },
      {
        "name": "app",
        "location": "<workspace>/packages/app"
      },
      {
        "name": "@vite-plus-test/utils",
        "location": "<workspace>/packages/utils"
      }
    ]
  },
  "test-vite-plus-other-optional": {
    "current": "1.0.0",
    "latest": "1.1.0",
    "wanted": "1.0.0",
    "isDeprecated": false,
    "dependencyType": "optionalDependencies",
    "dependentPackages": [
      {
        "name": "app",
        "location": "<workspace>/packages/app"
      }
    ]
  }
}
```

## `vp outdated -r`

应递归检查过时的依赖

**退出代码：** 1

```
┌──────────────────────────────────────────┬─────────┬────────┬────────────────────────────────┐
│ Package                                  │ Current │ Latest │ Dependents                     │
├──────────────────────────────────────────┼─────────┼────────┼────────────────────────────────┤
│ testnpm2                                 │ 1.0.0   │ 1.0.1  │ @vite-plus-test/utils, app,    │
│                                          │         │        │ command-outdated-pnpm10-with-  │
│                                          │         │        │ workspace                      │
├──────────────────────────────────────────┼─────────┼────────┼────────────────────────────────┤
│ test-vite-plus-other-optional (optional) │ 1.0.0   │ 1.1.0  │ app                            │
└──────────────────────────────────────────┴─────────┴────────┴────────────────────────────────┘
```
