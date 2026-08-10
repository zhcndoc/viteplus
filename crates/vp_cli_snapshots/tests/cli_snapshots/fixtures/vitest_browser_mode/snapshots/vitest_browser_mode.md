# vitest_browser_mode

## `vp run test`

```
$ vp test

 运行  <version> <workspace>

 ✓  chromium  src/foo.test.js (1 个测试) <duration>

 测试文件  1 个通过 (1)
      测试  1 个通过 (1)
   开始于  <time>
   用时  <duration>（转换 <duration>，设置 <duration>，导入 <duration>，测试 <duration>，环境 <duration>）
```

## `vpt write-file src/foo.js 'export default '\''foo'\'';
//comment
'`


## `vp run test`

```
$ vp test ○ 缓存未命中：'src/foo.js' 已修改，正在执行

 运行  <version> <workspace>

 ✓  chromium  src/foo.test.js (1 个测试) <duration>

 测试文件  通过 1 个 (1)
      测试  通过 1 个 (1)
   开始时间  <time>
   时长  <duration> (转换 <duration>，设置 <duration>，导入 <duration>，测试 <duration>，环境 <duration>)
```

## `vpt write-file src/bar.js 'export default '\''bar'\'';
//注释
'`


## `vp run test`

```
$ vp test ◉ 缓存命中，正在重放

 运行  <version> <workspace>

 ✓  chromium  src/foo.test.js (1 个测试) <duration>

 测试文件  通过 1 个 (1)
      测试  通过 1 个 (1)
   开始于  <time>
   持续时间  <duration> (转换 <duration>，设置 <duration>，导入 <duration>，测试 <duration>，环境 <duration>)

---
vp run：缓存命中，节省了 <duration>。
```
