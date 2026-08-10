# command_unlink_npm10

## `vpt mkdir -p ../unlink-test-lib-npm`

创建测试库

```
```

## `vpt write-file ../unlink-test-lib-npm/package.json '{"name": "unlink-test-lib-npm", "version": "1.0.0"}
'`

```
```

## `vp link ../unlink-test-lib-npm`

先链接该库

```

added 1 package, and audited 3 packages in <duration>

found 0 vulnerabilities
```

## `vpt print-file package.json`

```
{
  "name": "command-unlink-npm10",
  "version": "1.0.0",
  "packageManager": "npm@10.0.0"
}
```

## `vp unlink unlink-test-lib-npm`

应取消链接该软件包

```

removed 1 package, and audited 2 packages in <duration>

found 0 vulnerabilities
```

## `vpt print-file package.json`

```
{
  "name": "command-unlink-npm10",
  "version": "1.0.0",
  "packageManager": "npm@10.0.0"
}
```
