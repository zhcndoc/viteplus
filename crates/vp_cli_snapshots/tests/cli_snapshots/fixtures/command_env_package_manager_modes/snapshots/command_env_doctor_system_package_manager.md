# command_env_doctor_system_package_manager

系统优先的检查命令必须使用可用的系统管理器，而无需通过注册表解析其项目范围。

## `vpt write-file package.json '{"name":"doctor-system-package-manager","private":true,"devEngines":{"packageManager":{"name":"pnpm","version":"^10.0.0"}}}
'`


## `vpt chmod +x system-bin/pnpm`


## `vp env off pnpm`


## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-bin${PATH_SEPARATOR}${PATH} NPM_CONFIG_REGISTRY=http://127.0.0.1:9 node print-doctor-configuration.cjs pnpm`

doctor 报告系统 pnpm 二进制文件，未解析所声明的范围

```
Configuration
  ✓ Package manager   system-first mode

PATH
  ✓ vp                in PATH
  ✓ pnpm              ~/.vite-plus/bin/pnpm (vp shim)
  ✓ pnpx              ~/.vite-plus/bin/pnpx (vp shim)

Package Manager Resolution
  Source            system PATH
  Version           pnpm@10.18.0
  ✓ PM binary         <workspace>/system-bin/pnpm
```

## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-bin${PATH_SEPARATOR}${PATH} NPM_CONFIG_REGISTRY=http://127.0.0.1:9 vp env current pnpm --json`

current 报告相同的系统 pnpm 选择

```
{
  "package_manager": {
    "name": "pnpm",
    "version": "<version>",
    "source": "system PATH",
    "project_root": "<workspace>",
    "bin_paths": {
      "pnpm": "<workspace>/system-bin/pnpm"
    },
    "installed": true,
    "mode": "system_first"
  }
}
```

## `PATH=${VP_HOME}/bin${PATH_SEPARATOR}${workspace}/system-bin${PATH_SEPARATOR}${PATH} NPM_CONFIG_REGISTRY=http://127.0.0.1:9 vp env print pnpm`

print 导出系统 pnpm 目录

```
VITE+ - The Unified Toolchain for the Web

# Add to your shell to use this environment for this session:
export PATH="<workspace>/system-bin:$PATH"
```
