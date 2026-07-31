# 使用工作区添加 pnpm9 的命令

## `vp add testnpm2 -D -w`

应将软件包添加到工作区根目录

```

devDependencies:
 testnpm2 ^1.0.1

已完成，用时 <duration>，使用 pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm9-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@9.15.9",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  }
}
```

## `vp add @vite-plus-test/utils --workspace`

应将 @vite-plus-test/utils 添加到工作区根目录

**退出代码：** 1

```
 ERR_PNPM_ADDING_TO_ROOT  Running this command will add the dependency to the workspace root, which might not be what you want - if you really meant it, make it explicit by running this command again with the -w flag (or --workspace-root). If you don't want to see this warning anymore, you may set the ignore-workspace-root-check setting to true.
```

*（跳过了 1 个步骤到下一个行边界：步骤失败）*

## `vp add testnpm2 test-vite-plus-install@1.0.0 --filter app`

应将软件包添加到 packages/app

```
.                                        |  WARN  `node_modules` is present. Lockfile only installation will make it out-of-date
.                                        |   +1 +

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-pnpm9-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@9.15.9",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  }
}
{
  "name": "app",
  "dependencies": {
    "test-vite-plus-install": "1.0.0",
    "testnpm2": "^1.0.1"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true
}
```

## `vp add @vite-plus-test/utils --workspace --filter app`

应将 @vite-plus-test/utils 添加到 packages/app

```
.                                        |  警告  已存在 `node_modules`。仅安装锁文件会使其过时

使用 pnpm <version> 在 <duration> 内完成
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-pnpm9-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@9.15.9",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  }
}
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "workspace:^",
    "test-vite-plus-install": "1.0.0",
    "testnpm2": "^1.0.1"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true
}
```

## `vp add -E testnpm2 test-vite-plus-install --filter *`

应将 testnpm2 test-vite-plus-install 添加到除工作区根目录外的所有软件包

```

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-pnpm9-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@9.15.9",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  }
}
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "workspace:^",
    "test-vite-plus-install": "1.0.0",
    "testnpm2": "^1.0.1"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "test-vite-plus-install": "1.0.0",
    "testnpm2": "^1.0.1"
  }
}
```

## `vp install test-vite-plus-package@1.0.0 --filter * --workspace-root`

应为 add 命令安装软件包别名

```
VITE+ - Web 的统一工具链
.                                        |   +1 +

已在 <duration> 内使用 pnpm <version> 完成
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json pnpm-workspace.yaml`

```
{
  "name": "command-add-pnpm9-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@9.15.9",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "test-vite-plus-package": "1.0.0"
  }
}
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "workspace:^",
    "test-vite-plus-install": "1.0.0",
    "test-vite-plus-package": "1.0.0",
    "testnpm2": "^1.0.1"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "test-vite-plus-install": "1.0.0",
    "test-vite-plus-package": "1.0.0",
    "testnpm2": "^1.0.1"
  }
}
packages:
  - packages/*
```

## `vp add --filter app test-vite-plus-package-optional --save-catalog-name v1`

应报错，因为 `save-catalog-name` 在 pnpm@9 中不受支持

**退出代码：** 1

```
 ERROR  Unknown option: 'save-catalog-name'
Did you mean 'save-optional'? Use "--config.unknown=value" to force an unknown option.
For help, run: pnpm help add
```

## `vp add --filter=./packages/utils test-vite-plus-package-optional -O --save-catalog v2`

因为 pnpm@9 不支持 save-catalog，所以应该报错

**退出代码：** 1

```
 ERROR  Unknown option: 'save-catalog-name'
Did you mean 'save-optional'? Use "--config.unknown=value" to force an unknown option.
For help, run: pnpm help add
```
