# check_fix_missing_stderr

## `vp check --fix`

**退出代码：** 1

```
error: Formatting could not complete
Failed to load configuration file.
<workspace>/vite.config.ts
Error: The `fmt` field in the default export must be an object.
Ensure the file has a valid default export of a JSON-serializable configuration object.

Formatting failed during fix
```

## `vp check`

**退出代码：** 1

```
错误：无法开始格式化
无法加载配置文件。
<workspace>/vite.config.ts
错误：默认导出中的 `fmt` 字段必须是一个对象。
请确保文件具有一个有效的默认导出，且其内容为可 JSON 序列化的配置对象。

分析开始前格式化失败
```
