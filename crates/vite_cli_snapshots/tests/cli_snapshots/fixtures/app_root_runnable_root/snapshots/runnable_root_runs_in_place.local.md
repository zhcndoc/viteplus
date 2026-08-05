# 可运行的根目录就地运行

自身就是可运行应用的工作区根目录不会触发选择：裸的 vp build
会就地运行（选择前行为），不会输出选择器。相同规则的非 TTY 形式由
settings_only_workspace 固定，其 tsdown 输出在 Windows 上字节级稳定（而管道化的 vite build 则不稳定）。

## `vp build`

```
✓ 2 modules transformed.
computing gzip size...
dist/index.html  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
