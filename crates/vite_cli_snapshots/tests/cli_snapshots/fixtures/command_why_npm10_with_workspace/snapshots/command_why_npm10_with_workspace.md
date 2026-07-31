# 在工作区中使用 npm10 的 why 命令

## `vp install`

```
VITE+ - Web 的统一工具链

已添加 6 个包，并在 <duration> 内审计了 9 个包

发现 0 个漏洞
```

## `vp why testnpm2 --filter app`

应使用 --workspace 检查特定工作区中的依赖原因

```
testnpm2@1.0.0
node_modules/testnpm2
  testnpm2@"1.0.0" from @vite-plus-test/utils@undefined
  packages/utils
    @vite-plus-test/utils@undefined
    node_modules/@vite-plus-test/utils
      @vite-plus-test/utils@"*" from app@undefined
      packages/app
        app@undefined
        node_modules/app
          workspace packages/app from the root project
      workspace packages/utils from the root project
  testnpm2@"1.0.0" from app@undefined
  packages/app
    app@undefined
    node_modules/app
      workspace packages/app from the root project
  testnpm2@"1.0.0" from the root project
```

## `vp why test-vite-plus-package --filter app`

应检查 app 工作区中的开发依赖

```
test-vite-plus-package@1.0.0 dev
node_modules/test-vite-plus-package
  dev test-vite-plus-package@"1.0.0" from app@undefined
  packages/app
    app@undefined
    node_modules/app
      workspace packages/app from the root project
```

## `vp why testnpm2 --filter app --json`

应支持使用工作区筛选器输出 JSON

```
[
  {
    "name": "testnpm2",
    "version": "1.0.0",
    "location": "node_modules/testnpm2",
    "isWorkspace": false,
    "dependents": [
      {
        "type": "prod",
        "name": "testnpm2",
        "spec": "1.0.0",
        "from": {
          "name": "@vite-plus-test/utils",
          "errors": [
            {}
          ],
          "package": {
            "name": "@vite-plus-test/utils",
            "dependencies": {
              "testnpm2": "1.0.0"
            }
          },
          "location": "packages/utils",
          "isWorkspace": true,
          "dependents": [],
          "linksIn": [
            {
              "name": "@vite-plus-test/utils",
              "errors": [
                {}
              ],
              "package": {
                "name": "@vite-plus-test/utils",
                "dependencies": {
                  "testnpm2": "1.0.0"
                }
              },
              "location": "node_modules/@vite-plus-test/utils",
              "isWorkspace": true,
              "dependents": [
                {
                  "type": "prod",
                  "name": "@vite-plus-test/utils",
                  "spec": "*",
                  "from": {
                    "name": "app",
                    "errors": [
                      {}
                    ],
                    "package": {
                      "name": "app",
                      "dependencies": {
                        "@vite-plus-test/utils": "*",
                        "test-vite-plus-install": "1.0.0",
                        "testnpm2": "1.0.0"
                      },
                      "devDependencies": {
                        "test-vite-plus-package": "1.0.0"
                      },
                      "optionalDependencies": {
                        "test-vite-plus-other-optional": "1.0.0"
                      }
                    },
                    "location": "packages/app",
                    "isWorkspace": true,
                    "dependents": [],
                    "linksIn": [
                      {
                        "name": "app",
                        "errors": [
                          {}
                        ],
                        "package": {
                          "dependencies": {
                            "@vite-plus-test/utils": "*",
                            "test-vite-plus-install": "1.0.0",
                            "testnpm2": "1.0.0"
                          },
                          "devDependencies": {
                            "test-vite-plus-package": "1.0.0"
                          },
                          "optionalDependencies": {
                            "test-vite-plus-other-optional": "1.0.0"
                          },
                          "name": "app"
                        },
                        "location": "node_modules/app",
                        "isWorkspace": true,
                        "dependents": [
                          {
                            "type": "workspace",
                            "name": "app",
                            "spec": "file:<workspace>/packages/app",
                            "from": {
                              "location": "<workspace>"
                            }
                          }
                        ]
                      }
                    ]
                  }
                },
                {
                  "type": "workspace",
                  "name": "@vite-plus-test/utils",
                  "spec": "file:<workspace>/packages/utils",
                  "from": {
                    "location": "<workspace>"
                  }
                }
              ]
            }
          ]
        }
      },
      {
        "type": "prod",
        "name": "testnpm2",
        "spec": "1.0.0",
        "from": {
          "name": "app",
          "errors": [
            {}
          ],
          "package": {
            "name": "app",
            "dependencies": {
              "@vite-plus-test/utils": "*",
              "test-vite-plus-install": "1.0.0",
              "testnpm2": "1.0.0"
            },
            "devDependencies": {
              "test-vite-plus-package": "1.0.0"
            },
            "optionalDependencies": {
              "test-vite-plus-other-optional": "1.0.0"
            }
          },
          "location": "packages/app",
          "isWorkspace": true,
          "dependents": [],
          "linksIn": [
            {
              "name": "app",
              "errors": [
                {}
              ],
              "package": {
                "dependencies": {
                  "@vite-plus-test/utils": "*",
                  "test-vite-plus-install": "1.0.0",
                  "testnpm2": "1.0.0"
                },
                "devDependencies": {
                  "test-vite-plus-package": "1.0.0"
                },
                "optionalDependencies": {
                  "test-vite-plus-other-optional": "1.0.0"
                },
                "name": "app"
              },
              "location": "node_modules/app",
              "isWorkspace": true,
              "dependents": [
                {
                  "type": "workspace",
                  "name": "app",
                  "spec": "file:<workspace>/packages/app",
                  "from": {
                    "location": "<workspace>"
                  }
                }
              ]
            }
          ]
        }
      },
      {
        "type": "prod",
        "name": "testnpm2",
        "spec": "1.0.0",
        "from": {
          "location": "<workspace>"
        }
      }
    ],
    "dev": false,
    "optional": false,
    "devOptional": false,
    "peer": false,
    "bundled": false,
    "overridden": false
  }
]
```
