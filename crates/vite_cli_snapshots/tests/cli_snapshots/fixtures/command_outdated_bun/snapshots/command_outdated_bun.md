# command_outdated_bun

## `vp outdated --help`

应显示帮助信息

```
VITE+ - Web 的统一工具链

用法：vp outdated [选项] [包]... [-- <传递参数>...]

检查过时的包

参数：
  [包]...                  要检查的包名称
  [传递参数]...            要传递给包管理器的其他参数

选项：
  --long                   显示扩展信息
  --format <格式>          输出格式：table（默认）、list 或 json
  -r, --recursive          递归检查所有工作区
  --filter <模式>          筛选单体仓库中的包
  -w, --workspace-root     包含工作区根目录
  -P, --prod               仅检查生产依赖和可选依赖
  -D, --dev                仅检查开发依赖
  --no-optional            排除可选依赖
  --compatible              仅显示兼容版本
  --sort-by <字段>         按字段对结果排序
  -g, --global             检查全局安装的包
  --concurrency <并发数>   并行执行的全局包检查数量（仅与 -g 一起使用）
  -h, --help               显示帮助信息

文档：https://viteplus.dev/guide/install
```

## `vp install`

应先安装软件包

```
VITE+ - Web 统一工具链

bun install <version> (af24e281)

 test-vite-plus-top-package@1.0.0 (<version> 可用)
 test-vite-plus-other-optional@1.0.0 (<version> 可用)
 testnpm2@1.0.0 (<version> 可用)

已安装 4 个软件包 [<duration>]
```

## `vp outdated testnpm2`

应显示过时的软件包

```
bun outdated <version> (af24e281)
┌──────────┬─────────┬────────┬────────┐
│ Package  │ Current │ Update │ Latest │
├──────────┼─────────┼────────┼────────┤
│ testnpm2 │ 1.0.0   │ 1.0.0  │ 1.0.1  │
└──────────┴─────────┴────────┴────────┘
```

## `vp outdated -r`

应支持递归输出

```
bun outdated <version> (af24e281)
┌──────────────────────────────────────────┬─────────┬────────┬────────┬──────────────────────┐
│ Package                                  │ Current │ Update │ Latest │ Workspace            │
├──────────────────────────────────────────┼─────────┼────────┼────────┼──────────────────────┤
│ testnpm2                                 │ 1.0.0   │ 1.0.0  │ 1.0.1  │ command-outdated-bun │
├──────────────────────────────────────────┼─────────┼────────┼────────┼──────────────────────┤
│ test-vite-plus-top-package (dev)         │ 1.0.0   │ 1.0.0  │ 1.1.0  │ command-outdated-bun │
├──────────────────────────────────────────┼─────────┼────────┼────────┼──────────────────────┤
│ test-vite-plus-other-optional (optional) │ 1.0.0   │ 1.0.0  │ 1.1.0  │ command-outdated-bun │
└──────────────────────────────────────────┴─────────┴────────┴────────┴──────────────────────┘
```
