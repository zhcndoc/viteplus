# command_list_npm10

## `vp install`

应先安装软件包

```
VITE+ - 面向 Web 的统一工具链

已添加 3 个软件包，并在 <duration> 内审计了 4 个软件包

发现 0 个漏洞
```

## `vp pm list --json`

应列出已安装的软件包

```
{
  "version": "1.0.0",
  "name": "command-list-npm10",
  "dependencies": {
    "test-vite-plus-package-optional": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package-optional/-/test-vite-plus-package-optional-1.0.0.tgz",
      "overridden": false
    },
    "test-vite-plus-package": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package/-/test-vite-plus-package-1.0.0.tgz",
      "overridden": false
    },
    "testnpm2": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
      "overridden": false
    }
  }
}
```

## `vp pm list testnpm2 --json`

应列出指定的软件包

```
{
  "version": "1.0.0",
  "name": "command-list-npm10",
  "dependencies": {
    "testnpm2": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
      "overridden": false
    }
  }
}
```

## `vp pm list --depth 0 --json`

应列出深度限制为 0 的软件包

```
{
  "version": "1.0.0",
  "name": "command-list-npm10",
  "dependencies": {
    "test-vite-plus-package-optional": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package-optional/-/test-vite-plus-package-optional-1.0.0.tgz",
      "overridden": false
    },
    "test-vite-plus-package": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package/-/test-vite-plus-package-1.0.0.tgz",
      "overridden": false
    },
    "testnpm2": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
      "overridden": false
    }
  }
}
```

## `vp pm list --long --json`

应列出包含扩展信息的软件包

```
{
  "version": "1.0.0",
  "name": "command-list-npm10",
  "devDependencies": {
    "test-vite-plus-package": "1.0.0"
  },
  "peerDependencies": {
    "test-vite-plus-package-optional": "1.0.0"
  },
  "packageManager": "npm@10.8.0",
  "_id": "command-list-npm10@1.0.0",
  "extraneous": false,
  "path": "<workspace>",
  "_dependencies": {
    "testnpm2": "1.0.1"
  },
  "dependencies": {
    "test-vite-plus-package-optional": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package-optional/-/test-vite-plus-package-optional-1.0.0.tgz",
      "overridden": false,
      "name": "test-vite-plus-package-optional",
      "integrity": "sha512-7rJ71VaETMzhK3Iwd14vutJtZt90MqUhu9KwnEEe55htLIIJs/WImI02NopwsV9Ra/Rqld4KkvbvOy6MD0b1sw==",
      "license": "MIT",
      "peer": true,
      "_id": "test-vite-plus-package-optional@1.0.0",
      "extraneous": false,
      "path": "<workspace>/node_modules/test-vite-plus-package-optional",
      "_dependencies": {},
      "devDependencies": {},
      "peerDependencies": {}
    },
    "test-vite-plus-package": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package/-/test-vite-plus-package-1.0.0.tgz",
      "overridden": false,
      "name": "test-vite-plus-package",
      "integrity": "sha512-xj5hJUNL5vihX9TCYXbk8V5r+8MfqG2fDJcRdpQz6tlLob3vkFjsVM8pT5QjTzHS6lBXHd0r9TOMS8+sETjnpw==",
      "dev": true,
      "license": "MIT",
      "_id": "test-vite-plus-package@1.0.0",
      "extraneous": false,
      "path": "<workspace>/node_modules/test-vite-plus-package",
      "_dependencies": {},
      "devDependencies": {},
      "peerDependencies": {}
    },
    "testnpm2": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
      "overridden": false,
      "name": "testnpm2",
      "integrity": "sha512-F4AQ+KmzhbOSlt7ae+X2O8IJktFZAcN6OK169TT4ny7M3e4Vje7NITZTOU31AtEk9L/Z8lrCrqinl/eY6WPuEw==",
      "license": "ISC",
      "_id": "testnpm2@1.0.1",
      "extraneous": false,
      "path": "<workspace>/node_modules/testnpm2",
      "_dependencies": {},
      "devDependencies": {},
      "peerDependencies": {}
    }
  }
}
```

## `vp pm list --parseable --json`

应以可解析格式列出软件包

```
{
  "version": "1.0.0",
  "name": "command-list-npm10",
  "dependencies": {
    "test-vite-plus-package-optional": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package-optional/-/test-vite-plus-package-optional-1.0.0.tgz",
      "overridden": false
    },
    "test-vite-plus-package": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package/-/test-vite-plus-package-1.0.0.tgz",
      "overridden": false
    },
    "testnpm2": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
      "overridden": false
    }
  }
}
```

## `vp pm list --prod --json`

应仅列出生产依赖（使用 --include prod --include peer）

```
{
  "version": "1.0.0",
  "name": "command-list-npm10",
  "dependencies": {
    "test-vite-plus-package-optional": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package-optional/-/test-vite-plus-package-optional-1.0.0.tgz",
      "overridden": false
    },
    "test-vite-plus-package": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package/-/test-vite-plus-package-1.0.0.tgz",
      "overridden": false
    },
    "testnpm2": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
      "overridden": false
    }
  }
}
```

## `vp pm list --dev --json`

应仅列出开发依赖（使用 --include dev）

```
{
  "version": "1.0.0",
  "name": "command-list-npm10",
  "dependencies": {
    "test-vite-plus-package-optional": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package-optional/-/test-vite-plus-package-optional-1.0.0.tgz",
      "overridden": false
    },
    "test-vite-plus-package": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package/-/test-vite-plus-package-1.0.0.tgz",
      "overridden": false
    },
    "testnpm2": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
      "overridden": false
    }
  }
}
```

## `vp pm list --no-optional --json`

应排除可选依赖（使用 --omit optional）

```
{
  "version": "1.0.0",
  "name": "command-list-npm10",
  "dependencies": {
    "test-vite-plus-package-optional": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package-optional/-/test-vite-plus-package-optional-1.0.0.tgz",
      "overridden": false
    },
    "test-vite-plus-package": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package/-/test-vite-plus-package-1.0.0.tgz",
      "overridden": false
    },
    "testnpm2": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
      "overridden": false
    }
  }
}
```

## `vp pm list --exclude-peers --json`

应排除对等依赖（使用 --omit peer）

```
{
  "version": "1.0.0",
  "name": "command-list-npm10",
  "dependencies": {
    "test-vite-plus-package": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package/-/test-vite-plus-package-1.0.0.tgz",
      "overridden": false
    },
    "testnpm2": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
      "overridden": false
    }
  }
}
```

## `vp pm list -- --loglevel=warn --json`

应支持透传参数

```
{
  "version": "1.0.0",
  "name": "command-list-npm10",
  "dependencies": {
    "test-vite-plus-package-optional": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package-optional/-/test-vite-plus-package-optional-1.0.0.tgz",
      "overridden": false
    },
    "test-vite-plus-package": {
      "version": "1.0.0",
      "resolved": "https://registry.npmjs.org/test-vite-plus-package/-/test-vite-plus-package-1.0.0.tgz",
      "overridden": false
    },
    "testnpm2": {
      "version": "1.0.1",
      "resolved": "https://registry.npmjs.org/testnpm2/-/testnpm2-1.0.1.tgz",
      "overridden": false
    }
  }
}
```
