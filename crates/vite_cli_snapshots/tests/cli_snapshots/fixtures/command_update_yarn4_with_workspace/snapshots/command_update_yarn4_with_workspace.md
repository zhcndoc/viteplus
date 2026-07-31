# 使用工作区更新 Yarn 4 的命令

## `vp update testnpm2`

应更新所有 testnpm2 版本

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + test-vite-plus-install@npm:1.0.0, test-vite-plus-package@npm:1.0.0, testnpm2@npm:1.0.1
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0013: │ 3 packages were added to the project (+ <size> KiB).
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt print-file package.json packages/utils/package.json`

```
{
  "name": "command-update-yarn4-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "dependencies": {
    "testnpm2": "^1.0.1"
  },
  "packageManager": "yarn@4.10.3"
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "^1.0.1"
  }
}
```

## `vp update testnpm2 --latest --filter app`

应在指定的软件包中进行更新

```
[app]: Process started
[app]: ➤ YN0000: · Yarn <version>
[app]: ➤ YN0000: ┌ Resolution step
[app]: ➤ YN0085: │ + testnpm2@npm:1.0.1
[app]: ➤ YN0000: └ Completed
[app]: ➤ YN0000: ┌ Fetch step
[app]: ➤ YN0000: └ Completed
[app]: ➤ YN0000: ┌ Link step
[app]: ➤ YN0000: └ Completed
[app]: ➤ YN0000: · Done in <duration> <duration>
[app]: Process exited (exit code 0), completed in <duration> <duration>

Done in <duration> <duration>
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
[app]: Process started
[app]: ➤ YN0000: · Yarn <version>
[app]: ➤ YN0000: ┌ Resolution step
[app]: ➤ YN0000: └ Completed
[app]: ➤ YN0000: ┌ Fetch step
[app]: ➤ YN0000: └ Completed
[app]: ➤ YN0000: ┌ Link step
[app]: ➤ YN0000: └ Completed
[app]: ➤ YN0000: · Done in <duration> <duration>
[app]: Process exited (exit code 0), completed in <duration> <duration>

Done in <duration> <duration>
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

## `vp update --filter *`

应更新所有软件包

```
[command-update-yarn4-with-workspace]: Process started
[command-update-yarn4-with-workspace]: ➤ YN0000: · Yarn <version>
[command-update-yarn4-with-workspace]: ➤ YN0000: ┌ Resolution step
[command-update-yarn4-with-workspace]: ➤ YN0000: └ Completed
[command-update-yarn4-with-workspace]: ➤ YN0000: ┌ Fetch step
[command-update-yarn4-with-workspace]: ➤ YN0000: └ Completed
[command-update-yarn4-with-workspace]: ➤ YN0000: ┌ Link step
[command-update-yarn4-with-workspace]: ➤ YN0000: └ Completed
[command-update-yarn4-with-workspace]: ➤ YN0000: · Done in <duration> <duration>
[command-update-yarn4-with-workspace]: Process exited (exit code 0), completed in <duration> <duration>

[app]: Process started
[app]: ➤ YN0000: · Yarn <version>
[app]: ➤ YN0000: ┌ Resolution step
[app]: ➤ YN0000: └ Completed
[app]: ➤ YN0000: ┌ Fetch step
[app]: ➤ YN0000: └ Completed
[app]: ➤ YN0000: ┌ Link step
[app]: ➤ YN0000: └ Completed
[app]: ➤ YN0000: · Done in <duration> <duration>
[app]: Process exited (exit code 0), completed in <duration> <duration>

Done in <duration> <duration>
```

## `vpt print-file packages/app/package.json packages/utils/package.json`

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
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt print-file package.json packages/app/package.json`

```
{
  "name": "command-update-yarn4-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "dependencies": {
    "testnpm2": "^1.0.1"
  },
  "packageManager": "yarn@4.10.3"
}
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

## `vp update --workspace --filter app @vite-plus-test/utils`

应更新工作区依赖

```
[app]: Process started
[app]: ➤ YN0000: · Yarn <version>
[app]: ➤ YN0000: ┌ Resolution step
[app]: ➤ YN0000: └ Completed
[app]: ➤ YN0000: ┌ Fetch step
[app]: ➤ YN0000: └ Completed
[app]: ➤ YN0000: ┌ Link step
[app]: ➤ YN0000: └ Completed
[app]: ➤ YN0000: · Done in <duration> <duration>
[app]: Process exited (exit code 0), completed in <duration> <duration>

Done in <duration> <duration>
```

## `vpt print-file packages/app/package.json`

```
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "workspace:^",
    "test-vite-plus-install": "*",
    "testnpm2": "^1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "*"
  }
}
```
