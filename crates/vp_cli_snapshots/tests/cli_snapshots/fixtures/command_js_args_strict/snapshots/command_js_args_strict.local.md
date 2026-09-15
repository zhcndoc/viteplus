# command_js_args_strict

JavaScript 所有的命令会在命令工作开始前拒绝无效参数

## `vp staged --unknown`

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: unexpected argument '--unknown' found

Usage: vp staged [OPTIONS]

For more information, try '--help'.
```

## `vp staged --cwd`

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: a value is required for '--cwd <path>' but none was supplied

For more information, try '--help'.
```

## `vp staged --no-cwd`

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: unexpected argument '--no-cwd' found

Usage: vp staged [OPTIONS]

For more information, try '--help'.
```

## `vp config --unknown`

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: unexpected argument '--unknown' found

Usage: vp config [OPTIONS]

For more information, try '--help'.
```

## `vp config --hooks-dir`

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: a value is required for '--hooks-dir <path>' but none was supplied

For more information, try '--help'.
```

## `vp config --no-hooks-dir`

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: unexpected argument '--no-hooks-dir' found

  tip: a similar argument exists: '--no-hooks'

Usage: vp config --no-hooks

For more information, try '--help'.
```

## `vp hooks unknown`

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: unrecognized subcommand 'unknown'

Usage: vp hooks <COMMAND> [OPTIONS]

For more information, try '--help'.
```

## `vp hooks enable --hooks-dir`

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: a value is required for '--hooks-dir <path>' but none was supplied

For more information, try '--help'.
```

## `vp hooks enable --no-hooks-dir`

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: unexpected argument '--no-hooks-dir' found

  tip: a similar argument exists: '--hooks-dir'

Usage: vp hooks enable --hooks-dir <path>

For more information, try '--help'.
```

## `vp migrate --unknown`

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: unexpected argument '--unknown' found

  tip: to pass '--unknown' as a value, use '-- --unknown'

Usage: vp migrate [PATH] [OPTIONS]

For more information, try '--help'.
```

## `vp migrate --agent`

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: a value is required for '--agent <NAME>' but none was supplied

For more information, try '--help'.
```

## `vp migrate --no-full`

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: unexpected argument '--no-full' found

  tip: to pass '--no-full' as a value, use '-- --no-full'

Usage: vp migrate [PATH] [OPTIONS]

For more information, try '--help'.
```

## `vp create --unknown`

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: unexpected argument '--unknown' found

  tip: to pass '--unknown' as a value, use '-- --unknown'

Usage: vp create [TEMPLATE] [OPTIONS] [-- TEMPLATE_OPTIONS]

For more information, try '--help'.
```

## `vp create --directory`

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: a value is required for '--directory <DIR>' but none was supplied

For more information, try '--help'.
```

## `vp create --no-directory`

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: unexpected argument '--no-directory' found

  tip: a similar argument exists: '--no-editor'
  tip: to pass '--no-directory' as a value, use '-- --no-directory'

Usage: vp create [TEMPLATE] [OPTIONS] [-- TEMPLATE_OPTIONS]

For more information, try '--help'.
```
