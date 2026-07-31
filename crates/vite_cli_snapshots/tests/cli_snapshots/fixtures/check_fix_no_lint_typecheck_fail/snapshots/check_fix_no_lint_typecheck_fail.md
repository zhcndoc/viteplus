# check_fix_no_lint_typecheck_fail

## `vp check --fix --no-lint`

**退出代码：** 1

```
错误：发现类型错误
× typescript(TS2322)：类型“string”无法赋值给类型“number”。
   ╭─[src/index.ts:1:7]
 1 │ const value: number = "not a number";
   ·       ─────
 2 │ export { value };
   ╰────

在 2 个文件中发现 1 个错误和 0 个警告（<duration>，<n> 个线程）
通过：已完成对已检查文件的格式化（<duration>）
```
