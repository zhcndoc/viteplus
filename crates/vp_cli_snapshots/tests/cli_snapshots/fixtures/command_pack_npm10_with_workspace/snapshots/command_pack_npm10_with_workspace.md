# 使用工作区打包 npm10 的命令

## `vp pm pack --json`

应打包当前工作区根目录

```
[
  {
    "id": "command-pack-npm10-with-workspace@1.0.0",
    "name": "command-pack-npm10-with-workspace",
    "version": "1.0.0",
    "size": 293,
    "unpackedSize": 267,
    "shasum": "f01a4c0ebb0010ff225b2b52e7e291f599152a65",
    "integrity": "sha512-ioD8N84lTHyJx5WSX8RmNJ/OuL/JRVNa02RW8wvtIfoMS29IE7z3nPzFq4XDEcQAGyqYnKzHbPoYfwDzDNj//Q==",
    "filename": "command-pack-npm10-with-workspace-1.0.0.tgz",
    "files": [
      {
        "path": "package.json",
        "size": 146,
        "mode": 420
      },
      {
        "path": "packages/app/package.json",
        "size": 42,
        "mode": 420
      },
      {
        "path": "packages/utils/package.json",
        "size": 79,
        "mode": 420
      }
    ],
    "entryCount": 3,
    "bundled": []
  }
]
```

## `vp pm pack --recursive --json`

应打包工作区中的所有软件包（使用 --workspaces）

```
[
  {
    "id": "app@1.0.0",
    "name": "app",
    "version": "1.0.0",
    "size": 139,
    "unpackedSize": 42,
    "shasum": "345798900bebd245befed42777fad5ff0fd40749",
    "integrity": "sha512-pgDkOqX2YwfaxeDXudq8A/1SgjaBaAB9b37UuaFQywuiFKLHtP21nDTgECrF/kFGbhb7YN+rwbIyCU5V8P8c3A==",
    "filename": "app-1.0.0.tgz",
    "files": [
      {
        "path": "package.json",
        "size": 42,
        "mode": 420
      }
    ],
    "entryCount": 1,
    "bundled": []
  },
  {
    "id": "@vite-plus-test/utils@1.0.0",
    "name": "@vite-plus-test/utils",
    "version": "1.0.0",
    "size": 165,
    "unpackedSize": 79,
    "shasum": "76977162436d660a181f57b206cfd025ebecf805",
    "integrity": "sha512-n9Ni0t6DK9ODuT6PThCo6WyEBYUpHBq4wBbk5yrARHPSa0X0wKEwwwRNBYGTHAyD5lO4BwstcwbF0u2MdtbJNw==",
    "filename": "vite-plus-test-utils-1.0.0.tgz",
    "files": [
      {
        "path": "package.json",
        "size": 79,
        "mode": 420
      }
    ],
    "entryCount": 1,
    "bundled": []
  }
]
```

## `vpt rm -f command-pack-npm10-with-workspace-1.0.0.tgz app-1.0.0.tgz vite-plus-test-utils-1.0.0.tgz`


## `vp pm pack --filter app --json`

应打包指定的软件包（使用 --workspace app）

```
[
  {
    "id": "app@1.0.0",
    "name": "app",
    "version": "1.0.0",
    "size": 139,
    "unpackedSize": 42,
    "shasum": "345798900bebd245befed42777fad5ff0fd40749",
    "integrity": "sha512-pgDkOqX2YwfaxeDXudq8A/1SgjaBaAB9b37UuaFQywuiFKLHtP21nDTgECrF/kFGbhb7YN+rwbIyCU5V8P8c3A==",
    "filename": "app-1.0.0.tgz",
    "files": [
      {
        "path": "package.json",
        "size": 42,
        "mode": 420
      }
    ],
    "entryCount": 1,
    "bundled": []
  }
]
```

## `vpt rm -f command-pack-npm10-with-workspace-1.0.0.tgz app-1.0.0.tgz vite-plus-test-utils-1.0.0.tgz`


## `vp pm pack --filter app --filter @vite-plus-test/utils --json`

应打包多个软件包

```
[
  {
    "id": "app@1.0.0",
    "name": "app",
    "version": "1.0.0",
    "size": 139,
    "unpackedSize": 42,
    "shasum": "345798900bebd245befed42777fad5ff0fd40749",
    "integrity": "sha512-pgDkOqX2YwfaxeDXudq8A/1SgjaBaAB9b37UuaFQywuiFKLHtP21nDTgECrF/kFGbhb7YN+rwbIyCU5V8P8c3A==",
    "filename": "app-1.0.0.tgz",
    "files": [
      {
        "path": "package.json",
        "size": 42,
        "mode": 420
      }
    ],
    "entryCount": 1,
    "bundled": []
  },
  {
    "id": "@vite-plus-test/utils@1.0.0",
    "name": "@vite-plus-test/utils",
    "version": "1.0.0",
    "size": 165,
    "unpackedSize": 79,
    "shasum": "76977162436d660a181f57b206cfd025ebecf805",
    "integrity": "sha512-n9Ni0t6DK9ODuT6PThCo6WyEBYUpHBq4wBbk5yrARHPSa0X0wKEwwwRNBYGTHAyD5lO4BwstcwbF0u2MdtbJNw==",
    "filename": "vite-plus-test-utils-1.0.0.tgz",
    "files": [
      {
        "path": "package.json",
        "size": 79,
        "mode": 420
      }
    ],
    "entryCount": 1,
    "bundled": []
  }
]
```

## `vpt rm -f command-pack-npm10-with-workspace-1.0.0.tgz app-1.0.0.tgz vite-plus-test-utils-1.0.0.tgz`


## `vp pm pack --pack-destination ./dist --json`

应使用指定的目标目录进行打包

```
[
  {
    "id": "command-pack-npm10-with-workspace@1.0.0",
    "name": "command-pack-npm10-with-workspace",
    "version": "1.0.0",
    "size": 293,
    "unpackedSize": 267,
    "shasum": "f01a4c0ebb0010ff225b2b52e7e291f599152a65",
    "integrity": "sha512-ioD8N84lTHyJx5WSX8RmNJ/OuL/JRVNa02RW8wvtIfoMS29IE7z3nPzFq4XDEcQAGyqYnKzHbPoYfwDzDNj//Q==",
    "filename": "command-pack-npm10-with-workspace-1.0.0.tgz",
    "files": [
      {
        "path": "package.json",
        "size": 146,
        "mode": 420
      },
      {
        "path": "packages/app/package.json",
        "size": 42,
        "mode": 420
      },
      {
        "path": "packages/utils/package.json",
        "size": 79,
        "mode": 420
      }
    ],
    "entryCount": 3,
    "bundled": []
  }
]
```

## `vpt rm -rf ./dist`

```
```
