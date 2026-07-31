# 使用 Yarn 4 添加工作区的命令

## `vp add testnpm2 -D -w`

应将软件包添加到工作区根目录

```
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0085: │ + testnpm2@npm:1.0.1
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0013: │ A package was added to the project (+ <size> KiB).
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-yarn4-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "yarn@4.10.3",
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

## `vp add @vite-plus-test/utils --workspace -w`

应将 @vite-plus-test/utils 添加到工作区根目录

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

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-yarn4-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "yarn@4.10.3",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "workspace:^"
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

## `vp add testnpm2 test-vite-plus-install@1.0.0 --filter app`

应将软件包添加到 packages/app

```
[app]: Process started
[app]: ➤ YN0000: · Yarn <version>
[app]: ➤ YN0000: ┌ Resolution step
[app]: ➤ YN0085: │ + test-vite-plus-install@npm:1.0.0
[app]: ➤ YN0000: └ Completed
[app]: ➤ YN0000: ┌ Fetch step
[app]: ➤ YN0013: │ A package was added to the project (+ <size> KiB).
[app]: ➤ YN0000: └ Completed
[app]: ➤ YN0000: ┌ Link step
[app]: ➤ YN0000: └ Completed
[app]: ➤ YN0000: · Done in <duration> <duration>
[app]: Process exited (exit code 0), completed in <duration> <duration>

Done in <duration> <duration>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-yarn4-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "yarn@4.10.3",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "workspace:^"
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
[app]: 进程已启动
[app]: ➤ YN0000: · Yarn <version>
[app]: ➤ YN0000: ┌ 解析步骤
[app]: ➤ YN0000: └ 已完成
[app]: ➤ YN0000: ┌ 获取步骤
[app]: ➤ YN0000: └ 已完成
[app]: ➤ YN0000: ┌ 链接步骤
[app]: ➤ YN0000: └ 已完成
[app]: ➤ YN0000: · 用时 <duration> <duration>
[app]: 进程已退出（退出代码 0），用时 <duration> <duration>

用时 <duration> <duration>
```

## `vpt print-file package.json packages/app/package.json packages/utils/package.json`

```
{
  "name": "command-add-yarn4-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "yarn@4.10.3",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "workspace:^"
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

## `vp add testnpm2 test-vite-plus-install@1.0.0 --filter * --filter @vite-plus-test/utils`

应将 test-vite-plus-install 添加到所有软件包和工作区根目录，并命名为 testnpm2

```
[command-add-yarn4-with-workspace]: Process started
[command-add-yarn4-with-workspace]: ➤ YN0000: · Yarn <version>
[command-add-yarn4-with-workspace]: ➤ YN0000: ┌ Resolution step
[command-add-yarn4-with-workspace]: ➤ YN0000: └ Completed
[command-add-yarn4-with-workspace]: ➤ YN0000: ┌ Fetch step
[command-add-yarn4-with-workspace]: ➤ YN0000: └ Completed
[command-add-yarn4-with-workspace]: ➤ YN0000: ┌ Link step
[command-add-yarn4-with-workspace]: ➤ YN0000: └ Completed
[command-add-yarn4-with-workspace]: ➤ YN0000: · Done in <duration> <duration>
[command-add-yarn4-with-workspace]: Process exited (exit code 0), completed in <duration> <duration>

[admin]: Process started
[admin]: ➤ YN0000: · Yarn <version>
[admin]: ➤ YN0000: ┌ Resolution step
[admin]: ➤ YN0000: └ Completed
[admin]: ➤ YN0000: ┌ Fetch step
[admin]: ➤ YN0000: └ Completed
[admin]: ➤ YN0000: ┌ Link step
[admin]: ➤ YN0000: └ Completed
[admin]: ➤ YN0000: · Done in <duration> <duration>
[admin]: Process exited (exit code 0), completed in <duration> <duration>

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

[@vite-plus-test/utils]: Process started
[@vite-plus-test/utils]: ➤ YN0000: · Yarn <version>
[@vite-plus-test/utils]: ➤ YN0000: ┌ Resolution step
[@vite-plus-test/utils]: ➤ YN0000: └ Completed
[@vite-plus-test/utils]: ➤ YN0000: ┌ Fetch step
[@vite-plus-test/utils]: ➤ YN0000: └ Completed
[@vite-plus-test/utils]: ➤ YN0000: ┌ Link step
[@vite-plus-test/utils]: ➤ YN0000: └ Completed
[@vite-plus-test/utils]: ➤ YN0000: · Done in <duration> <duration>
[@vite-plus-test/utils]: Process exited (exit code 0), completed in <duration> <duration>

Done in <duration> <duration>
```

## `vpt print-file package.json packages/app/package.json packages/admin/package.json packages/utils/package.json`

```
{
  "name": "command-add-yarn4-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "yarn@4.10.3",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "workspace:^",
    "test-vite-plus-install": "1.0.0"
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
  "name": "admin",
  "dependencies": {
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

## `vp install -O test-vite-plus-package-optional --filter *`

应为 add 命令安装软件包别名

```
VITE+ - The Unified Toolchain for the Web

[command-add-yarn4-with-workspace]: Process started
[command-add-yarn4-with-workspace]: ➤ YN0000: · Yarn <version>
[command-add-yarn4-with-workspace]: ➤ YN0000: ┌ Resolution step
[command-add-yarn4-with-workspace]: ➤ YN0085: │ + test-vite-plus-package-optional@npm:1.0.0
[command-add-yarn4-with-workspace]: ➤ YN0000: └ Completed
[command-add-yarn4-with-workspace]: ➤ YN0000: ┌ Fetch step
[command-add-yarn4-with-workspace]: ➤ YN0013: │ A package was added to the project (+ <size> KiB).
[command-add-yarn4-with-workspace]: ➤ YN0000: └ Completed
[command-add-yarn4-with-workspace]: ➤ YN0000: ┌ Link step
[command-add-yarn4-with-workspace]: ➤ YN0000: └ Completed
[command-add-yarn4-with-workspace]: ➤ YN0000: · Done in <duration> <duration>
[command-add-yarn4-with-workspace]: Process exited (exit code 0), completed in <duration> <duration>

[admin]: Process started
[admin]: ➤ YN0000: · Yarn <version>
[admin]: ➤ YN0000: ┌ Resolution step
[admin]: ➤ YN0000: └ Completed
[admin]: ➤ YN0000: ┌ Fetch step
[admin]: ➤ YN0000: └ Completed
[admin]: ➤ YN0000: ┌ Link step
[admin]: ➤ YN0000: └ Completed
[admin]: ➤ YN0000: · Done in <duration> <duration>
[admin]: Process exited (exit code 0), completed in <duration> <duration>

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

## `vpt print-file package.json packages/app/package.json packages/admin/package.json packages/utils/package.json`

```
{
  "name": "command-add-yarn4-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "yarn@4.10.3",
  "devDependencies": {
    "testnpm2": "^1.0.1"
  },
  "dependencies": {
    "@vite-plus-test/utils": "workspace:^",
    "test-vite-plus-install": "1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
  }
}
{
  "name": "app",
  "dependencies": {
    "@vite-plus-test/utils": "workspace:^",
    "test-vite-plus-install": "1.0.0",
    "testnpm2": "^1.0.1"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
  }
}
{
  "name": "admin",
  "dependencies": {
    "test-vite-plus-install": "1.0.0",
    "testnpm2": "^1.0.1"
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
    "test-vite-plus-install": "1.0.0",
    "testnpm2": "^1.0.1"
  }
}
```
