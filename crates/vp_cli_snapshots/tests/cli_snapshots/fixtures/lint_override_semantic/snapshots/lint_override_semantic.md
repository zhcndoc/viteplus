# lint_override_semantic

## `vp lint src/example.js`

JavaScript 基础 lint 规则适用

**退出代码：** 1

```

  × eslint(no-console)：不应使用意外的 console 语句。
   ╭─[src/example.js:1:1]
 1 │ console.log();
   · ───────────
   ╰────
  帮助：删除此 console 语句。

发现 0 个警告和 1 个错误。
在 1 个文件上使用 <n> 个规则和 <n> 个线程，耗时 <duration>。
```

## `vp lint src/example.vue`

当文件覆盖规则添加 Vue 规则时，基础 lint 规则仍会保留

**退出代码：** 1

```

  × vue(no-export-in-script-setup)：`<script setup>` 不能包含 ES 模块导出。
   ╭─[src/example.vue:8:16]
 7 │
 8 │ export default {};
   ·                ──
 9 │ </script>
   ╰────

  × vue(no-export-in-script-setup)：`<script setup>` 不能包含 ES 模块导出。
   ╭─[src/example.vue:8:8]
 7 │
 8 │ export default {};
   ·        ───────
 9 │ </script>
   ╰────

  × eslint(no-console)：不应使用 console 语句。
   ╭─[src/example.vue:6:1]
 5 │ <script lang="ts" setup>
 6 │ console.log();
   · ───────────
 7 │
   ╰────
  帮助：删除此 console 语句。

发现 0 个警告和 3 个错误。
在 <duration> 内完成，共处理 1 个文件，使用 <n> 条规则和 <n> 个线程。
```
