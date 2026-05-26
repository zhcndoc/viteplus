# 核心包捆绑架构

本文档说明了 `@voidzero-dev/vite-plus-core` 如何将多个上游项目捆绑为一个统一包。

## 概览

核心包采用一种 **多项目捆绑策略**，整合了 5 个上游项目：

| 项目                    | 源位置                                                         | 用途                      |
| ----------------------- | -------------------------------------------------------------- | ------------------------- |
| `@rolldown/pluginutils` | `rolldown/packages/rolldown/node_modules/@rolldown/pluginutils` | Rolldown 插件工具集       |
| `rolldown`              | `rolldown/packages/rolldown`                                    | Rolldown 打包器           |
| `vite`                  | `vite/packages/vite`                                            | Vite v8 beta              |
| `tsdown`                | `node_modules/tsdown`                                           | TypeScript 构建工具       |
| `vitepress`             | `node_modules/vitepress`                                        | 文档工具                  |

这种方式使用户能够通过单个包访问 Vite、Rolldown 及相关工具，并保持一致的模块标识符重写。

---

## 构建步骤

构建过程按顺序执行 6 个步骤：

### 步骤 1：捆绑 Rolldown Pluginutils（`bundleRolldownPluginutils`）

**操作**：复制预构建的 dist 目录。

```typescript
await cp(join(rolldownPluginUtilsDir, 'dist'), join(projectDir, 'dist', 'pluginutils'), {
  recursive: true,
});
```

**输入**：`rolldown/packages/rolldown/node_modules/@rolldown/pluginutils/dist/`
**输出**：`dist/pluginutils/`

### 步骤 2：捆绑 Rolldown（`bundleRolldown`）

**操作**：复制 dist 目录并重写模块标识符。

**转换**：

- `@rolldown/pluginutils` → `@voidzero-dev/vite-plus-core/rolldown/pluginutils`
- `rolldown/*` → `@voidzero-dev/vite-plus-core/rolldown/*`
- 在发布构建中：`@rolldown/binding-*` → `vite-plus/binding`

**输入**：`rolldown/packages/rolldown/dist/`
**输出**：`dist/rolldown/`

### 步骤 3：构建 Vite（`buildVite`）

**操作**：使用自定义转换进行完整的 Rolldown 构建。

这是最复杂的步骤，使用上游的 `vite-rolldown.config` 并做了如下修改：

1. **过滤外部依赖** - 捆绑 `picomatch`、`tinyglobby`、`fdir`、`rolldown`、`yaml`，而不是将它们保持为外部依赖
2. **添加 RewriteImportsPlugin** - 在构建时重写 vite/rolldown 导入
3. **重写静态路径** - 修复 `VITE_PACKAGE_DIR`、`CLIENT_ENTRY`、`ENV_ENTRY` 常量
4. **复制附加文件** - `misc/`、`.d.ts` 文件、`types/`、`client.d.ts`

**输入**：`vite/packages/vite/`
**输出**：`dist/vite/`

### 步骤 4：捆绑 Tsdown（`bundleTsdown`）

**操作**：使用 CJS 依赖处理重新捆绑 tsdown。

**流程**：

1. 使用 Rolldown 捆绑 `tsdown/dist/run.mjs` 和 `tsdown/dist/index.mjs`
2. 使用 `find-create-require.ts` 检测第三方 CJS 模块
3. 使用 `build-cjs-deps.ts` 捆绑检测到的 CJS 依赖
4. 使用 `rolldown-plugin-dts` 捆绑类型声明

**输入**：`node_modules/tsdown/dist/`
**输出**：`dist/tsdown/`

### 步骤 5：捆绑 Vitepress（`bundleVitepress`）

**操作**：复制 dist 目录并重写 vite 导入。

**转换**：

- `vite` → `@voidzero-dev/vite-plus-core/vite`

**输入**：`node_modules/vitepress/`
**输出**：`dist/vitepress/`

### 步骤 6：合并 Package.json（`mergePackageJson`）

**操作**：合并上游包的元数据并记录捆绑版本。

**更新**：

- `peerDependencies` - 合并自 tsdown 和 vite
- `peerDependenciesMeta` - 合并自 tsdown 和 vite
- `bundledVersions` - 记录 vite、rolldown 和 tsdown 的版本

---

## 模块标识符重写系统

构建使用两种互补的重写机制：

### 构建时重写（RewriteImportsPlugin）

位于 `build-support/rewrite-imports.ts` 中，这个 Rolldown 插件在捆绑期间重写导入：

```typescript
export const RewriteImportsPlugin: Plugin = {
  name: 'rewrite-imports-for-vite-plus',
  resolveId: {
    order: 'pre',
    handler(id: string) {
      if (id.startsWith('vite/')) {
        return { id: id.replace(/^vite\//, `${pkgJson.name}/`), external: true };
      }
      if (id === 'rolldown') {
        return { id: `${pkgJson.name}/rolldown`, external: true };
      }
      if (id.startsWith('rolldown/')) {
        return { id: id.replace(/^rolldown\//, `${pkgJson.name}/rolldown/`), external: true };
      }
    },
  },
};
```

### 构建后重写（AST-grep）

位于 `build-support/rewrite-module-specifiers.ts` 中，这个工具使用 AST-grep 重写已构建文件中的标识符：

| 原始导入                  | 重写后的导入                                         |
| ------------------------- | ---------------------------------------------------- |
| `vite`                    | `@voidzero-dev/vite-plus-core`                        |
| `vite/*`                  | `@voidzero-dev/vite-plus-core/*`                      |
| `rolldown`                | `@voidzero-dev/vite-plus-core/rolldown`               |
| `rolldown/*`              | `@voidzero-dev/vite-plus-core/rolldown/*`             |
| `@rolldown/pluginutils`   | `@voidzero-dev/vite-plus-core/rolldown/pluginutils`   |
| `@rolldown/pluginutils/*` | `@voidzero-dev/vite-plus-core/rolldown/pluginutils/*` |

### 发布构建：原生绑定重写

在发布构建期间（`RELEASE_BUILD=1`），会针对 Rolldown 的原生绑定执行额外的关键转换：

```typescript
// 在 bundleRolldown() 中
if (process.env.RELEASE_BUILD) {
  // @rolldown/binding-darwin-arm64 → vite-plus/binding
  source = source.replace(/@rolldown\/binding-([a-z0-9-]+)/g, 'vite-plus/binding');
  // 同步版本字符串
  source = source.replaceAll(`${rolldownBindingVersion}`, pkgJson.version);
}
```

**按平台的绑定重写**：

| 原始导入                          | 重写后的导入        |
| --------------------------------- | ------------------- |
| `@rolldown/binding-darwin-arm64`  | `vite-plus/binding` |
| `@rolldown/binding-darwin-x64`    | `vite-plus/binding` |
| `@rolldown/binding-linux-arm64-gnu` | `vite-plus/binding` |
| `@rolldown/binding-linux-x64-gnu` | `vite-plus/binding` |
| `@rolldown/binding-win32-x64-msvc` | `vite-plus/binding` |

**这很重要，因为**：

1. **自包含分发** - 用户无需单独安装 `@rolldown/binding-*` 包
2. **版本对齐** - rolldown binding 版本与 vite-plus 版本同步
3. **单一原生模块** - `vite-plus/binding` 导出指向 CLI 编译出的 `.node` 文件，其中在 `RELEASE_BUILD=1` 构建时包含 `rolldown_binding`

**解析链**：

```
用户代码导入 '@voidzero-dev/vite-plus-core/rolldown'
  → dist/rolldown/index.mjs
    → 导入 'vite-plus/binding'（从 @rolldown/binding-* 重写而来）
      → vite-plus CLI 包的 ./binding 导出
        → binding/vite-plus.darwin-arm64.node（包含 rolldown_binding）
```

有关 CLI 如何编译 rolldown bindings 的详细信息，请参见 [CLI Package Bundling](../cli/BUNDLING.md#rolldown-native-binding-integration)。

---

## CJS 依赖处理

Tsdown 使用 `createRequire()` 来加载某些 CommonJS 依赖。这些依赖会被检测并特殊处理：

### 检测（`find-create-require.ts`）

使用 `oxc-parser` 查找如下模式：

```javascript
// 模式 1：静态导入
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
require('some-cjs-package');

// 模式 2：全局模块
const require = globalThis.process.getBuiltinModule('module').createRequire(import.meta.url);
require('some-cjs-package');
```

### 捆绑（`build-cjs-deps.ts`）

创建 CJS 入口文件并使用 Rolldown 进行捆绑：

```typescript
// 创建：npm_entry_some_cjs_package.cjs
module.exports = require('some-cjs-package');
```

原始的 `require("some-cjs-package")` 调用会被重写为 `require("./npm_entry_some_cjs_package.cjs")`。

---

## 输出结构

```
dist/
├── pluginutils/           # @rolldown/pluginutils
│   ├── index.js
│   ├── index.d.ts
│   └── filter/
├── rolldown/              # Rolldown 打包器
│   ├── index.mjs
│   ├── index.d.mts
│   ├── config.mjs
│   ├── experimental-index.mjs
│   ├── filter-index.mjs
│   ├── parallel-plugin.mjs
│   ├── parse-ast-index.mjs
│   ├── plugins-index.mjs
│   └── ...
├── vite/                  # Vite
│   ├── node/
│   │   ├── index.js
│   │   ├── index.d.ts
│   │   ├── internal.js
│   │   ├── module-runner.js
│   │   └── chunks/
│   ├── client/
│   │   ├── client.mjs
│   │   └── env.mjs
│   ├── misc/
│   ├── types/
│   └── client.d.ts
├── tsdown/                # TypeScript 构建工具
│   ├── index.js
│   ├── index-types.d.ts
│   ├── run.js
│   └── npm_entry_*.cjs    # 捆绑的 CJS 依赖
└── vitepress/             # 文档工具
    ├── dist/
    ├── types/
    ├── client.d.ts
    ├── theme.d.ts
    └── theme-without-fonts.d.ts
```

---

## 包导出

| 导出路径                     | 指向                                   | 描述                    |
| ------------------------------- | ---------------------------------------- | ----------------------- |
| `.`                             | `./dist/vite/node/index.js`              | Vite 主入口             |
| `./client`                      | types: `./dist/vite/client.d.ts`         | 客户端环境类型          |
| `./dist/client/*`               | `./dist/vite/client/*`                   | 客户端运行时文件        |
| `./internal`                    | `./dist/vite/node/internal.js`           | Vite 内部 API           |
| `./lib`                         | `./dist/tsdown/index.js`                 | Tsdown 库               |
| `./module-runner`               | `./dist/vite/node/module-runner.js`      | Vite 模块运行器         |
| `./rolldown`                    | `./dist/rolldown/index.mjs`              | Rolldown 主入口         |
| `./rolldown/config`             | `./dist/rolldown/config.mjs`             | Rolldown 配置辅助函数   |
| `./rolldown/experimental`       | `./dist/rolldown/experimental-index.mjs` | 实验性功能              |
| `./rolldown/filter`             | `./dist/rolldown/filter-index.mjs`       | 过滤工具                |
| `./rolldown/parallelPlugin`     | `./dist/rolldown/parallel-plugin.mjs`    | 并行插件支持            |
| `./rolldown/parseAst`           | `./dist/rolldown/parse-ast-index.mjs`    | AST 解析                |
| `./rolldown/plugins`            | `./dist/rolldown/plugins-index.mjs`      | 内置插件                |
| `./rolldown/pluginutils`        | `./dist/pluginutils/index.js`            | 插件工具集              |
| `./rolldown/pluginutils/filter` | `./dist/pluginutils/filter/index.js`     | 过滤工具                |
| `./types/*`                     | `./dist/vite/types/*`                    | 类型定义                |

---

## 源目录

| 上游项目               | 源位置                                                            | 关联关系       |
| ---------------------- | ----------------------------------------------------------------- | -------------- |
| `@rolldown/pluginutils` | `../../rolldown/packages/rolldown/node_modules/@rolldown/pluginutils` | npm 依赖       |
| `rolldown`              | `../../rolldown/packages/rolldown`                               | Git 子模块     |
| `vite`                  | `../../vite/packages/vite`                                       | Git 子模块     |
| `tsdown`                | `node_modules/tsdown`                                            | npm 依赖       |
| `vitepress`             | `node_modules/vitepress`                                         | npm 依赖       |

---

## 构建依赖

| 包                    | 作用                                  |
| --------------------- | ------------------------------------- |
| `rolldown`            | 用于构建 vite 和 tsdown 的打包器       |
| `rolldown-plugin-dts` | TypeScript 声明文件打包               |
| `@ast-grep/napi`      | 构建后模块标识符重写                  |
| `oxc-parser`          | tsdown 中的 CJS require 检测         |
| `oxfmt`               | 用于 package.json 的代码格式化       |
| `tinyglobby`          | 用于复制文件的文件 glob 匹配          |

---

## 维护：更新打包版本

### 更新 Vite

1. 将 `vite` Git 子模块更新到新版本
2. 运行 `pnpm -C packages/core build`
3. 验证 `package.json` 中的 `bundledVersions.vite` 已更新
4. 使用 `pnpm test` 进行测试

### 更新 Rolldown

1. 将 `rolldown` Git 子模块更新到新版本
2. 运行 `pnpm -C packages/core build`
3. 验证 `package.json` 中的 `bundledVersions.rolldown` 已更新
4. 使用 `pnpm test` 进行测试

### 更新 Tsdown

1. 更新 `devDependencies` 中的 `tsdown` 版本
2. 运行 `pnpm install`
3. 运行 `pnpm -C packages/core build`
4. 检查是否有新的 CJS 依赖（构建会自动检测它们）
5. 验证 `package.json` 中的 `bundledVersions.tsdown` 已更新
6. 使用 `pnpm test` 进行测试

### 更新 Vitepress

1. 更新 `devDependencies` 中的 `vitepress` 版本
2. 运行 `pnpm install`
3. 运行 `pnpm -C packages/core build`
4. 测试文档构建

---

## 构建命令

```bash
# 构建核心包
pnpm -C packages/core build

# 发布构建（将 @rolldown/binding-* 重写为 vite-plus/binding）
RELEASE_BUILD=1 pnpm -C packages/core build
```

---

## 技术参考

### 构建流程

```
1. bundleRolldownPluginutils()    复制预构建的 dist
2. bundleRolldown()               复制 + 重写模块标识符
3. buildVite()                    进行完整的 Rolldown 构建并应用转换
   ├── 应用 RewriteImportsPlugin     构建时导入重写
   ├── 应用 rewrite-static-paths     修复 VITE_PACKAGE_DIR 常量
   ├── 运行 Rolldown 构建             打包 vite 源码
   └── 复制并重写 .d.ts 文件         构建后标识符重写
4. bundleTsdown()                 重新打包并处理 CJS
   ├── 使用 Rolldown 打包 tsdown     查找 CJS 模块
   ├── buildCjsDeps()                 打包检测到的 CJS 依赖
   └── 使用 dts 插件打包类型         生成声明文件
5. bundleVitepress()              复制 + 重写 vite 导入
6. mergePackageJson()             合并元数据 + 记录版本
```

### 关键常量

```typescript
// 源目录
const rolldownPluginUtilsDir = resolve(
  projectDir,
  '..',
  '..',
  'rolldown',
  'packages',
  'pluginutils',
);
const rolldownSourceDir = resolve(projectDir, '..', '..', 'rolldown', 'packages', 'rolldown');
const rolldownViteSourceDir = resolve(projectDir, '..', '..', 'vite', 'packages', 'vite');
const tsdownSourceDir = resolve(projectDir, 'node_modules/tsdown');

// 用于重写的包名
const targetPackage = '@voidzero-dev/vite-plus-core';
```

### 打包版本跟踪

`package.json` 中的 `bundledVersions` 字段记录了所打包的上游项目的精确版本：

```json
{
  "bundledVersions": {
    "vite": "8.0.0-beta.8",
    "rolldown": "1.0.0-beta.60",
    "tsdown": "0.20.0-beta.4"
  }
}
```

该字段会在每次构建期间由 `mergePackageJson()` 自动更新。
