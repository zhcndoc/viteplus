# 维护

## 发布预览包

为 PR 添加 `preview-build` 标签。每个带标签的提交都会以 npm 版本 `0.0.0-commit.<sha>` 发布到
[registry bridge](https://registry-bridge.viteplus.dev/-/refs)；PR 会附带一条置顶评论，其中包含确切的版本和安装步骤。

使用安装脚本安装预览构建（PR 编号或 commit sha）：

```sh
curl -fsSL https://vite.plus | VP_PR_VERSION=1569 bash
```

或者通过 bridge registry 将其固定在项目中（`.npmrc`：
`registry=https://registry-bridge.viteplus.dev/`）：

```sh
pnpm add vite-plus@0.0.0-commit.<sha>
```
