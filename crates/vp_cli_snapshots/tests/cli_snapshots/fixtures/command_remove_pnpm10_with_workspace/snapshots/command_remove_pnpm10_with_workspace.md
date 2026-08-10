# 使用工作区移除 pnpm10 的命令

## `vp add testnpm2 -D -w --filter=*`

准备软件包

```
.                                        |   +1 +

完成，用时 <duration>，使用 pnpm <version>
```

## `vp add test-vite-plus-install -w --filter=*`

```
.                                        |   +1 +

耗时 <duration>，使用 pnpm <version> 完成
```

## `vp add test-vite-plus-package-optional -O --filter=*`

```
.                                        |   +1 +

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-remove-pnpm10-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@10.18.0",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
{
  "name": "app",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true,
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
  }
}
```

## `vp remove testnpm2 -r`

应从所有工作区和根目录中移除软件包

```
范围：全部 3 个工作区项目
.                                        |   -1 -

已完成，用时 <duration>，使用 pnpm <version>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-remove-pnpm10-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@10.18.0",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
{
  "name": "app",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
  }
}
```

## `vp remove -O test-vite-plus-package-optional -r`

应从所有工作区中移除可选依赖包

```
范围：全部 3 个工作区项目
.                                        |   -1 -

已完成，用时 <duration>，使用 pnpm <version>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-remove-pnpm10-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@10.18.0",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
{
  "name": "app",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
```

## `vp remove test-vite-plus-install --filter=app`

应通过 filter=app 移除软件包

```
.                                        |  警告  存在 `node_modules`。仅安装锁文件将使其过期

已完成，耗时 <duration>，使用 pnpm <version>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-remove-pnpm10-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@10.18.0",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
{
  "name": "app"
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
```

## `vp remove test-vite-plus-install --filter=*`

应通过 filter=* 移除软件包

```
Scope: all 3 workspace projects
.                                        |   -1 -

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-remove-pnpm10-with-workspace",
  "version": "1.0.0",
  "packageManager": "pnpm@10.18.0"
}
{
  "name": "app"
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true
}
```
