# 命令_暂存_损坏_配置

## `vpt write-file vite.config.ts 'export default {
  staged: {
    "*.ts": "vp check --fix",
  },
  // 语法错误：缺少闭合大括号
'`


## `vp staged`

应显示实际的配置错误，而不是“未找到暂存配置”

**退出代码：** 1

```
failed to load config from <workspace>/vite.config.ts
Failed to load vite.config: Build failed with 1 error:

[PARSE_ERROR] Unexpected token
   ╭─[ vite.config.ts:5:42 ]
   │
 5 │   // 语法错误：缺少右花括号
   │                                          │
   │                                          ╰─
───╯
```
