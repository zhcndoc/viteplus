# CLI 帮助消息本地化

## `vp -h`

显示帮助信息

```
VITE+ - 面向 Web 的统一工具链

用法: vp <COMMAND>

Core Commands:
  create         Create a new project from a template
  migrate        Migrate an existing project to Vite+
  dev            Run the development server
  build          Build for production
  test           Run tests
  lint           Lint code
  fmt, format    Format code
  check          Run format, lint, and type checks
  pack           Build library
  run            Run tasks
  exec           Execute a command from local node_modules/.bin
  preview        Preview production build
  cache          Manage the task cache
  config         Configure hooks and agent integration
  hooks          Manage the Git hook dispatcher
  staged         Run linters on staged files
  toolchain      Show Vite+ tool versions and relationships

包管理器命令:
  install    安装所有依赖；如果提供了包名，则添加包

选项:
  -C <DIR>    在 <DIR> 中运行 vp，就像从该目录而不是当前工作目录启动 vp
  -h, --help  显示帮助信息
```

## `vp -V`

显示版本

```
VITE+ - Web 统一工具链

vp <版本>

本地 vite-plus：
  vite-plus  未找到
```
