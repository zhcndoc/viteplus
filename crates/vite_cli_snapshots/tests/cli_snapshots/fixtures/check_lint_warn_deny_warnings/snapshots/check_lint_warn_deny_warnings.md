# 检查 lint 警告和拒绝警告

## `vp check`

**退出代码：** 1

```
通过：3 个文件均已正确格式化（<duration>，<n> 个线程）
警告：发现代码检查警告
⚠ eslint(no-console)：出现意外的 console 语句。
   ╭─[src/index.js:2:3]
 1 │ function hello() {
 2 │   console.log("hello");
   ·   ───────────
 3 │ }
   ╰────
  帮助：删除此 console 语句。

在 2 个文件中发现 0 个错误和 1 个警告（<duration>，<n> 个线程）
```
