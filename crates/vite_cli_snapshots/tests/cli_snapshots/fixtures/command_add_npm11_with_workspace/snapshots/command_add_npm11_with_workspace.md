# command_add_npm11_with_workspace

## `vp add testnpm2 -D -w -- --no-audit`

应将软件包添加到工作区根目录

```

added 3 packages in <duration>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-npm11-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "npm@11.6.2",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  }
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

## `vp add @vite-plus-test/utils --workspace -- --no-audit`

应将 @vite-plus-test/utils 添加到工作区根目录

```

已是最新状态，用时 <duration>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-npm11-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "npm@11.6.2",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "^1.0.0"
  }
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

## `vp add testnpm2 test-vite-plus-install@1.0.0 --filter app -- --no-audit`

应将软件包添加到 packages/app

```

已在 <duration> 内添加 1 个软件包
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-npm11-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "npm@11.6.2",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "^1.0.0"
  }
}
{
  "name": "app",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0",
    "testnpm2": "^1.0.1"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true
}
```

## `vp add @vite-plus-test/utils --workspace --filter app -- --no-audit`

应将 @vite-plus-test/utils 添加到 packages/app

```

在 <duration> 内已是最新
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-npm11-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "npm@11.6.2",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "^1.0.0"
  }
}
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "^1.0.0",
    "test-vite-plus-install": "^1.0.0",
    "testnpm2": "^1.0.1"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true
}
```

## `vp add testnpm2 test-vite-plus-install@1.0.0 --filter * -- --no-audit`

应将 testnpm2 test-vite-plus-install 添加到除工作区根目录外的所有包中

```

在 <duration> 内已是最新
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-npm11-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "npm@11.6.2",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "^1.0.0"
  }
}
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "^1.0.0",
    "test-vite-plus-install": "^1.0.0",
    "testnpm2": "^1.0.1"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "test-vite-plus-install": "^1.0.0",
    "testnpm2": "^1.0.1"
  }
}
```

## `vp add -E testnpm2 test-vite-plus-install@1.0.0 --filter * --workspace-root -- --no-audit`

应将 testnpm2 test-vite-plus-install 添加到所有软件包，包括工作区根目录

```

已是最新状态，用时 <duration>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-npm11-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "npm@11.6.2",
  "devDependencies": {
    "testnpm2": "1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "^1.0.0",
    "test-vite-plus-install": "1.0.0"
  }
}
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "^1.0.0",
    "test-vite-plus-install": "1.0.0",
    "testnpm2": "1.0.1"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "test-vite-plus-install": "1.0.0",
    "testnpm2": "1.0.1"
  }
}
```

## `vp install test-vite-plus-package@1.0.0 --filter * --workspace-root -- --no-audit`

应为 `add` 命令安装软件包别名

```
VITE+ - Web 的统一工具链

已添加 1 个软件包，耗时 <duration>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-npm11-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "npm@11.6.2",
  "devDependencies": {
    "testnpm2": "1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "^1.0.0",
    "test-vite-plus-install": "1.0.0",
    "test-vite-plus-package": "^1.0.0"
  }
}
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "^1.0.0",
    "test-vite-plus-install": "1.0.0",
    "test-vite-plus-package": "^1.0.0",
    "testnpm2": "1.0.1"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "private": true,
  "dependencies": {
    "test-vite-plus-install": "1.0.0",
    "test-vite-plus-package": "^1.0.0",
    "testnpm2": "1.0.1"
  }
}
```
