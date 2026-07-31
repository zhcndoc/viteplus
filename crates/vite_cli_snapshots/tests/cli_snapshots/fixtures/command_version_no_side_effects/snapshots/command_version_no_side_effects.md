# 命令版本无副作用

## `vp --version`

应输出版本

```
VITE+ - Web 统一工具链

vp <version>

本地 vite-plus：
  vite-plus  <version>

工具：
  vite             <version>
  rolldown         <version>
  vitest           <version>
  oxfmt            <version>
  oxlint           <version>
  oxlint-tsgolint  <version>
  tsdown           <version>

环境：
  包管理器         未找到
  Node.js          <version>
```

## `vpt stat-file .node-version --assert missing`

.node-version 无副作用

```
.node-version: missing
```
