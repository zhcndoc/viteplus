# command_update_npm10

## `vp update testnpm2 -- --no-audit`

应在 semver 范围内更新软件包

```

added 3 packages in <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-update-npm10",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "*"
  },
  "devDependencies": {
    "test-vite-plus-package": "*"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "*"
  },
  "packageManager": "npm@10.9.2"
}
```

## `vp up testnpm2 --latest -- --no-audit`

应更新到绝对最新版本

```
警告：npm 不支持 --latest 标志。仅在 semver 范围内更新。

已是最新版本，耗时 <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-update-npm10",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "*"
  },
  "devDependencies": {
    "test-vite-plus-package": "*"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "*"
  },
  "packageManager": "npm@10.9.2"
}
```

## `vp update -D -- --no-audit`

应仅更新开发依赖

```

已是最新版本，耗时 <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-update-npm10",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "*"
  },
  "devDependencies": {
    "test-vite-plus-package": "*"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "*"
  },
  "packageManager": "npm@10.9.2"
}
```

## `vp update -P --no-save -- --no-audit`

应仅更新 dependencies 和 optionalDependencies，而不保存

```

在 <duration> 内已是最新
```

## `vpt print-file package.json`

```
{
  "name": "command-update-npm10",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "*"
  },
  "devDependencies": {
    "test-vite-plus-package": "*"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "*"
  },
  "packageManager": "npm@10.9.2"
}
```

## `vp rm testnpm2`

应跳过可选依赖

```

removed 1 package, and audited 3 packages in <duration>

found 0 vulnerabilities
```

## `vp add testnpm2@1.0.0 -O -- --no-audit`

```

已添加 1 个软件包，用时 <duration>
```

## `vp update --no-optional --latest -- --no-audit`

```
警告：npm 不支持 --latest 标志。仅在 semver 范围内更新。
npm 警告 config optional 使用 `--omit=optional` 排除可选依赖，或
npm 警告 config 使用 `--include=optional` 包含可选依赖。
npm 警告 config
npm 警告 config       默认值会安装可选依赖，除非另行省略。

在 <duration> 内更改了 1 个软件包
```

## `vpt print-file package.json`

```
{
  "name": "command-update-npm10",
  "version": "1.0.0",
  "devDependencies": {
    "test-vite-plus-package": "*"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "*",
    "testnpm2": "^1.0.0"
  },
  "packageManager": "npm@10.9.2"
}
```

## `vp update -- --no-audit`

应更新所有软件包，但不会更改 package.json

```

added 2 packages in <duration>
```

## `vpt print-file package.json`

```
{
  "name": "command-update-npm10",
  "version": "1.0.0",
  "devDependencies": {
    "test-vite-plus-package": "*"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "*",
    "testnpm2": "^1.0.0"
  },
  "packageManager": "npm@10.9.2"
}
```
