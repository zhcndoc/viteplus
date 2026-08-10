# command_link_npm10

## `vpt mkdir -p ../test-lib-npm`

创建测试库

```
```

## `vpt write-file ../test-lib-npm/package.json '{"name": "test-lib-npm", "version": "1.0.0"}
'`

```
```

## `vp link ../test-lib-npm`

应该链接本地目录

```

added 1 package, and audited 3 packages in <duration>

found 0 vulnerabilities
```

## `vpt print-file package.json`

```
{
  "name": "command-link-npm10",
  "version": "1.0.0",
  "packageManager": "npm@10.0.0"
}
```

## `vp ln ../test-lib-npm`

应能与 ln 别名一起正常工作

```

最新状态，已审核 3 个软件包，耗时 <duration>

发现 0 个漏洞
```

## `vpt print-file package.json`

```
{
  "name": "command-link-npm10",
  "version": "1.0.0",
  "packageManager": "npm@10.0.0"
}
```

## `vp unlink test-lib-npm`

清理临时状态

```

removed 1 package, and audited 2 packages in <duration>

found 0 vulnerabilities
```

## `vpt print-file package.json`

```
{
  "name": "command-link-npm10",
  "version": "1.0.0",
  "packageManager": "npm@10.0.0"
}
```
