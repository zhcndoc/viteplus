# command_init_inline_config_existing

## `vp lint --init`

```
Skipped initialization: 'lint' already exists in 'vite.config.ts'.
```

## `vpt stat-file .oxlintrc.json --assert-not file`

检查是否未创建 .oxlintrc.json

```
.oxlintrc.json: missing
```

## `vp fmt --init`

```
已跳过初始化：`fmt` 已存在于 `vite.config.ts` 中。
```

## `vpt stat-file .oxfmtrc.json --assert-not file`

检查 .oxfmtrc.json 未创建

```
.oxfmtrc.json: missing
```
