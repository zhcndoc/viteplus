# command_dedupe_npm10

## `vp dedupe`

应对依赖项进行去重

```

added 3 packages, and audited 4 packages in <duration>

found 0 vulnerabilities
```

## `vpt print-file package.json`

```
{
  "name": "command-dedupe-npm10",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "npm@10.9.4"
}
```

## `vp dedupe --check`

应检查去重是否会产生更改

```

在 <duration> 内已是最新
```

## `vpt print-file package.json`

```
{
  "name": "command-dedupe-npm10",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "npm@10.9.4"
}
```

## `vp dedupe -- --loglevel=warn`

支持透传参数

```

up to date, audited 4 packages in <duration>

found 0 vulnerabilities
```

## `vpt print-file package.json`

```
{
  "name": "command-dedupe-npm10",
  "version": "1.0.0",
  "dependencies": {
    "testnpm2": "1.0.1"
  },
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "optionalDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "npm@10.9.4"
}
```
