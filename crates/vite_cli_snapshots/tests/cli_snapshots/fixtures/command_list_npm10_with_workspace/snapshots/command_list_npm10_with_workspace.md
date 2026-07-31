# command_list_npm10_with_workspace

## `vp install`

应首先安装软件包

```
VITE+ - The Unified Toolchain for the Web

added 4 packages, and audited 7 packages in <duration>

found 0 vulnerabilities
```

## `vp pm list --json`

应列出当前工作区根目录的依赖项

```
{
  "version": "1.0.0",
  "name": "command-list-npm10-with-workspace",
  "dependencies": {
    "@vite-plus-test/utils": {
      "version": "1.0.0",
      "resolved": "file:../../packages/utils",
      "overridden": false,
      "dependencies": {
        "testnpm2": {
          "version": "1.0.1",
          "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
          "overridden": false
        }
      }
    },
    "app": {
      "version": "1.0.0",
      "resolved": "file:../packages/app",
      "overridden": false,
      "dependencies": {
        "test-vite-plus-package-optional": {
          "version": "1.0.0",
          "resolved": "https://registry.npmjs.org/test-vite-plus-package-optional/-/test-vite-plus-package-optional-1.0.0.tgz",
          "overridden": false
        },
        "testnpm2": {
          "version": "1.0.1"
        }
      }
    }
  }
}
```

## `vp pm list --recursive --json`

应列出工作区中的所有软件包（使用 `--workspaces`）

```
{
  "version": "1.0.0",
  "name": "command-list-npm10-with-workspace",
  "dependencies": {
    "@vite-plus-test/utils": {
      "version": "1.0.0",
      "resolved": "file:../../packages/utils",
      "overridden": false,
      "dependencies": {
        "testnpm2": {
          "version": "1.0.1",
          "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
          "overridden": false
        }
      }
    },
    "app": {
      "version": "1.0.0",
      "resolved": "file:../packages/app",
      "overridden": false,
      "dependencies": {
        "test-vite-plus-package-optional": {
          "version": "1.0.0",
          "resolved": "https://registry.npmjs.org/test-vite-plus-package-optional/-/test-vite-plus-package-optional-1.0.0.tgz",
          "overridden": false
        },
        "testnpm2": {
          "version": "1.0.1"
        }
      }
    }
  }
}
```

## `vp pm list --filter app --json`

应列出指定的工作区包（使用 --workspace app）

```
{
  "version": "1.0.0",
  "name": "command-list-npm10-with-workspace",
  "dependencies": {
    "app": {
      "version": "1.0.0",
      "resolved": "file:../packages/app",
      "overridden": false,
      "dependencies": {
        "test-vite-plus-package-optional": {
          "version": "1.0.0",
          "resolved": "https://registry.npmjs.org/test-vite-plus-package-optional/-/test-vite-plus-package-optional-1.0.0.tgz",
          "overridden": false
        },
        "testnpm2": {
          "version": "1.0.1",
          "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
          "overridden": false
        }
      }
    }
  }
}
```

## `vp pm list --filter app --filter @vite-plus-test/utils --json`

应列出多个工作区软件包

```
{
  "version": "1.0.0",
  "name": "command-list-npm10-with-workspace",
  "dependencies": {
    "@vite-plus-test/utils": {
      "version": "1.0.0",
      "resolved": "file:../../packages/utils",
      "overridden": false,
      "dependencies": {
        "testnpm2": {
          "version": "1.0.1",
          "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
          "overridden": false
        }
      }
    },
    "app": {
      "version": "1.0.0",
      "resolved": "file:../packages/app",
      "overridden": false,
      "dependencies": {
        "test-vite-plus-package-optional": {
          "version": "1.0.0",
          "resolved": "https://registry.npmjs.org/test-vite-plus-package-optional/-/test-vite-plus-package-optional-1.0.0.tgz",
          "overridden": false
        },
        "testnpm2": {
          "version": "1.0.1"
        }
      }
    }
  }
}
```

## `vp pm list --recursive --depth 0 --json`

应列出具有深度限制的工作区软件包

```
{
  "version": "1.0.0",
  "name": "command-list-npm10-with-workspace",
  "dependencies": {
    "@vite-plus-test/utils": {
      "version": "1.0.0",
      "resolved": "file:../../packages/utils",
      "overridden": false,
      "dependencies": {
        "testnpm2": {
          "version": "1.0.1",
          "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
          "overridden": false
        }
      }
    },
    "app": {
      "version": "1.0.0",
      "resolved": "file:../packages/app",
      "overridden": false,
      "dependencies": {
        "test-vite-plus-package-optional": {
          "version": "1.0.0",
          "resolved": "https://registry.npmjs.org/test-vite-plus-package-optional/-/test-vite-plus-package-optional-1.0.0.tgz",
          "overridden": false
        },
        "testnpm2": {
          "version": "1.0.1"
        }
      }
    }
  }
}
```
