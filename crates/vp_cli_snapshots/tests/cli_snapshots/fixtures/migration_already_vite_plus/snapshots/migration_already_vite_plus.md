# 迁移到已有的 Vite Plus

## `vp migrate --no-interactive`

普通现有项目会移除过时的包装器覆盖设置，不会默认配置 hooks/agent

```
VITE+ - Web 的统一工具链

◇ 已将 . 更新为 Vite+ <version>
• Node <version>  npm <version>
• 依赖：
    vite-plus  latest → <version>
    vite              → <version>
• 已配置包管理器设置
```

## `vp migrate --no-interactive --hooks --agent agents`

显式设置仍应更新现有的 Vite+ 项目

```
VITE+ - The Unified Toolchain for the Web

◇ Updated . to Vite+ <version>
• Node <version>  npm <version>
• Dependencies:
    vite   → <version>
• 2 config updates applied
```

## `vpt print-file package.json`

应为 vp 配置设置 prepare 脚本

```
{
  "name": "migration-already-vite-plus",
  "devDependencies": {
    "vite-plus": "<version>"
  },
  "overrides": {
    "vite": "npm:@voidzero-dev/vite-plus-core@<version>"
  },
  "devEngines": {
    "packageManager": {
      "name": "npm",
      "version": "<version>",
      "onFail": "download"
    }
  },
  "scripts": {
    "prepare": "vp config"
  }
}
```

## `vpt stat-file AGENTS.md --assert file`

应编写明确的代理指令

```
AGENTS.md: file
```

## `vpt stat-file .vite-hooks/pre-commit --assert file`

应明确写入 pre-commit 钩子

```
.vite-hooks/pre-commit: file
```
