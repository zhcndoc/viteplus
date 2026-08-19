# 创建_org_捆绑式_monorepo

## `vp create @your-org:workspace --no-interactive --directory my-mono --git`

打包的 monorepo：解压 tarball，搭建脚手架，注入 create.defaultTemplate

```
◇ 已搭建 my-mono
• Node <version>  pnpm <version>
→ 下一步：cd my-mono && vp run
```

## `vpt print-file my-mono/vite.config.ts`

create.defaultTemplate 自动设置为 @your-org

```
import { defineConfig } from "vite-plus";

export default defineConfig({
  staged: {
    "*": "vp check --fix",
  },
  create: { defaultTemplate: "@your-org" },
  fmt: {},
  lint: {
    jsPlugins: [{ name: "vite-plus", specifier: "vite-plus/oxlint-plugin" }],
    rules: { "vite-plus/prefer-vite-plus-imports": "error" },
    options: { typeAware: true, typeCheck: true },
  },
  run: { cache: true },
});
```

## `vpt print-file my-mono/pnpm-workspace.yaml`

工作区标记已保留

```
packages:
  - apps/*
  - packages/*
catalog:
  vite: npm:@voidzero-dev/vite-plus-core@<version>
  vite-plus: <version>
overrides:
  vite@*: "catalog:"
peerDependencyRules:
  allowAny:
    - vite
  allowedVersions:
    vite: "*"
```

## `vpt stat-file my-mono/.git --assert dir`

git-init 提示覆盖了捆绑的 monorepo 路径

```
my-mono/.git: dir
```

## `vpt print-file my-mono/.gitignore`

即使 tarball 未包含 .gitignore，也排除了 node_modules

```
node_modules

# dotenv 环境变量文件
.env
.env.*
!.env.example
```
