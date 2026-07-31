# 命令_运行脚本_vite程序

## `node setup-bin.js`


## `vp run dev`

应运行 vite 二进制文件，而不是解析为 vp 子命令

```
VITE+ - The Unified Toolchain for the Web

$ vite ⊘ cache disabled
vite
```

## `vp run dev-help`

应运行 vite -h，而不是解析为 vp 子命令

```
VITE+ - The Unified Toolchain for the Web

$ vite -h ⊘ cache disabled
vite -h
```

## `vp run dev-version`

应运行 vite --version，而不是解析为 vp 子命令

```
VITE+ - The Unified Toolchain for the Web

$ vite --version ⊘ cache disabled
vite --version
```

## `vp run hello-vpr`

脚本中的 vpr 应在会话内合成

```
VITE+ - The Unified Toolchain for the Web

$ echo hello from script ⊘ cache disabled
hello from script
```

## `vp run ready`

链式 vpr 命令都应被合成

```
VITE+ - The Unified Toolchain for the Web

$ echo hello from script ⊘ cache disabled
hello from script

$ vite --version ⊘ cache disabled
vite --version

---
vp run: 0/2 cache hit (0%). (Run `vp run --last-details` for full details)
```
