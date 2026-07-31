# check_fix_lint_error_not_swallowed

## `vp check --fix src/index.js`

使用 --fix 和路径时的真实 lint 错误（suppress_unmatched 处于启用状态），错误不得被吞掉

**退出代码：** 1

```
error: Lint issues found
× eslint(no-eval): eval can be harmful.
   ╭─[src/index.js:2:3]
 1 │ function hello() {
 2 │   eval("code");
   ·   ────
 3 │   return "hello";
   ╰────
  help: Avoid eval(). For JSON parsing use JSON.parse(); for dynamic property access use bracket notation (obj[key]); for other cases refactor to avoid evaluating strings as code.

Found 1 error and 0 warnings in 1 file (<duration>, <n> threads)
pass: Formatting completed for checked files (<duration>)
```
