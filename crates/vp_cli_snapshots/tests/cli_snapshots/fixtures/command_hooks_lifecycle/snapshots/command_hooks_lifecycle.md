# 命令钩子生命周期

## `git init`


## `vp hooks status`

启用前未设置偏好

```
偏好：          未设置
Hooks 目录：    .vite-hooks
core.hooksPath： （未设置）
Dispatcher：    缺失（.vite-hooks/_）
项目 Hooks：    pre-commit
```

## `vp hooks enable`

安装调度器

```
Git 钩子调度器已安装到 .vite-hooks/_
```

## `vp hooks status`

启用后偏好设置已启用

```
偏好设置：     已启用
Hooks 目录：    .vite-hooks
core.hooksPath: .vite-hooks/_（Vite+ 调度器）
调度器：        已安装（.vite-hooks/_）
项目 Hooks：    pre-commit
```

## `git config --local core.hooksPath`

应为 .vite-hooks/_

```
.vite-hooks/_
```

## `vp hooks disable`

拆除并持久化偏好设置

```
Git hooks disabled: recorded disable preference (local git config); unset core.hooksPath (was ".vite-hooks/_"); removed .vite-hooks/_. Project-owned hooks under .vite-hooks/ and staged config were left unchanged. Run `vp hooks enable` to re-enable.
```

## `vp hooks status`

偏好设置已禁用（本地）

```
Preference:     disabled (local)
Hooks dir:      .vite-hooks
core.hooksPath: (unset)
Dispatcher:     missing (.vite-hooks/_)
Project hooks:  pre-commit
```

## `vpt stat-file .vite-hooks/_/pre-commit --assert missing`

调度器已移除

```
.vite-hooks/_/pre-commit: missing
```

## `vpt print-file .vite-hooks/pre-commit`

项目所有的钩子保持不变

```
vp staged
```

## `npm_lifecycle_event=prepare vp config --no-agent`

类似 prepare 的配置应跳过重新安装

```
跳过安装（钩子已禁用；运行 `vp hooks enable` 以重新启用）
```

## `vpt stat-file .vite-hooks/_/pre-commit --assert missing`

在 vp 配置后仍然缺失

```
.vite-hooks/_/pre-commit: missing
```

## `vp hooks enable`

禁用后重新启用

```
Git hook dispatcher installed at .vite-hooks/_
```

## `vp hooks status`

偏好设置再次启用

```
偏好设置：     已启用
钩子目录：      .vite-hooks
core.hooksPath: .vite-hooks/_（Vite+ 调度器）
调度器：        已安装（.vite-hooks/_）
项目钩子：      pre-commit
```

## `git config --local core.hooksPath`

调度器已恢复

```
.vite-hooks/_
```
