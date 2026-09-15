# migration_setup_vp_version

## `vpt mkdir -p .github/workflows`


## `vpt cp workflow.txt .github/workflows/ci.yml`


## `vp migrate --no-interactive`

现有的 Vite+ 项目升级冻结的 setup-vp 标签

```
VITE+ - The Unified Toolchain for the Web

◇ Updated . to Vite+ <version>
• Node <version>  npm <version>
• Dependencies:
    vite   → <version>
• setup-vp updated to <version> in 1 GitHub Actions file
```

## `vpt print-file .github/workflows/ci.yml`

工作流使用确切的 setup-vp 发布版本

```
name: CI

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: voidzero-dev/setup-vp@<version>
        with:
          cache: true
      - run: vp test
```

## `vp migrate --no-interactive`

setup-vp 迁移具有幂等性

```
VITE+ - The Unified Toolchain for the Web

This project is already using Vite+! Happy coding!
```

## `vpt print-file .github/workflows/ci.yml`

确切的 setup-vp 发布版本保持不变

```
name: CI

on: [push]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v6
      - uses: voidzero-dev/setup-vp@<version>
        with:
          cache: true
      - run: vp test
```
