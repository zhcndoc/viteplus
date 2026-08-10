# fmt_no_config_message

## `vp fmt`

应显示“vp fmt --init”，而不是“oxfmt --init”

```
已在 <duration> 内使用 <n> 个线程处理 3 个文件。
未找到配置，将使用默认配置。请添加配置文件，或根据需要尝试 `vp fmt --init`。
```

## `vp fmt --init`

```
已将 'fmt' 添加到 'vite.config.ts'。
```

## `vpt print-file vite.config.ts`

应包含 fmt 配置

```
export default {
  fmt: {
    ignorePatterns: [],
  },
};
```

## `vp fmt`

不应再显示“未找到配置”消息

```
Finished in <duration> on 3 files using <n> threads.
```
