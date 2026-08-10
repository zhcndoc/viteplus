# milestone_roundtrip

通过端到端地验证交互机制，而无需产品埋点：
等待一个里程碑，捕获渲染后的屏幕，输入一行内容，等待下一个里程碑，再次捕获。

## `vpt probe`

**→ expect-milestone:** `probe:ask`

```
你叫什么名字？
```

**← write-line:** `vite-plus`

**→ expect-milestone:** `probe:done`

```
你叫什么名字？
vite-plus
你好，vite-plus！
```

```
你叫什么名字？
vite-plus
你好，vite-plus！
```
