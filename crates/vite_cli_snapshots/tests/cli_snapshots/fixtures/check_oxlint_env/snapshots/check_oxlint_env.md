# check_oxlint_env

## `OXLINT_TSGOLINT_PATH=./invalid-path vp lint --type-aware`

应提示错误：./invalid-path 不存在

**退出代码：** 1

```
Failed to find tsgolint executable: OXLINT_TSGOLINT_PATH points to './invalid-path' which does not exist
```
