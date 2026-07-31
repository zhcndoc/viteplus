# 移除 npm10 的命令

## `vp remove testnpm2 -D -- --no-audit`

删除不存在的软件包时应通过

```

在 <duration> 内已是最新
```

## `vpt print-file package.json`

```
{
  "name": "command-remove-npm10",
  "version": "1.0.0",
  "packageManager": "npm@10.9.4"
}
```

## `vp add testnpm2 -- --no-audit`

应将软件包添加到依赖项中

```

added 1 package in <duration>
```

## `vp add -D test-vite-plus-install -- --no-audit`

```

已添加 1 个包，用时 <duration>
```

## `vp add -O test-vite-plus-package-optional -- --no-audit`

```

added 1 package in <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-remove-npm10",
  "version": "1.0.0",
  "packageManager": "npm@10.9.4",
  "dependencies": {
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-install": "^1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
  }
}
```

## `vp remove testnpm2 test-vite-plus-install -- --no-audit`

应从依赖项中移除软件包

```

已移除 2 个软件包，耗时 <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-remove-npm10",
  "version": "1.0.0",
  "packageManager": "npm@10.9.4",
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
  }
}
```

## `vp remove -D test-vite-plus-package-optional -- --loglevel=warn --no-audit`

支持忽略 `-O` 标志，并从可选依赖中移除软件包

```

removed 1 package in <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-remove-npm10",
  "version": "1.0.0",
  "packageManager": "npm@10.9.4"
}
```

## `vp remove -g --dry-run testnpm2`

支持在试运行模式下删除全局软件包

**退出代码：** 1

```
Failed to uninstall testnpm2: Package testnpm2 is not installed
```

*（跳过了 1 个步骤到下一个行边界：步骤失败）*
