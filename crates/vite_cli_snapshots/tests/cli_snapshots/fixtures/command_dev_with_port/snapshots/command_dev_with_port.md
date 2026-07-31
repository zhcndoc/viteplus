# 使用端口的开发命令

## `vp dev --port 12312312312`

故意使用无效端口（超出 0-65535 范围）以触发端口错误

**退出代码：** 1

```
error when starting dev server:
Error: No available ports found between 12312312312 and 65535
```
