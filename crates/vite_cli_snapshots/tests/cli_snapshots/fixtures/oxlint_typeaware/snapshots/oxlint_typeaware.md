# oxlint_typeaware

## `vp run lint`

```
$ vp lint ./src
发现 0 个警告和 0 个错误。
使用 <n> 个规则和 <n> 个线程在 1 个文件上完成，耗时 <duration>。
```

## `vpt write-file types.ts 'export type Foo = number;
//comment
'`

将 //comment 追加到 types.ts

```
```

## `vp run lint`

非类型感知的 lint 不会读取 types.ts

```
$ vp lint ./src ◉ cache hit, replaying
Found 0 warnings and 0 errors.
Finished in <duration> on 1 file with <n> rules using <n> threads.

---
vp run: cache hit, <duration> saved.
```

## `vp run lint-typeaware`

```
$ vp lint --type-aware ./src
Found 0 warnings and 0 errors.
Finished in <duration> on 1 file with <n> rules using <n> threads.
```

## `vpt write-file types.ts 'export type Foo = number;
//comment
//comment
'`

向 types.ts 追加另一个 //comment

```
```

## `vp run lint-typeaware`

类型感知的 lint 会读取 types.ts

```
$ vp lint --type-aware ./src ○ cache miss: 'types.ts' modified, executing
Found 0 warnings and 0 errors.
Finished in <duration> on 1 file with <n> rules using <n> threads.
```
