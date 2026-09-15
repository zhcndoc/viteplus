# command_env_doctor_package_manager_modes

Doctor 可以合并相同的系列模式，但只要其中一个包管理器的模式不同，就必须立即显示各系列的独立行

## `node print-doctor-configuration.cjs`

当所有模式都匹配时，doctor 保留一个包管理器行

```
Configuration
  ✓ Node.js           managed mode
  ✓ Package manager   managed mode
```

## `vp env off pnpm`


## `node print-doctor-configuration.cjs`

当包管理器的模式不同时，doctor 会分别显示每个包管理器

```
Configuration
  ✓ Node.js           managed mode
  ✓ npm               managed mode
  ✓ pnpm              system-first mode
  ✓ Yarn              managed mode
  ✓ Bun               managed mode
```
