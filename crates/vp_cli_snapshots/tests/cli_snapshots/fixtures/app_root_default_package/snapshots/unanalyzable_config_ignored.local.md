# 被忽略的不可分析配置

针对展开/不可分析配置的回归保护：一个只能解析为开放映射的配置可能会让 defaultPackage 隐藏在展开内容之后，但这不应导致命令失败。直接执行 vp build 会回退并在原位置运行。

## `cd spread && vp build`

```
✓ 2 modules transformed.
computing gzip size...
dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
