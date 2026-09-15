# explicit_chdir_selects_root

显式的 `-C .` 会选择工作区根目录。CLI 使用 `-C` 后，该命令不会再次打开包选择器

## `vp -C . build`

```
note: You are running `vp build` as a Vite+ built-in command. If you meant to run the build npm script, use `vpr build` instead.
✓ 2 modules transformed.
computing gzip size...
dist/assets/root-entry-<hash>.js  <size> kB │ gzip: <size> kB

✓ built in <duration>
```
