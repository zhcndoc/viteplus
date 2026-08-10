# test_vi_mock_hoist

## `vp test run src/vi-mock-hoist.test.ts`

来自 `vite-plus/test` 的 vi.mock() 必须通过上游 mocker 进行提升（不使用 vite-plus 补丁/垫片）

```

 RUN  <version> <workspace>

 ✓ src/vi-mock-hoist.test.ts (1 test) <duration>
   ✓ hoists vi.mock() above imports for the vite-plus/test specifier <duration>

 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  <time>
   Duration  <duration> (transform <duration>, setup <duration>, import <duration>, tests <duration>, environment <duration>)
```
