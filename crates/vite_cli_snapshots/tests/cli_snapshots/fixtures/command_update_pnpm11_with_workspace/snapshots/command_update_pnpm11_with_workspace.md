# 使用工作区更新 pnpm11 的命令

## `vp update testnpm2 --latest -w`

应在工作区根目录中更新

```

使用 pnpm <version> 完成，耗时 <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-update-pnpm11-with-workspace",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "^1.0.1"
  },
  "packageManager": "pnpm@11.0.6"
}
```

## `vp update testnpm2 --latest --filter app`

应在指定的软件包中更新

```
.                                        |   +2 +

已完成，耗时 <duration>，使用 pnpm <version>
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

Done in <duration> using pnpm <version>
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

应该更新所有软件包

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

应递归更新但不保存

```
Scope: all 3 workspace projects

Done in <duration> using pnpm <version>
```

## `vpt print-file package.json packages/app/package.json`

```
{
  "name": "command-update-pnpm11-with-workspace",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "^1.0.1"
  },
  "packageManager": "pnpm@11.0.6"
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

已完成，用时 <duration>，使用 pnpm <version>
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
