# 检查无 lint 类型检查失败

## `vp check --no-lint`

**Exit code:** 1

```
pass: All 3 files are correctly formatted (<duration>, <n> threads)
error: Type errors found
× typescript(TS2322): Type 'string' is not assignable to type 'number'.
   ╭─[src/index.ts:1:7]
 1 │ const value: number = "not a number";
   ·       ─────
 2 │ export { value };
   ╰────

Found 1 error and 0 warnings in 2 files (<duration>, <n> threads)
```
