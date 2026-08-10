# 从 Vitest 配置迁移

## `vp migrate --no-interactive`

迁移应将导入重写为 vite-plus

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移至 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新，已重写 1 个文件中的导入
```

## `vpt print-file vitest.config.ts`

检查 vitest.config.ts

```
import { join } from 'node:path';

import { foo } from '@foo/vite-plugin-foo';
import { playwright } from 'vite-plus/test/browser-playwright';
import { server } from 'vite-plus/test/browser/context';
import { preview } from 'vite-plus/test/browser-preview';
import { webdriverio } from 'vite-plus/test/browser-webdriverio';
import { userEvent } from 'vite-plus/test/browser/context';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [foo()],
  test: {
    dir: join(import.meta.dirname, 'test'),
    browser: {
      enabled: true,
      provider: playwright(),
      headless: true,
      screenshotFailures: false,
      instances: [{ browser: 'chromium' }],
    },
  },
});
```

## `vpt print-file package.json`

检查 package.json

```
{
  "name": "migration-from-vitest-config",
  "scripts": {
    "test:run": "vp test run",
    "test:ui": "vp test --ui",
    "test:coverage": "vp test run --coverage",
    "test:watch": "vp test --watch",
    "test": "vp test",
    "prepare": "vp config"
  },
  "devDependencies": {
    "@vitest/browser-playwright": "catalog:",
    "@vitest/coverage-v8": "catalog:",
    "vite": "catalog:",
    "vitest": "catalog:",
    "@vitest/browser-webdriverio": "catalog:",
    "webdriverio": "*",
    "playwright": "*",
    "vite-plus": "catalog:"
  },
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  }
}
```

## `vpt print-file pnpm-workspace.yaml`

检查 pnpm-workspace.yaml 是否包含 overrides 和 catalog

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vitest: <version>
  vite-plus: <version>
  '@vitest/browser-webdriverio': <version>
  '@vitest/browser-playwright': <version>
  '@vitest/coverage-v8': <version>
allowBuilds:
  edgedriver: true
  geckodriver: true
overrides:
  vite: 'catalog:'
  vitest: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
    - vitest
  allowedVersions:
    vite: '*'
    vitest: '*'
```
