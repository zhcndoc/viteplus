# 使用工作区移除 yarn4 的命令

## `vp add testnpm2 -D`

安装并忽略输出


## `vp add testnpm2 -D --filter=* --filter=@vite-plus-test/utils`


## `vp add test-vite-plus-install --filter=* --filter=@vite-plus-test/utils`


## `vp add test-vite-plus-package-optional -O --filter=* --filter=@vite-plus-test/utils`


## `vpt print-file package.json packages/app/package.json packages/admin/package.json packages/utils/package.json`

准备软件包

```
{
  "name": "command-remove-yarn4-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "yarn@4.10.3",
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
  "name": "admin",
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
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0085: │ - testnpm2@npm:1.0.1
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt print-file package.json packages/app/package.json packages/admin/package.json packages/utils/package.json`

```
{
  "name": "command-remove-yarn4-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "yarn@4.10.3",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "^1.0.0"
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
  "name": "admin",
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
➤ YN0000: · Yarn <version>
➤ YN0000: ┌ Resolution step
➤ YN0085: │ - test-vite-plus-package-optional@npm:1.0.0
➤ YN0000: └ Completed
➤ YN0000: ┌ Fetch step
➤ YN0000: └ Completed
➤ YN0000: ┌ Link step
➤ YN0000: └ Completed
➤ YN0000: · Done in <duration> <duration>
```

## `vpt print-file package.json packages/app/package.json packages/admin/package.json packages/utils/package.json`

```
{
  "name": "command-remove-yarn4-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "yarn@4.10.3",
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
  "name": "admin",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
```

## `vp remove test-vite-plus-install --filter=app`

应通过 filter=app 移除软件包

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

## `vpt print-file package.json packages/app/package.json packages/admin/package.json packages/utils/package.json`

```
{
  "name": "command-remove-yarn4-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "yarn@4.10.3",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
{
  "name": "app"
}
{
  "name": "admin",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
```

## `vp add test-vite-plus-install --filter=app`

应通过 filter=* 移除软件包

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

## `vp remove test-vite-plus-install --filter=*`

```
[command-remove-yarn4-with-workspace]: Process started
[command-remove-yarn4-with-workspace]: ➤ YN0000: · Yarn <version>
[command-remove-yarn4-with-workspace]: ➤ YN0000: ┌ Resolution step
[command-remove-yarn4-with-workspace]: ➤ YN0000: └ Completed
[command-remove-yarn4-with-workspace]: ➤ YN0000: ┌ Fetch step
[command-remove-yarn4-with-workspace]: ➤ YN0000: └ Completed
[command-remove-yarn4-with-workspace]: ➤ YN0000: ┌ Link step
[command-remove-yarn4-with-workspace]: ➤ YN0000: └ Completed
[command-remove-yarn4-with-workspace]: ➤ YN0000: · Done in <duration> <duration>
[command-remove-yarn4-with-workspace]: Process exited (exit code 0), completed in <duration> <duration>

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
  "name": "command-remove-yarn4-with-workspace",
  "version": "1.0.0",
  "workspaces": [
    "packages/*"
  ],
  "packageManager": "yarn@4.10.3"
}
{
  "name": "app"
}
{
  "name": "admin"
}
{
  "name": "@vite-plus-test/utils",
  "version": "1.0.0",
  "dependencies": {
    "test-vite-plus-install": "^1.0.0"
  }
}
```
