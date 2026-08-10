# 迁移_升级_Vitest_保留的引用_npm

## `vp migrate --no-interactive`

保留的上游引用要求使用包本地的 Vitest

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  npm <version>
• 依赖：
    vite-plus  latest → <version>
    vite              → <version>
    vitest     4.1.8  → <version>
• 已配置包管理器设置
```

## `vpt print-file package.json`

Vitest 依赖项与覆盖项保持一致

```
{
  "name": "migration-upgrade-vitest-retained-references-npm",
  "devDependencies": {
    "vite-plus": "<version>",
    "vitest": "<version>"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>",
    "vitest": "<version>"
  },
  "devEngines": {
    "packageManager": {
      "name": "npm",
      "version": "<version>",
      "onFail": "download"
    }
  }
}
```

## `vpt print-file tsconfig.json`

compilerOptions.types 仍然是上游 Vitest 引用

```
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

## `vpt print-file config/tsconfig.test.json`

嵌套的 compilerOptions.types 也会被保留

```
{
  "compilerOptions": {
    "types": ["vitest/globals"]
  }
}
```

## `vpt print-file resolve.cjs`

require.resolve 仍然是上游 Vitest 的引用

```
module.exports = require.resolve('vitest');
```

## `vpt print-file version.ts`

vitest/package.json 仍会被有意地保持不重写

```
import metadata from 'vitest/package.json';

console.log(metadata.version);
```

## `vp migrate --no-interactive`

再次运行时，保留的引用仍保持稳定

```
VITE+ - Web 的统一工具链

此项目已在使用 Vite+！祝编码愉快！
```
