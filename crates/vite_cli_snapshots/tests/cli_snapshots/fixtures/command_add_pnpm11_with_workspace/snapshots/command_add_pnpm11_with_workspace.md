# 使用工作区添加 pnpm11

## `vp add testnpm2 -D -w`

应将软件包添加到工作区根目录

```

开发依赖：
 testnpm2 ^1.0.1

耗时 <duration>，使用 pnpm <version> 完成
```

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm11-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@11.0.6",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  }
}
```

## `vp add @vite-plus-test/utils --workspace`

应将 @vite-plus-test/utils 添加到工作区根目录

```

依赖：
 @vite-plus-test/utils workspace:*

已是最新版本

使用 pnpm <version> 在 <duration> 内完成
```

## `vpt print-file package.json`

```
{
  "name": "command-add-pnpm11-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@11.0.6",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "workspace:*"
  }
}
```

## `vp add testnpm2 test-vite-plus-install@1.0.0 --filter app`

应将软件包添加到 packages/app

```
.                                        |   +1 +

完成于 <duration>，使用 pnpm <version>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-pnpm11-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@11.0.6",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "workspace:*"
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

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-pnpm11-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@11.0.6",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "workspace:*"
  }
}
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "workspace:*",
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

应将 testnpm2 test-vite-plus-install 添加到除工作区根目录之外的所有软件包

```

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-pnpm11-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@11.0.6",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "workspace:*",
    "test-vite-plus-install": "1.0.0"
  }
}
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "workspace:*",
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

## `vp install test-vite-plus-package@1.0.0 --filter * --workspace-root --save-catalog`

应为添加命令安装软件包别名

```
VITE+ - 面向 Web 的统一工具链
.                                        |   +1 +

已完成，用时 <duration>，使用 pnpm <version>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json pnpm-workspace.yaml`

```
{
  "name": "command-add-pnpm11-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@11.0.6",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "workspace:*",
    "test-vite-plus-install": "1.0.0",
    "test-vite-plus-package": "catalog:"
  }
}
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "workspace:*",
    "test-vite-plus-install": "1.0.0",
    "test-vite-plus-package": "catalog:",
    "testnpm2": "^1.0.1"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "test-vite-plus-install": "1.0.0",
    "test-vite-plus-package": "catalog:",
    "testnpm2": "^1.0.1"
  }
}
packages:
  - packages/*
catalog:
  test-vite-plus-package: 1.0.0
```

## `vp add --filter app test-vite-plus-package-optional --save-catalog-name v1`

应使用 save-catalog-name 添加

```
.                                        |   +1 +

完成，用时 <duration>，使用 pnpm <version>
```

## `vpt print-file packages/app/package.json pnpm-workspace.yaml`

```
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "workspace:*",
    "test-vite-plus-install": "1.0.0",
    "test-vite-plus-package": "catalog:",
    "test-vite-plus-package-optional": "catalog:v1",
    "testnpm2": "^1.0.1"
  }
}
packages:
  - packages/*
catalog:
  test-vite-plus-package: 1.0.0
catalogs:
  v1:
    test-vite-plus-package-optional: ^1.0.0
```

## `vp add --filter=./packages/utils test-vite-plus-package-optional -O --save-catalog-name v2`

应使用 save-catalog-name 添加其他内容

```

在 <duration> 内完成，使用 pnpm <version>
```

## `vpt print-file packages/utils/package.json pnpm-workspace.yaml`

```
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "test-vite-plus-install": "1.0.0",
    "test-vite-plus-package": "catalog:",
    "testnpm2": "^1.0.1"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "catalog:v2"
  }
}
packages:
  - packages/*
catalog:
  test-vite-plus-package: 1.0.0
catalogs:
  v1:
    test-vite-plus-package-optional: ^1.0.0
  v2:
    test-vite-plus-package-optional: ^1.0.0
```
