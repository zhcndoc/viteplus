# redaction_selftest

锁定脱敏保证：操作系统原生路径分隔符在每个平台上都会规范化为
正斜杠，字节大小和内容哈希资源
后缀会被屏蔽，而必须保留的内容（普通的 8 字母文件名
词干、https:// URL）会保留。

## `vpt print-native-path src/index.ts dist/assets/app.js`

打印操作系统原生分隔符；快照在所有操作系统上都必须显示正斜杠

```
src/index.ts
dist/assets/app.js
```

## `vpt print 'dist/assets/index-Dra_-aT4.js  0.71 kB / gzip: 0.40 kB / total 1 MB'`

大小和哈希后缀已被屏蔽

```
dist/assets/index-<hash>.js  <size> kB / gzip: <size> kB / total <size> MB
```

## `vpt print '保留 vite-tsconfig.js 和 https://viteplus.dev/guide/ 不变'`

小写 8 个字母的词根和 URL 在遮盖后仍会保留

```
保留 vite-tsconfig.js 和 https://viteplus.dev/guide/ 不变
```
