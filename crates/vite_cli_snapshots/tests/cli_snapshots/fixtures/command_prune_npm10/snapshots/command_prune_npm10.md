# command_prune_npm10

## `vp install`

应首先安装软件包

```
VITE+ - Web 的统一工具链

已添加 3 个软件包，并在 <duration> 内审计了 4 个软件包

发现 0 个漏洞
```

## `vp pm prune --help`

应显示帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp pm prune [选项] [-- <传递参数>...]

移除不必要的软件包

参数：
  [<传递参数>...]...  其他参数

选项：
  --prod         移除 devDependencies
  --no-optional  移除可选依赖
  -h, --help     打印帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp pm prune`

应清理多余的依赖

```

up to date, audited 4 packages in <duration>

found 0 vulnerabilities
```

## `vp pm prune --prod`

应清理开发依赖项（使用 --omit=dev）

```

up to date, audited 3 packages in <duration>

found 0 vulnerabilities
```

## `vp pm prune --no-optional`

应清理可选依赖项（使用 --omit=optional）

```

已添加 1 个软件包，并在 <duration> 内审核了 3 个软件包

发现 0 个漏洞
```

## `vp pm prune --prod --no-optional`

should prune both dev and optional dependencies

```

up to date, audited 2 packages in <duration>

found 0 vulnerabilities
```

## `vp pm prune -- --loglevel=warn`

应支持传递参数

```

已添加 2 个软件包，并在 <duration> 内审计了 4 个软件包

发现 0 个漏洞
```
