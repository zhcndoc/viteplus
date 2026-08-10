# check_backpressure_nonblocking_stdout

当大型诊断重放遇到非阻塞且存在回压的管道时，vp check 会暴露 stdout EAGAIN 故障（#2165）。

## `vpt backpressure-run --digest 6,8 -- vp check`

```
--- 标准输出 ---
标准输出：1282 行
[1m[94m通过：[39m[0m 3 个文件的格式均正确 [2m（<duration>，<n> 个线程）[0m
! eslint(no-unused-vars)：变量 'unused000' 已声明但从未使用。未使用的变量应以 '_' 开头。
   ,-[src/index.js:2:9]
 1 | export function emitDiagnostics() {
 2 |   const unused000 = 0;
   :         ^^^^|^^^^
... 已省略 1268 行 ...
 129 |   const unused127 = 127;
     :         ^^^^|^^^^
     :             `-- 'unused127' 在此处声明
 130 | }
     `----
  帮助：考虑移除此声明。

在 2 个文件中发现 0 个错误和 128 个警告（<duration>，<n> 个线程）
--- 标准错误 ---
标准错误：1 行
[1m[33m警告：[39m[0m 发现 lint 警告
```
