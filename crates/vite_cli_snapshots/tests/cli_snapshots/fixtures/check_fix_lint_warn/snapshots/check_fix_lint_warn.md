# 检查并修复 lint 警告

## `vp check --fix`

```
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
通过：已完成对已检查文件的格式化（<duration>）
```

## `vp check`

```
通过：全部 3 个文件格式正确（<duration>，<n> 个线程）
警告：发现 lint 警告
⚠ eslint(no-console)：不应使用 console 语句。
   ╭─[src/index.js:2:3]
 1 │ function hello() {
 2 │   console.log("hello");
   ·   ───────────
 3 │ }
   ╰────
  帮助：删除此 console 语句。

在 2 个文件中发现 0 个错误和 1 个警告（<duration>，<n> 个线程）
```
