# 可运行的根目录原地运行

本身就是可运行应用的工作区根目录不会触发提示：裸的 vp build
会原地运行（提示前行为），不会输出选择器。同一规则的非 TTY 形式由
settings_only_workspace 固定，其 tsdown 输出在 Windows 上字节级稳定（而通过管道传输的 vite build 则不稳定）。

## `vp build`

```
VITE+ - 面向 Web 的统一工具链

✓ 已转换 2 个模块。
正在计算 gzip 大小...
dist/index.html  <size> kB │ gzip: <size> kB

✓ 已在 <duration> 内构建完成
```
