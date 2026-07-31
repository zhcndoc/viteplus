# 检查 Vite 配置规则

## `vp lint`

测试 vp lint 是否从 vite.config.ts 读取规则

```

  ⚠ eslint(no-console): Unexpected console statement.
   ╭─[src/has-console.js:3:3]
 2 │ function example() {
 3 │   console.log('hello');
   ·   ───────────
 4 │   return 'hello';
   ╰────
  help: Delete this console statement.

Found 1 warning and 0 errors.
Finished in <duration> on 3 files with <n> rules using <n> threads.
```
