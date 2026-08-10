# 检查 lint 失败的类型检查

## `vp check`

**退出代码：** 1

```
通过：全部 4 个文件的格式均正确（<duration>，<n> 个线程）
错误：发现 lint 或类型问题
× eslint(no-eval)：eval 可能有害。
   ╭─[src/index.js:2:3]
 1 │ function hello() {
 2 │   eval("code");
   ·   ────
 3 │   return "hello";
   ╰────
  帮助：避免使用 eval()。解析 JSON 时使用 JSON.parse()；访问动态属性时使用括号表示法（obj[key]）；对于其他情况，请重构代码以避免将字符串作为代码执行。

在 2 个文件中发现 1 个错误和 0 个警告（<duration>，<n> 个线程）
```
