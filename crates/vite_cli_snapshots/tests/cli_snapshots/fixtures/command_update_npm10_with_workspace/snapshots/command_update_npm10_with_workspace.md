# 使用工作区更新 npm10 的命令

## `vp update testnpm2 -w -- --no-audit`

应在工作区根目录更新

```

已在 <duration> 内添加 5 个软件包
```

## `vpt print-file package.json`

```
{
  "name": "command-update-npm10-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "dependencies": {
    "testnpm2": "*"
  },
  "packageManager": "npm@10.9.4"
}
```

## `vp update testnpm2 --latest --filter app -- --no-audit`

应在指定包中更新

```
警告：npm 不支持 --latest 标志。仅在 semver 范围内更新。

已是最新版本，用时 <duration>
```

## `vpt print-file packages/app/package.json`

```
{
  "name": "app",
  "dependencies": {
    "test-vite-plus-install": "*",
    "testnpm2": "*"
  },
  "devDependencies": {
    "test-vite-plus-package": "*"
  }
}
```

## `vp up -D --filter app -- --no-audit`

应更新 app 中的开发依赖

```
npm warn workspaces app in filter set, but no workspace folder present

up to date in <duration>
```

## `vpt print-file packages/app/package.json`

```
{
  "name": "app",
  "dependencies": {
    "test-vite-plus-install": "*",
    "testnpm2": "*"
  },
  "devDependencies": {
    "test-vite-plus-package": "*"
  }
}
```

## `vp update --filter * -- --no-audit`

应更新所有包

```
npm warn workspaces app in filter set, but no workspace folder present
npm warn workspaces @vite-plus-test/utils in filter set, but no workspace folder present

up to date in <duration>
```

## `vpt print-file packages/app/package.json packages/utils/package.json`

```
{
  "name": "app",
  "dependencies": {
    "test-vite-plus-install": "*",
    "testnpm2": "*"
  },
  "devDependencies": {
    "test-vite-plus-package": "*"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "*"
  }
}
```

## `vp update -r --no-save -- --no-audit`

应递归更新但不保存

```
npm warn workspaces app in filter set, but no workspace folder present
npm warn workspaces @vite-plus-test/utils in filter set, but no workspace folder present

up to date in <duration>
```

## `vpt print-file package.json packages/app/package.json`

```
{
  "name": "command-update-npm10-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "dependencies": {
    "testnpm2": "*"
  },
  "packageManager": "npm@10.9.4"
}
{
  "name": "app",
  "dependencies": {
    "test-vite-plus-install": "*",
    "testnpm2": "*"
  },
  "devDependencies": {
    "test-vite-plus-package": "*"
  }
}
```

## `vp update --workspace --filter app @vite-plus-test/utils -- --no-audit`

应更新工作区依赖

```

up to date in <duration>
```

## `vpt print-file packages/app/package.json`

```
{
  "name": "app",
  "dependencies": {
    "test-vite-plus-install": "*",
    "testnpm2": "*"
  },
  "devDependencies": {
    "test-vite-plus-package": "*"
  }
}
```
