# command_update_pnpm10_with_workspace

## `vp update testnpm2 --latest -w`

应在工作区根目录中更新

```

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json`

```
{
  "name": "command-update-pnpm10-with-workspace",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "^1.0.1"
  },
  "packageManager": "pnpm@10.18.0"
}
```

## `vp update testnpm2 --latest --filter app`

应在指定的软件包中进行更新

```
.                                        |  警告  存在 `node_modules`。仅安装锁文件会使其过时
.                                        |   +2 +

完成于 <duration>，使用 pnpm <version>
```

## `vpt print-file packages/app/package.json`

```
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "workspace:*",
    "test-vite-plus-install": "*",
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "*"
  }
}
```

## `vp up -D --filter app`

应更新 app 中的开发依赖

```
.                                        |  警告  存在 `node_modules`。仅安装锁文件将使其过时

已完成，用时 <duration>，使用 pnpm <version>
```

## `vpt print-file packages/app/package.json`

```
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "workspace:*",
    "test-vite-plus-install": "*",
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "^1.0.0"
  }
}
```

## `vp update --latest --filter *`

应更新所有包

```
Scope: all 3 workspace projects

Done in <duration> using pnpm <version>
```

## `vpt print-file packages/app/package.json packages/utils/package.json`

```
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "workspace:*",
    "test-vite-plus-install": "^1.0.0",
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "^1.0.0"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "^1.0.1"
  }
}
```

## `vp update -r --no-save`

应递归更新而不保存

```
Scope: all 3 workspace projects

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json packages/app/package.json`

```
{
  "name": "command-update-pnpm10-with-workspace",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "^1.0.1"
  },
  "packageManager": "pnpm@10.18.0"
}
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "workspace:*",
    "test-vite-plus-install": "^1.0.0",
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "^1.0.0"
  }
}
```

## `vp update --workspace --filter app @vite-plus-test/utils`

应更新工作区依赖

```
.                                        |  警告  `node_modules` 已存在。仅安装锁文件会使其过时

已完成，耗时 <duration>，使用 pnpm <version>
```

## `vpt print-file packages/app/package.json`

```
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "workspace:*",
    "test-vite-plus-install": "^1.0.0",
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "^1.0.0"
  }
}
```
