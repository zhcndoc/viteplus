# vite 插件运行 lint

## `vp run lint-task`

vp run lint 不应加载插件（如果导入 heavy-plugin.ts，则会抛出异常）

```
$ vp lint src/ ⊘ cache disabled
Found 0 warnings and 0 errors.
Finished in <duration> on 1 file with <n> rules using <n> threads.
```
