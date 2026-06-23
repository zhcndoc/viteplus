# RFC：Vite+ 迁移命令

## 背景

在迁移到 Vite+ 时，项目通常会使用 vite、oxlint、oxfmt 和 vitest 等独立工具，每个工具都有自己的依赖和配置文件。`vp migrate` 命令会自动将这些工具整合到统一的 Vite+ 工具链中。

**问题**：手动迁移既容易出错又耗时：

- 需要更新 package.json 中多个依赖项
- 需要合并多个配置文件（vite.config.ts、.oxlintrc、.oxfmtrc 等）
- 存在遗漏配置或合并错误的风险
- 在 monorepo 中迁移多个包时流程繁琐

**解决方案**：使用 [ast-grep](https://ast-grep.github.io/) 进行代码转换，并使用 [brush-parser](https://github.com/reubeno/brush) 重写 shell 脚本，实现自动化迁移。

**相关命令**：

- `vp create` - 在生成代码后使用同一套迁移引擎（见 [code-generator.md](./code-generator.md)）
- `vp migrate` - 用于迁移现有项目的命令

## 目标

1. **依赖整合**：将独立的 vite、vitest、oxlint、oxfmt 依赖替换为统一的 vite-plus
2. **配置统一**：将 .oxlintrc、.oxfmtrc 合并到 vite.config.ts
3. **安全**：在应用前预览变更
4. **智能**：保留自定义配置和用户覆盖项
5. **面向 Monorepo**：高效迁移多个包

## 范围

**此命令会迁移的内容**：

- ✅ **依赖**：vite、vitest、oxlint、oxfmt → vite-plus
- ✅ **覆盖项**：强制将 vite → vite-plus（适用于所有依赖）
  - pnpm（没有现有的 `pnpm` 配置）：将 `overrides`、`peerDependencyRules` 和 `catalog` 写入 `pnpm-workspace.yaml`
  - pnpm（已有 `pnpm` 配置）：在 `package.json` 中添加 `pnpm.overrides` 和 `pnpm.peerDependencyRules`
  - npm/bun：在 `package.json` 中添加 `overrides.vite` 映射
  - yarn：在 `package.json` 中添加 `resolutions.vite` 映射
  - **收益**：代码继续使用 `import from 'vite'` —— 会自动解析到 vite-plus
- ✅ **配置文件**：
  - .oxlintrc → vite.config.ts（lint 部分）
  - .oxfmtrc → vite.config.ts（format 部分）
- ✅ **tsconfig.json 清理**：移除已弃用的 `esModuleInterop: false`（会导致 oxlint tsgolint 错误）

**此命令可选迁移的内容**（会提示确认）：

- ✅ **Git hooks**：husky + lint-staged → `vp config` + `vp staged`
  - 将 `prepare: "husky"` 重写为 `prepare: "vp config"`
  - 将 lint-staged 配置迁移到 vite.config.ts 中的 `staged`
  - 使用 `vp staged` 将 `.husky/pre-commit` 替换为 `.vite-hooks/pre-commit`
  - 从 devDependencies 中移除 `husky` 和 `lint-staged`
- ✅ **ESLint → oxlint**（通过 `@oxlint/migrate`）：将 ESLint flat config 转换为 `.oxlintrc.json`，然后按现有流程合并到 vite.config.ts
- ✅ **Prettier → oxfmt**（通过 `vp fmt --migrate=prettier`）：将 Prettier 配置转换为 `.oxfmtrc.json`，然后按现有流程合并到 vite.config.ts

**此命令不会迁移的内容**：

- ❌ package.json 脚本 → vite-task.json（不同功能）
- ❌ 构建工具变更（webpack/rollup → vite）

这些是**整合迁移**，不是**功能迁移**。

### 重新迁移

当项目的依赖中已经包含 `vite-plus` 时，`vp migrate` 会跳过完整的依赖/配置迁移，仅执行剩余的部分迁移：

- **ESLint → Oxlint**：如果 `eslint` 仍然存在且使用 flat config，会提供 ESLint 迁移
- **Prettier → Oxfmt**：如果 `prettier` 仍然存在且有配置文件，会提供 Prettier 迁移
- **Git hooks**：如果 `husky` 和/或 `lint-staged` 仍然存在，会提供 hooks 迁移

所有检查都是独立运行的——一个项目可能需要其中一项、几项，或者都不需要。

## 命令用法

```bash
vp migrate
```

## 迁移流程

该迁移使用**两阶段架构**：所有用户提示会先一次性收集完毕（阶段 1），然后再无中断地执行全部工作（阶段 2）。这样用户可以在任何变更开始前看到完整计划。

### 阶段 1：收集用户决策

所有提示会在任何工作开始前按顺序展示：

1. **确认迁移**："将此项目迁移到 Vite+？"
2. **包管理器**：选择或自动检测（pnpm/npm/yarn）
3. **Pre-commit hooks**："设置 pre-commit hooks？" + 预检验证（只读检查 git 根目录、现有 hook 工具）
4. **Agent 选择**："你在使用哪些 agents？"（多选）
5. **Agent 文件冲突**：针对每个现有文件 —— "Agent instructions already exist at X. Append or Skip?"（仅适用于没有自动更新标记的文件）
6. **编辑器选择**："你在使用哪个编辑器？"
7. **编辑器文件冲突**：针对每个现有文件 —— "X already exists. Merge or Skip?"
8. **ESLint 迁移**：如果检测到 ESLint 配置 —— "将 ESLint 规则迁移到 Oxlint？"
9. **Prettier 迁移**：如果检测到 Prettier 配置 —— "将 Prettier 迁移到 Oxfmt？"
10. **迁移计划摘要**：在执行前展示所有计划中的操作

在非交互模式（`--no-interactive`）下，阶段 1 会使用默认值（不显示提示，也不显示摘要）。

```bash
$ vp migrate

VITE+ - 面向 Web 的统一工具链

◆ 将此项目迁移到 Vite+？
│ 是

◆ 你想使用哪个包管理器？
│ pnpm（推荐）

◆ 设置 pre-commit hooks？
│ 是

◆ 你在使用哪些 agents？
│ Claude Code

◆ CLAUDE.md 已存在。
│ 追加

◆ 你在使用哪个编辑器？
│ VSCode

◆ .vscode/settings.json 已存在。
│ 合并

◆ 使用 @oxlint/migrate 将 ESLint 规则迁移到 Oxlint？
│ 是

◆ 将 Prettier 迁移到 Oxfmt？
│ 是

迁移计划：
- 安装 pnpm 和依赖
- 为 Vite+ 重写配置和依赖
- 将 ESLint 规则迁移到 Oxlint
- 将 Prettier 迁移到 Oxfmt
- 设置 pre-commit hooks
- 写入 agent 说明（CLAUDE.md，追加）
- 写入编辑器配置（.vscode/，合并）
```

### 阶段 2：无提示执行

所有工作会按顺序运行，并显示 spinner 反馈——不再进行任何用户交互：

1. **下载包管理器** + 版本验证
2. **升级 yarn**（如需要，yarn <4.10.0）
3. **运行 `vp install`** 准备依赖
4. **检查 vite/vitest 版本**（若不受支持则中止）
5. **迁移 ESLint → Oxlint**（如果在阶段 1 中批准，通过 `@oxlint/migrate`）
   5b. **迁移 Prettier → Oxfmt**（如果在阶段 1 中批准，通过 `vp fmt --migrate=prettier`）
6. **重写配置**（依赖、覆盖项、配置文件合并）
7. **安装 git hooks**（如果已批准）
8. **写入 agent 说明**（使用预先解析好的冲突决策）
9. **写入编辑器配置**（使用预先解析好的冲突决策）
10. **重新安装依赖**（最终的 `vp install`）

```bash
pnpm@latest 正在安装...
pnpm@<semver> 已安装
正在将 ESLint 配置迁移到 Oxlint...
ESLint 配置已迁移到 .oxlintrc.json
正在将 ESLint 注释替换为 Oxlint 对应项...
ESLint 注释已替换
✔ 已移除 eslint.config.mjs
✔ 已在 vite.config.ts 中创建 vite.config.ts
✔ 已将 .oxlintrc.json 合并到 vite.config.ts
✔ 已将 staged 配置合并到 vite.config.ts
已将 agent 说明写入 AGENTS.md
✔ 迁移完成！
```

## 迁移规则

### Package.json 依赖与覆盖项

**迁移前：**

```json
{
  "name": "my-package",
  "dependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "vite": "^8.0.0",
    "vitest": "^4.0.0",
    "oxlint": "^0.1.0",
    "oxfmt": "^0.1.0",
    "@vitest/browser": "^4.0.0",
    "@vitest/browser-playwright": "^4.0.0",
    "@vitejs/plugin-react": "^4.2.0"
  }
}
```

**迁移后（npm/bun）-- `package.json`：**

```json
{
  "name": "my-package",
  "dependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "vite": "npm:@voidzero-dev/vite-plus-core@latest",
    "@vitejs/plugin-react": "^4.2.0"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@latest"
  }
}
```

**迁移后（pnpm，没有现有 `pnpm` 配置）-- `package.json`：**

```json
{
  "name": "my-package",
  "dependencies": {
    "react": "^18.2.0"
  },
  "devDependencies": {
    "vite": "catalog:",
    "@vitejs/plugin-react": "^4.2.0",
    "vite-plus": "catalog:"
  },
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<semver>",
      "onFail": "download"
    }
  }
}
```

> 已经声明顶层 `packageManager` 字段的项目会改为保持该字段更新（兼容优先规则，见 [RFC: devEngines Support](./dev-engines.md)）。

**迁移后（pnpm，没有现有 `pnpm` 配置）-- `pnpm-workspace.yaml`：**

```yaml
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@latest
  vite-plus: latest
overrides:
  vite: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
    vitest: '*'
```

**迁移后（pnpm，已有 `pnpm` 配置）-- `package.json`：**

已经在 `package.json` 中有 `pnpm` 字段的项目（例如包含 `overrides` 或 `onlyBuiltDependencies`）会继续使用 `package.json` 作为 pnpm 配置位置：

```json
{
  "name": "my-package",
  "devDependencies": {
    "vite": "npm:@voidzero-dev/vite-plus-core@latest",
    "vite-plus": "latest"
  },
  "pnpm": {
    "overrides": {
      "vite": "npm:@voidzero-dev/vite-plus-core@latest"
    },
    "peerDependencyRules": {
      "allowAny": ["vite"],
      "allowedVersions": { "vite": "*", "vitest": "*" }
    }
  }
}
```

**重要**：

- `overrides.vite` 确保任何依赖到 `vite` 的包都会改为使用 `vite-plus`
- 对于没有现有配置的 pnpm，`overrides` 和 `peerDependencyRules` 会写入 `pnpm-workspace.yaml`
- 对于在 `package.json` 中已有 `pnpm` 配置的 pnpm，会尊重现有位置
- 将 `import from 'vite'` 重写为 `import from 'vite-plus'`
- 将 `import from 'vite/{name}'` 重写为 `import from 'vite-plus/{name}'`，例如：将 `import from 'vite/module-runner'` 重写为 `import from 'vite-plus/module-runner'`
- 将 `import from 'vitest'` 重写为 `import from 'vite-plus/test'`
- 将 `import from 'vitest/config'` 重写为 `import from 'vite-plus'`
- 将 `import from 'vitest/{name}'` 重写为 `import from 'vite-plus/test/{name}'`，例如：将 `import from 'vitest/node'` 重写为 `import from 'vite-plus/test/node'`
- 将 `import from '@vitest/browser'` 重写为 `import from 'vite-plus/test/browser'`
- 将 `import from '@vitest/browser/{name}'` 重写为 `import from 'vite-plus/test/browser/{name}'`，例如：将 `import from '@vitest/browser/context'` 重写为 `import from 'vite-plus/test/browser/context'`
- 将 `import from '@vitest/browser-playwright'` 重写为 `import from 'vite-plus/test/browser-playwright'`
- 将 `import from '@vitest/browser-playwright/{name}'` 重写为 `import from 'vite-plus/test/browser-playwright/{name}'`
- `declare module 'vitest'`、`declare module 'vitest/{name}'` 和 `declare module '@vitest/browser*'` 有意**不**重写——`vite-plus/test*` 只是对上游 `vitest*` 的薄封装重导出，因此类型扩展必须指向上游模块标识才能正确合并

**注意**：对于 Yarn，请使用 `resolutions` 而不是 `overrides`。

### Oxlint 配置

**迁移前（.oxlintrc）：**

```json
{
  "rules": {
    "no-unused-vars": "error",
    "no-console": "warn"
  },
  "ignorePatterns": ["dist", "node_modules"]
}
```

**迁移后（合并到 vite.config.ts）：**

```typescript
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [],

  // Oxlint 配置
  lint: {
    options: {
      typeAware: true,
      typeCheck: true,
    },
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
    },
    ignorePatterns: ['dist', 'node_modules'],
  },
});
```

> **注意**：如果 `tsconfig.json` 包含 `compilerOptions.baseUrl`，Vite+ 会在启用 `typeAware` 和 `typeCheck` 之前先运行 `vp dlx @andrewbranch/ts5to6 --fixBaseUrl .`。如果该修复失败或被拒绝，Vite+ 会跳过这些选项，因为 oxlint 的 TypeScript 检查器目前还不支持 `baseUrl`。

### Oxfmt 配置

**迁移前（.oxfmtrc）：**

```json
{
  "printWidth": 100,
  "tabWidth": 2,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5"
}
```

**迁移后（合并到 vite.config.ts）：**

```typescript
import { defineConfig } from 'vite-plus';

export default defineConfig({
  plugins: [],

  // Oxfmt 配置
  fmt: {
    printWidth: 100,
    tabWidth: 2,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
  },
});
```

### import 命名空间改为 vite-plus

影响文件：

- vitest.config.ts
- vite.config.ts

**迁移前（从 'vitest/config' 导入）：**

```typescript
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
  },
});
```

**迁移后（从 'vite-plus' 导入）：**

```typescript
import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    globals: true,
  },
});
```

**迁移前（从 'vite' 导入）：**

```typescript
import { defineConfig } from 'vite';

export default defineConfig({
  test: {
    globals: true,
  },
});
```

**迁移后（从 'vite-plus' 导入）：**

```typescript
import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    globals: true,
  },
});
```

### 完整示例

**迁移前：**

```
my-package/
├── package.json              # 包含 vite、vitest、oxlint、oxfmt
├── vite.config.ts            # Vite 配置
├── vitest.config.ts          # Vitest 配置
├── .oxlintrc                 # Oxlint 配置
├── .oxfmtrc                  # Oxfmt 配置
└── src/
```

**迁移后：**

```
my-package/
├── package.json              # 仅包含 vite-plus
├── vitest.config.ts          # Vitest 配置
├── vite.config.ts            # 统一配置（全部已合并）
└── src/
```

**vite.config.ts（迁移后）：**

```typescript
// 从 'vite' 导入仍然可用 —— overrides 会将其映射到 vite-plus
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite-plus';

export default defineConfig({
  // Vite 配置
  plugins: [react()],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },

  // 从 .oxlintrc 合并的 lint 配置
  lint: {
    rules: {
      'no-unused-vars': 'error',
      'no-console': 'warn',
    },
    ignorePatterns: ['dist', 'node_modules'],
  },

  // 从 .oxfmtrc 合并的 format 配置
  fmt: {
    printWidth: 100,
    tabWidth: 2,
    semi: true,
    singleQuote: true,
    trailingComma: 'es5',
  },
});
```

**vitest.config.ts（迁移后）：**

```typescript
import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    globals: true,
  },
});
```

## 单仓库配置迁移

### 针对 pnpm

对于单仓库项目以及在 `package.json` 中没有现有 `pnpm` 配置的独立项目，`overrides`、`peerDependencyRules` 和 `catalog` 会写入 `pnpm-workspace.yaml`。对于在 `package.json` 中已有 `pnpm` 配置的项目，则继续使用 `package.json`。

`pnpm-workspace.yaml`

```yaml
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@latest
  vite-plus: latest
overrides:
  vite: 'catalog:'
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: '*'
    vitest: '*'
```

### 针对 npm

`package.json`

```json
{
  "devDependencies": {
    "vite": "npm:@voidzero-dev/vite-plus-core@latest"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@latest"
  }
}
```

### 针对 yarn 4.10.0+（需要 catalog 支持）

`.yarnrc.yml`

```yaml
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@latest
```

`package.json`

```json
{
  "resolutions": {
    "vite": "catalog:"
  }
}
```

### 针对 yarn v1（尚不支持）

待办：添加对 yarn v1 的支持

## 成功标准

一次成功的迁移应当：

1. ✅ 将所有独立工具依赖替换为 vite-plus
2. ✅ **添加 package.json overrides**，强制将 vite → vite-plus（用于传递依赖）
3. ✅ **转换 vitest 导入** 为 vite/test（因为 vitest 已被移除）
4. ✅ 将所有配置合并到 vite.config.ts 中
5. ✅ 保留所有用户自定义内容和设置
6. ✅ 移除冗余的配置文件
7. ✅ 提供清晰的反馈和后续步骤
8. ✅ 高效处理单仓库迁移
9. ✅ 安全且透明地说明所做的更改

## ESLint 迁移

当检测到 ESLint flat config（`eslint.config.{js,mjs,cjs,ts,mts,cts}`）和 `eslint` 依赖时，`vp migrate` 会提供将 ESLint 配置通过 [`@oxlint/migrate`](https://www.npmjs.com/package/@oxlint/migrate) 转换为 oxlint 的选项。

**流程**：ESLint → oxlint（通过 `@oxlint/migrate`）→ vite+（现有合并流程）

**步骤**：

1. 运行 `vpx @oxlint/migrate --merge --type-aware --with-nursery --details` 以生成 `.oxlintrc.json`
2. 运行 `vpx @oxlint/migrate --replace-eslint-comments` 以替换 `eslint-disable` 注释
3. 删除 ESLint 配置文件
4. 从 `devDependencies` 中移除 `eslint`
5. 将 `package.json` 中的 `eslint` 脚本重写为 `vp lint`，并去除仅限 ESLint 的标志
6. 重写 lint-staged 配置中的 `eslint` 引用（包括 `package.json` 的 `lint-staged` 字段以及独立配置文件，如 `.lintstagedrc.json`）
7. 现有的迁移流程会拾取 `.oxlintrc.json` 并将其合并到 `vite.config.ts` 中

**脚本重写**（由 [brush-parser](https://github.com/reubeno/brush) 提供 shell AST 解析支持）：

| 之前                                     | 之后                                        |
| ---------------------------------------- | ------------------------------------------- |
| `eslint .`                               | `vp lint .`                                 |
| `eslint --cache --ext .ts --fix .`       | `vp lint --fix .`                           |
| `NODE_ENV=test eslint --cache .`         | `NODE_ENV=test vp lint .`                   |
| `cross-env NODE_ENV=test eslint --cache .` | `cross-env NODE_ENV=test vp lint .`         |
| `eslint . && vite build`                 | `vp lint . && vite build`                   |
| `if [ -f .eslintrc ]; then eslint .; fi` | `if [ -f .eslintrc ]; then vp lint . fi`    |
| `npx eslint .`                           | `npx eslint .`（保留 npx/bunx 包装器）      |

已移除的仅 ESLint 标志：`--cache`、`--ext`、`--parser`、`--parser-options`、`--plugin`、`--rulesdir`、`--resolve-plugins-relative-to`、`--output-file`、`--env`、`--no-eslintrc`、`--no-error-on-unmatched-pattern`、`--debug`、`--no-inline-config`

重写器会处理：

- **复合命令**：`&&`、`||`、`|`、`if/then/fi`、`while/do/done`、`for`、`case`、花括号代码块 `{ ...; }`、子 shell `(...)`
- **环境变量前缀**：`NODE_ENV=test eslint .`
- **cross-env 包装器**：`cross-env NODE_ENV=test eslint .`
- **无副作用安全性**：不包含 `eslint` 的脚本将保持不变（不会因 AST 往返而产生格式损坏）

**旧版 ESLint 配置处理**：

如果仅检测到旧版 ESLint 配置（`.eslintrc*`），而未检测到 flat config（`eslint.config.*`），迁移会发出警告并跳过 ESLint 迁移。该警告会引导用户先升级到 ESLint v9，因为 `@oxlint/migrate` 仅支持 flat config：

> 检测到旧版 ESLint 配置（.eslintrc）。自动迁移到 Oxlint 需要 ESLint v9+ 的 flat config 格式（eslint.config.*）。请先升级到 ESLint v9：https://eslint.org/docs/latest/use/migrate-to-9.0.0

**行为**：

- 交互模式：会在前期（阶段 1）提示用户确认，并在后期（阶段 2）执行
- 非交互模式：自动运行，无需提示
- 失败是非阻塞的——会警告并继续执行剩余迁移
- 可重复运行：如果用户一开始拒绝，再次运行 `vp migrate` 时仍会提供 eslint 迁移选项

## Prettier 迁移

当检测到 Prettier 配置文件（`.prettierrc*`、`prettier.config.*`，或 `package.json` 中的 `"prettier"` 键）以及 `prettier` 依赖时，`vp migrate` 会提供使用 `vp fmt --migrate=prettier` 将 Prettier 配置转换为 oxfmt 的选项。

**流程**：Prettier → oxfmt（通过 `vp fmt --migrate=prettier`）→ vite+（现有合并流程）

**步骤**：

1. 运行 `vp fmt --migrate=prettier`，从 Prettier 配置生成 `.oxfmtrc.json`（如果存在独立配置文件，而不是 `package.json#prettier`）
2. 删除所有 Prettier 配置文件（`.prettierrc*`、`prettier.config.*`）
3. 如果存在，则从 package.json 中移除 `"prettier"` 键
4. 从 `devDependencies`/`dependencies` 中移除 `prettier` 和 `prettier-plugin-*`
5. 将 `package.json` 中的 `prettier` 脚本重写为 `vp fmt`，并去除仅限 Prettier 的标志
6. 重写 lint-staged 配置中的 `prettier` 引用
7. 如果存在 `.prettierignore`，则发出警告（Oxfmt 支持它，但推荐使用 `ignorePatterns`）
8. 现有的迁移流程会拾取 `.oxfmtrc.json` 并将其合并到 `vite.config.ts` 中

**脚本重写**（由 [brush-parser](https://github.com/reubeno/brush) 提供 shell AST 解析支持）：

| 之前                                            | 之后                                                  |
| ------------------------------------------------- | ------------------------------------------------------ |
| `prettier .`                                      | `vp fmt .`                                             |
| `prettier --write .`                              | `vp fmt .`                                             |
| `prettier --check .`                              | `vp fmt --check .`                                     |
| `prettier --list-different .`                     | `vp fmt --check .`                                     |
| `prettier -l .`                                   | `vp fmt --check .`                                     |
| `prettier --write --single-quote --tab-width 4 .` | `vp fmt .`                                             |
| `prettier --config .prettierrc --write .`         | `vp fmt .`                                             |
| `prettier --plugin prettier-plugin-tailwindcss .` | `vp fmt .`                                             |
| `cross-env NODE_ENV=test prettier --write .`      | `cross-env NODE_ENV=test vp fmt .`                     |
| `prettier --write . && eslint --fix .`            | `vp fmt . && eslint --fix .`                           |
| `npx prettier --write .`                          | `npx prettier --write .`（保留 npx/bunx 包装器）       |

**已移除的仅 Prettier 标志**：

- 值标志：`--config`、`--ignore-path`、`--plugin`、`--parser`、`--cache-location`、`--cache-strategy`、`--log-level`、`--stdin-filepath`、`--cursor-offset`、`--range-start`、`--range-end`、`--config-precedence`、`--tab-width`、`--print-width`、`--trailing-comma`、`--arrow-parens`、`--prose-wrap`、`--end-of-line`、`--html-whitespace-sensitivity`、`--quote-props`、`--embedded-language-formatting`、`--experimental-ternaries`
- 布尔标志：`--write`、`--cache`、`--no-config`、`--no-editorconfig`、`--with-node-modules`、`--require-pragma`、`--insert-pragma`、`--no-bracket-spacing`、`--single-quote`、`--no-semi`、`--jsx-single-quote`、`--bracket-same-line`、`--use-tabs`、`--debug-check`、`--debug-print-doc`、`--debug-benchmark`、`--debug-repeat`

**已转换标志**：`--list-different` / `-l` → `--check`

**保留的标志**：`--check`、`--fix`、`--no-error-on-unmatched-pattern`、位置参数（文件路径/通配符）

**行为**：

- 交互模式：会在前期（阶段 1）提示用户确认，并在后期（阶段 2）执行
- 非交互模式：自动运行，无需提示
- 失败是非阻塞的——会警告并继续执行剩余迁移
- 可重复运行：如果用户一开始拒绝，再次运行 `vp migrate` 时仍会提供 prettier 迁移选项

## tsconfig.json 清理

在迁移过程中，`vp migrate` 会扫描项目目录中所有 `tsconfig*.json` 文件（非递归），并移除会导致 lint 错误的已弃用选项。

**当前移除的选项**：

- `"esModuleInterop": false` —— 该选项已被 typescript 移除。存在时，`vp lint --type-aware` 会失败并报错：`Option 'esModuleInterop=false' has been removed.`

**行为**：

- 仅移除 `esModuleInterop: false` —— `true` 会保留不变
- 使用 `jsonc-parser` 进行支持 JSONC 的编辑，保留注释和格式
- 扫描所有 `tsconfig*.json` 变体（例如 `tsconfig.json`、`tsconfig.app.json`、`tsconfig.node.json`）
- 作为配置重写阶段的一部分自动运行——无需用户提示

## 参考资料

### 代码转换

- [ast-grep](https://ast-grep.github.io/) - 结构化搜索与替换工具
- [Turborepo Codemods](https://turborepo.com/docs/reference/turbo-codemod) - 类似的迁移方法
- [jscodeshift](https://github.com/facebook/jscodeshift) - 替代性的 AST 转换工具

### 工具

- [@ast-grep/napi](https://www.npmjs.com/package/@ast-grep/napi) - ast-grep 的 Node.js 绑定
- [@oxlint/migrate](https://www.npmjs.com/package/@oxlint/migrate) - ESLint 到 oxlint 的迁移工具
- [brush-parser](https://github.com/reubeno/brush) - 用于脚本重写的 Shell AST 解析器（Rust）
- [@clack/prompts](https://www.npmjs.com/package/@clack/prompts) - 美观的 CLI 提示
- [typescript](https://www.typescriptlang.org/) - 用于解析 TypeScript 配置

### 灵感来源

- [Vue 2 到 Vue 3 迁移](https://v3-migration.vuejs.org/) - 类似的迁移工具
- [React Codemod](https://github.com/reactjs/react-codemod) - React 迁移脚本
- [Angular 更新指南](https://update.angular.io/) - 自动化 Angular 迁移
