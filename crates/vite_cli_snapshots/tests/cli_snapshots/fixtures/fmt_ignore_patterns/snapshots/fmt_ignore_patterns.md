# fmt_ignore_patterns

## `vp fmt src/`

测试 fmt 的 ignorePatterns 是否正常工作——被忽略的文件不应被格式化

```
Finished in <duration> on 1 files using <n> threads.
```

## `vpt print-file src/ignored/badly-formatted.js`

验证被忽略的文件仍然格式不正确（未被格式化）

```
// 此文件格式不正确，但由于 ignorePatterns 应被忽略
function   badlyFormatted(    ){
return    'hello'   ;   }
export{badlyFormatted}
```
