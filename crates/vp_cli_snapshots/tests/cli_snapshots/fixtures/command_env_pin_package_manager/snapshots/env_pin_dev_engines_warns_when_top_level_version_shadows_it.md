# env_pin_dev_engines_warns_when_top_level_version_shadows_it

## `vpt write-file package.json '{"name":"command-env-pin-package-manager","private":true,"packageManager":"pnpm@10.18.0"}
'`


## `vp env pin pnpm@11.0.0 --target dev-engines --no-install --force`

固定一个被遮蔽的同系列 devEngines 版本，说明哪个声明仍然生效

```
VITE+ - The Unified Toolchain for the Web

✓ Pinned package manager to pnpm@11.0.0
warn: Top-level packageManager pnpm@10.18.0 remains effective; remove or update it to use devEngines.packageManager pnpm@11.0.0.
note: Package manager will be downloaded on first use.
```

## `vpt print-file package.json`

两个明确指定目标的声明均保持不变，仅新增了 devEngines 固定版本

```
{
  "name": "command-env-pin-package-manager",
  "private": true,
  "packageManager": "pnpm@10.18.0",
  "devEngines": {
    "packageManager": {
      "name": "pnpm",
      "version": "<version>",
      "onFail": "download"
    }
  }
}
```
