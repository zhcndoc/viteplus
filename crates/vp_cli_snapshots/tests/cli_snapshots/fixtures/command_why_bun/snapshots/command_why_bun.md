# 为什么选择 Bun

## `vp why --help`

应显示帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法：vp why [选项] <软件包>... [-- <透传参数>...]

显示安装某个软件包的原因

参数：
  <软件包>...             要检查的软件包
  [透传参数]...            要传递给软件包管理器的其他参数

选项：
  --json                   以 JSON 格式输出
  --long                   显示扩展信息
  --parseable              显示可解析的输出
  -r, --recursive          跨所有工作区递归检查
  --filter <模式>          筛选 monorepo 中的软件包
  -w, --workspace-root     在工作区根目录中检查
  -P, --prod               仅检查生产依赖
  -D, --dev                仅检查开发依赖
  --depth <深度>           限制依赖树深度
  --no-optional            排除可选依赖
  --exclude-peers          排除对等依赖
  --find-by <查找器名称>   使用 .pnpmfile.cjs 中定义的查找器函数
  -h, --help               显示帮助

文档：https://viteplus.dev/guide/install
```

## `vp install`

应先安装软件包

```
VITE+ - 面向 Web 的统一工具链

bun install <version>（af24e281）

 test-vite-plus-package@1.0.0
 test-vite-plus-package-optional@1.0.0
 testnpm2@1.0.1

已安装 3 个软件包 [<duration>]
```

## `vp why testnpm2`

应显示软件包为何被安装

```
testnpm2@1.0.1
  └─ command-why-bun (requires 1.0.1)
```
