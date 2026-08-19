# migration_lintstagedrc_json

## `vp migrate -h`

迁移帮助信息

```
VITE+ - Web 的统一工具链

用法：vp migrate [PATH] [OPTIONS]

将独立的 Vite、Vitest、Oxlint、Oxfmt 和 Prettier 项目迁移到统一的 Vite+。

参数：
  PATH  要迁移的目标目录（默认为当前目录）

选项：
  --agent NAME      将编码代理指令写入 AGENTS.md、CLAUDE.md 等文件
  --no-agent        跳过写入编码代理指令
  --editor NAME     将编辑器配置文件写入项目
  --no-editor       跳过写入编辑器配置文件
  --hooks           设置 pre-commit hooks（非交互模式下默认为启用）
  --no-hooks        跳过设置 pre-commit hooks
  --full            对现有 Vite+ 项目：同时运行完整设置（hooks、编辑器、代理文件、ESLint/Prettier 迁移、框架 shim、tsconfig baseUrl、.node-version）。不使用此选项时，`vp migrate` 只会升级工具链版本。
  --no-interactive  以非交互模式运行（跳过提示并使用默认值）
  -h, --help        显示此帮助信息

示例：
  # 迁移当前 package
  vp migrate

  # 迁移指定目录
  vp migrate my-app

  # 非交互模式
  vp migrate --no-interactive

迁移提示：
  当你希望编码代理驱动迁移时，将以下内容提供给它：

  将此项目迁移到 Vite+。
  Vite+ 将当前围绕运行时管理、包管理、开发/构建/测试命令、
  lint、格式化和打包的分散工具链整合起来。
  在进行更改之前，运行 `vp help` 和 `vp help migrate`。
  在工作区根目录中使用 vp migrate --no-interactive。
  确保项目在迁移前使用 Vite 8+ 和 Vitest 4.1+。

  迁移之后：
  - 确认在需要的地方，`vite` 导入已重写为 `vite-plus`
  - 确认在需要的地方，`vitest` 导入已重写为 `vite-plus/test`
  - 使用 pnpm 时，保留 `vp migrate` 已将其别名指向
    Vite+ 包的 `vite` / `vitest` 条目，以确保工作区 override 继续生效；使用其他
    包管理器时，在确认这些重写完成后可以移除它们
  - 将剩余的特定工具配置移入 `vite.config.ts` 中相应的配置块

  命令映射：
  - `vp run <script>` 等同于 `pnpm run <script>`
  - `vp dev` 和 `vp test` 始终运行内置命令；`vp run dev` 和
    `vp run test` 运行 `package.json` 中的 `dev` 和 `test` 脚本
  - `vp install`、`vp add` 和 `vp remove` 通过 `packageManager` 声明的包管理器执行
  - `vp dev`、`vp build`、`vp preview`、`vp lint`、`vp fmt`、`vp check`
    和 `vp pack` 替代相应的独立工具
  - 验证循环中优先使用 `vp check`

  最后，通过运行以下命令验证迁移：
  - vp install
  - vp check
  - vp test
  - vp build

  在最后总结迁移情况，并报告仍需进行的任何手动后续操作。

文档：https://viteplus.dev/guide/migrate
```

## `vp migrate --no-interactive`

迁移处理 lintstagedrc.json

```
VITE+ - Web 的统一工具链

◇ 已将 . 迁移到 Vite+ <version>
• Node <version>  pnpm <version>
• 已应用 2 项配置更新
! 警告：
  - 找到 .lintstagedrc.json，但 "staged" 已存在于 vite.config.ts 中 — 请手动合并
```

## `vpt print-file .lintstagedrc.json`

检查 lintstagedrc.json（内联后应删除）

```
{
  "*.js": "oxlint --fix"
}
```

## `vpt print-file package.json`

检查 package.json

```
{
  "name": "migration-lintstagedrc",
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  },
  "scripts": {
    "prepare": "vp config"
  }
}
```

## `vpt print-file pnpm-workspace.yaml`

检查 pnpm-workspace.yaml 是否包含 overrides 和 catalog

```
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
overrides:
  vite@*: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
```

## `vpt print-file vite.config.ts`

检查暂存配置是否已迁移到 vite.config.ts

```
import { defineConfig } from 'vite-plus';

export default defineConfig({
  fmt: {},
  lint: {"jsPlugins":[{"name":"vite-plus","specifier":"vite-plus/oxlint-plugin"}],"rules":{"vite-plus/prefer-vite-plus-imports":"error"},"options":{"typeAware":true,"typeCheck":true}},
  staged: {
    "*.@(js|ts|tsx|yml|yaml|md|json|html|toml)": [
      "vp fmt --staged",
      "eslint --fix"
    ],
    "*.@(js|ts|tsx)": [
      "vp lint --fix"
    ]
  },
});
```
