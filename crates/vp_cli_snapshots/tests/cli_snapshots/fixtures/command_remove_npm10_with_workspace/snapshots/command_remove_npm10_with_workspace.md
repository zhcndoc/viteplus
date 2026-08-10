# command_remove_npm10_with_workspace

## `vp add testnpm2 -D -w --filter=* -- --no-audit`

准备软件包

```

已添加 3 个软件包，用时 <duration>
```

## `vp add test-vite-plus-install -w --filter=* -- --no-audit`

```

已在 <duration> 内添加 1 个包
```

## `vp add test-vite-plus-package-optional -O --filter=* -- --no-audit`

```

已添加 1 个软件包，用时 <duration>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-remove-npm10-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "npm@10.9.4",
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

## `vp remove testnpm2 -r -- --no-audit`

应从所有工作区和根目录中移除软件包

```

removed 1 package in <duration>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-remove-npm10-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "npm@10.9.4",
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

## `vp remove -O test-vite-plus-package-optional -r -- --no-audit`

应从所有工作区中移除可选依赖包

```

已移除 1 个包，耗时 <duration>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-remove-npm10-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "npm@10.9.4",
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

## `vp remove test-vite-plus-install --filter=app -- --no-audit`

应通过 filter=app 移除软件包

```

已是最新版本，耗时 <duration>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-remove-npm10-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "npm@10.9.4",
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

## `vp remove test-vite-plus-install --filter=* -- --no-audit`

应通过 filter=* 移除软件包

```

up to date in <duration>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-remove-npm10-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "npm@10.9.4",
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
  "private": true
}
```
