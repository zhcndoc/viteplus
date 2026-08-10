# 测试内联快照缩进

## `vp test run -u src/inline-snapshot.test.ts`

使用 --update 写入内联快照（#1553 的回归测试）

```

 RUN  <version> <workspace>

 ✓ src/inline-snapshot.test.ts (1 test) <duration>
   ✓ inline snapshot indentation (1)
     ✓ writes multiline snapshots using the surrounding file indentation style <duration>

  Snapshots  1 written
 Test Files  1 passed (1)
      Tests  1 passed (1)
   Start at  <time>
   Duration  <duration> (transform <duration>, setup <duration>, import <duration>, tests <duration>, environment <duration>)
```

## `vpt print-file src/inline-snapshot.test.ts`

快照必须使用 2 个空格缩进，而不是制表符

```
import { describe, expect, it } from 'vite-plus/test';

describe('inline snapshot indentation', () => {
  it('writes multiline snapshots using the surrounding file indentation style', () => {
    expect('alpha\nbeta').toMatchInlineSnapshot(`
      "alpha
      beta"
    `);
  });
});
```
