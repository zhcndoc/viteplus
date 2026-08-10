# 创建组织捆绑包

## `vp create @your-org:demo --no-interactive --directory my-demo-app`

捆绑模板：解压 tarball，复制子目录

```
◇ 已生成 my-demo-app
• Node <version>  pnpm <version>
→ 下一步：cd my-demo-app && vp run
```

## `vpt print-file my-demo-app/package.json`

验证 package.json 名称已被重写

```
{
  "name": "my-demo-app",
  "version": "0.0.0",
  "scripts": {
    "dev": "vp dev",
    "prepare": "vp config"
  },
  "devDependencies": {
    "vite": "catalog:",
    "vite-plus": "catalog:"
  },
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  }
}
```

## `vpt print-file my-demo-app/src/index.ts`

验证已复制的打包源码

```
export const name = "demo";
```

## `vpt list-dir my-demo-app/README.md`

验证 README 已复制

```
my-demo-app/README.md
```
