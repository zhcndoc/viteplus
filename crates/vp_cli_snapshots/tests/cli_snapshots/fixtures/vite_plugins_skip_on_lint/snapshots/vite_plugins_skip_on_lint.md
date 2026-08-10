# lint 时跳过 Vite 插件

## `vp lint src/`

vp lint 不应加载插件（如果导入 heavy-plugin.ts，则会抛出异常）

```
发现 0 个警告和 0 个错误。
使用 <n> 个线程，根据 <n> 条规则在 1 个文件上于 <duration> 内完成。
```
