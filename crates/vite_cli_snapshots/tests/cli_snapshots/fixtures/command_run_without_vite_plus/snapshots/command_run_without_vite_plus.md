# 不使用 vite_plus 运行命令

## `vp run hello`

应通过全局的 Vite+ 任务运行器执行

```
VITE+ - The Unified Toolchain for the Web

$ echo hello from script ⊘ cache disabled
hello from script
```

## `vp run greet --arg1 value1`

应传递参数

```
VITE+ - The Unified Toolchain for the Web

$ echo greet --arg1 value1 ⊘ cache disabled
greet --arg1 value1
```

## `vp run nonexistent`

应显示“未找到任务”错误

**退出代码：** 1

```
未找到任务“nonexistent”。
```
