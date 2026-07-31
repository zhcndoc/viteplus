# 带配置的暂存命令

## `git init`


## `git add -A`


## `git commit -m init`


## `vpt write-file src/index.ts 'export const hello = '\''world'\'';
export const foo = 1;
'`

追加 foo（使用 write-file 写入完整的追加内容）


## `git add src/index.ts`


## `vp staged`

应能成功处理已暂存的 .ts 文件

```
✔ Backed up original state in git stash (<hash>)
✔ Running tasks for staged files...
✔ Applying modifications from tasks...
✔ Cleaning up temporary files...
```

## `git add -A`


## `git commit -m second`


## `vpt write-file src/index.ts 'export const hello = '\''world'\'';
export const foo = 1;
export const bar = 2;
'`

追加 bar


## `git add src/index.ts`


## `vp staged --debug`

应在启用调试功能的情况下成功


## `git add -A`


## `git commit -m third`


## `vpt write-file src/fail.js 'eval("code");
'`


## `git add src/fail.js`


## `vp staged`

当暂存的 .js 文件存在 lint 错误时应失败

**退出代码：** 1

```
✔ 已在 git stash 中备份原始状态（<hash>）
⚠ 正在为暂存文件运行任务...
  ❯ 配置对象 — 1 个文件
    ↓ *.ts — 没有文件
    ❯ *.js — 1 个文件
      ✖ vp lint [失败]
↓ 由于任务出错而跳过。
✔ 由于出错，正在还原到原始状态...
✔ 正在清理临时文件...

✖ vp lint：

  × eslint(no-eval)：eval 可能有害。
   ╭─[src/fail.js:1:1]
 1 │ eval("code");
   · ────
   ╰────
  帮助：避免使用 eval()。对于 JSON 解析，请使用 JSON.parse()；对于动态属性访问，请使用括号表示法（obj[key]）；对于其他情况，请重构代码以避免将字符串作为代码执行。

发现 0 个警告和 1 个错误。
在 1 个文件上使用 <n> 个规则和 <n> 个线程，于 <duration> 内完成。
```
