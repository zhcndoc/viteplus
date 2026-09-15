# command_staged_concurrent

## `git init`


## `git add -A`


## `git -c 'user.name=Vite Plus' -c user.email=vite-plus@example.com commit -m init`


## `vpt write-file a.txt 'changed
'`


## `git add a.txt`


## `TMPDIR=${workspace} vp staged --no-concurrent --verbose`

--no-concurrent 运行 staged 任务且不会停滞

```
✔ Backed up original state in git stash (<hash>)
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...

→ vpt print linted:
linted <workspace>/a.txt
```

## `vp staged --concurrent=0`

零并发会在 lint-staged 启动前失败

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: invalid value '0' for '--concurrent [<number|boolean>]': use true, false, or an integer from 1 through 4294967295

For more information, try '--help'.
```

## `vp staged --no-cwd`

否定的字符串选项会报告 CLI 错误

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: unexpected argument '--no-cwd' found

Usage: vp staged [OPTIONS]

For more information, try '--help'.
```

## `vp staged --no-diff`

否定的 diff 会报告 CLI 错误

**退出代码：** 1

```
VITE+ - The Unified Toolchain for the Web

error: unexpected argument '--no-diff' found

Usage: vp staged [OPTIONS]

For more information, try '--help'.
```
