# RFC：验证 Node.js `SHASUMS256.txt` 的 PGP 签名

- Issue: [#1807](https://github.com/voidzero-dev/vite-plus/issues/1807)
- 状态：已在 [#1848](https://github.com/voidzero-dev/vite-plus/pull/1848) 中实现

## 摘要

当 Vite+ 下载受管的 Node.js 运行时环境时，它会将归档包的
SHA-256 与 `SHASUMS256.txt` 进行校验（见 [`js-runtime.md`](./js-runtime.md)）。
这可以证明下载内容没有损坏，但并不能证明其**真实性**：如果攻击者能够篡改
`SHASUMS256.txt` 的响应，也同样可以提供一个匹配的恶意归档包，而校验和仍然会通过。

Node.js 会使用发布者的 PGP 密钥对 `SHASUMS256.txt` 进行签名（见
[Verifying binaries](https://github.com/nodejs/node#verifying-binaries)）。
本 RFC 增加了对该签名的验证：Vite+ 会下载带有明文签名的
`SHASUMS256.txt.asc`，并在信任其中任何校验和之前，使用内嵌的 Node.js
发布签名密钥副本进行验证。这与 `gpgv` 针对官方发布密钥环提供的保证相同，
但使用纯 Rust 实现，不依赖外部 `gpg`。

## 背景

运行时下载流程会先解析出一个预期哈希，然后再据此验证归档包（`crates/vite_js_runtime/src/runtime.rs`）：

```rust
let expected_hash = match &download_info.hash_verification {
    HashVerification::ShasumsFile { url } => {
        let shasums_content = download_text(url).await?;       // 明文 SHASUMS256.txt
        Some(provider.parse_shasums(&shasums_content, &archive_filename)?)
    }
    HashVerification::None => None,
};
```

`SHASUMS256.txt` 是通过 HTTPS 获取并按原样信任的。HTTPS 可以保护传输过程，
但威胁模型还包括被攻破或被胁迫的镜像站、配置错误的代理，或任何能够影响
`SHASUMS` 请求返回字节内容的参与方。若没有签名验证，这类参与方就可以提供一个
其控制的归档包所匹配的 `SHASUMS` 文件。

## Node.js 版本管理器中的先行实践

主流 Node.js 版本管理器的下载验证能力，从完全不验证到完整签名校验不等。
其中有两个层面很重要：**完整性**（SHA-256 对 `SHASUMS256.txt` 的校验）和
**真实性**（`SHASUMS256.txt.asc` 上的 PGP 签名，它证明 `SHASUMS` 文件本身确实来自
Node.js 发布者）。只有真实性才能防御被篡改的 SHASUMS；HTTPS 传输则是它们的基本配置。

| 管理器              | SHA-256 |         PGP 签名          | 机制                                                   |
| ------------------- | :-----: | :-----------------------: | ------------------------------------------------------ |
| Vite+ (`vp`)        |   是    | 是（默认，官方来源）      | 内置，纯 Rust；捆绑密钥环；无需外部 `gpg`             |
| [asdf-nodejs]       |   是    |     是（默认 `strict`）    | 外部 `gpg`；用户导入发布密钥环                         |
| [mise]              |   是    |       是（可配置）        | 外部 `gpg`                                           |
| [nvm]               |   是    |            否             | GPG [被拒绝][nvm-pr]，以保持 POSIX / 无依赖             |
| [Volta]             |   是    |            否             | `sha2` crate（项目已停止维护）                         |
| nodenv / node-build |   是    |            否             | 校验和嵌入在版本定义中                                 |
| [fnm]               |   否    |            否             | 仅 HTTPS，无验证                                        |

大多数管理器都止步于校验和，这只能把归档包绑定到通过同一通道获取的 SHASUMS 文件；
而 `fnm` 除了 HTTPS 之外什么都不做。只有 asdf-nodejs 和 mise 还会验证签名，
而且二者都调用系统 `gpg`，并要求先将发布密钥环导入，这在实践中较为脆弱
（mise 反复出现 GPG 密钥导入/编码失败的情况）。

Vite+ 是唯一一个在进程内完成签名验证、且不依赖外部 `gpg` 的方案。
这也正是捆绑 rPGP 和密钥环（为 `vp` 二进制增加约 1.2 MiB）的理由：
它在保持 `vp` 所要求的零依赖、跨平台安装体验的同时，提供了可获得的最强保证。
与 asdf（`NODEJS_CHECK_SIGNATURES`）和 mise 一样，Vite+ 也提供了一个可关闭选项
（`VP_NODE_SKIP_SIGNATURE_VERIFY`），用于密钥/证书问题原本会阻止安装的情况；
详见 [逃生通道](#逃生通道-跳过签名验证)。

[asdf-nodejs]: https://github.com/asdf-vm/asdf-nodejs
[mise]: https://mise.jdx.dev/
[nvm]: https://github.com/nvm-sh/nvm
[nvm-pr]: https://github.com/nvm-sh/nvm/pull/736
[Volta]: https://github.com/volta-cli/volta
[fnm]: https://github.com/Schniz/fnm

## 目标

1. 在信任任何校验和之前，验证 `SHASUMS256.txt` 的 PGP 签名。
2. 不依赖外部工具：不要调用 `gpg`/`gpgv`（它们经常缺失，而且要求先把发布密钥导入密钥环）。
3. 跨平台，包括 musl 和 Windows 交叉构建：纯 Rust，不引入新的 C/系统依赖。
4. 不回退现有安装：Vite+ 今天可以安装的每一个 Node.js 版本都必须继续能够验证，包括旧的 LTS 分支和自定义镜像。

## 非目标

- 运行时密钥环更新/同步机制（密钥环是 vendored 的快照，见 [限制](#信任模型与限制)）。
- 验证 Node.js 以外运行时的签名（Bun/Deno 目前没有发布类似的带明文签名的 checksum 文件）。
- 将 OpenPGP 密钥过期强制作为硬失败（见 [为什么不强制过期](#为什么不强制过期)）。

## 设计

### 下载带明文签名的 SHASUMS

`SHASUMS256.txt.asc` 是一条[带明文签名](https://www.rfc-editor.org/rfc/rfc9580.html#name-cleartext-signature-framework)
消息：它同时包含 `SHASUMS256.txt` 的正文和签名。Vite+ 会下载 `.asc`，验证签名，
并从**已验证**的明文中解析归档包哈希，因此被信任的校验和正是已签名的那一份。

### 验证库

验证使用 [`pgp`](https://crates.io/crates/pgp)（rPGP），一个纯 Rust 的
OpenPGP 实现。它以 `default-features = false` 的方式引入：默认特性会拉入
`bzip2`，而带明文签名的验证并不需要解压。加密实现基于 RustCrypto
（RSA、ECDSA、EdDSA、SHA-2），因此不会引入新的 C 或系统依赖，也不会影响
musl/Windows 交叉构建。

### 内嵌发布密钥环

受信任密钥从
[`nodejs/release-keys`](https://github.com/nodejs/release-keys) 仓库
（所有当前与历史发布密钥）整理后 vendored 到
`crates/vite_js_runtime/src/assets/node-release-keys.asc`，并通过 `include_str!`
嵌入。历史密钥是必需的：例如 `node-v18.20.5` 是由一个不在 Node 当前“主密钥”
列表中的密钥签名的，因此如果只保留当前密钥，Node 18 LTS 的验证就会失败。

### 验证策略（与 `gpgv` 一致）

当满足以下条件时，带明文签名的 SHASUMS 会被接受：

1. 其签名在密码学上可针对密钥环中的某个密钥（主密钥或子密钥）进行验证，并且
2. 该主密钥**未被吊销**，并且
3. 对于**子密钥**签名，该子密钥必须是该主密钥有效绑定、具备签名能力的子密钥
   （设置了 signing key-flag、存在有效的绑定签名、存在有效的内嵌主密钥回签名），
   这样泄露的仅用于加密的子密钥就不能被用来签名。

这与 `gpgv --keyring <node-release-keyring> SHASUMS256.txt.asc` 所接受的内容一致。
Node 发布者当前使用主密钥签名；对子密钥路径的支持是为了防备未来使用签名子密钥的发布者。

### 验证来源：必需 vs 尽力而为

`HashVerification::ShasumsFile` 携带一个可选的签名描述符：

```rust
pub enum HashVerification {
    ShasumsFile {
        url: Str,                          // 明文 SHASUMS256.txt（回退）
        signature: Option<ShasumsSignature>,
    },
    None,
}

pub struct ShasumsSignature {
    pub url: Str,       // SHASUMS256.txt.asc
    pub required: bool, // 官方主机时为强制要求
}
```

- **官方 `nodejs.org`**（默认，或 `VP_NODE_DIST_MIRROR` 指回 `nodejs.org`）：`required = true`。
  缺失或无效签名都属于硬错误。`required` 由解析后的主机决定，而不仅仅取决于是否设置了 mirror 环境变量。
- **自定义镜像**（`VP_NODE_DIST_MIRROR`，例如只发布归档包和 `SHASUMS256.txt` 的内部 Artifactory）：
  `required = false`。如果 `.asc` 不可用，则回退到明文 `SHASUMS256.txt`，并给出警告。
  但已下载到的无效签名在任何地方都会失败。
- **musl 非官方构建**（`unofficial-builds.nodejs.org`）：不发布 `.asc`，因此 `signature` 为 `None`，
  直接使用明文 `SHASUMS256.txt`。

签名的获取/验证保持在内容完整性重试循环之外，就像现有的 SHASUMS 获取/解析一样：
签名失败是永久性的，而 `download_text` 已经会重试网络层。

### 逃生通道：跳过签名验证

设置 `VP_NODE_SKIP_SIGNATURE_VERIFY`（任意值即可）会完全跳过 PGP 验证，并直接使用
明文 `SHASUMS256.txt`，无论 `required` 是什么。这是为未来密钥环或证书问题可能阻止安装
而预留的刻意关闭选项，类似 asdf 的 `NODEJS_CHECK_SIGNATURES=no` 和 mise 的
`verify_checksums`/签名设置。下面两点确保它不会在不知不觉中削弱安装安全性：

- 归档包相对于 `SHASUMS256.txt` 的 SHA-256 校验和仍然会被验证，因此完整性
  （归档包与其 SHASUMS 相匹配）仍被保留；只是放弃了真实性（SHASUMS 确实来自
  Node.js 发布者）。
- 每次跳过安装都会打印警告，因此较弱模式会出现在日志中，而不是静默发生。

它只通过环境变量启用：没有配置文件开关或 CI 标志，从而保持安全路径作为无条件默认值。

## 信任模型与限制

信任边界是经过整理的 Node.js 发布密钥集合，以及对密钥吊销的遵守，这正是
`gpgv` 针对发布密钥环所提供的能力。由此带来两个特性，而且它们都是有意为之的。

### 为什么不强制过期

`gpgv` 将密钥过期视为签名验证的建议性信息：它仍然会把过期密钥的签名报告为有效。
经过实测，`gpgv` 对 `node-v16.20.0` 会返回 `0`，尽管其 `SHASUMS256.txt.asc` 是在其签名密钥
过期后几天才签署的；对 `node-v20.18.0` 也是如此，因为该版本的签名密钥在发布签名后又重新认证过。

因此，强制过期会拒绝合法的 Node 发布。它也无法为泄露的发布密钥增加保护，因为攻击者可以控制
签名中自声明的创建时间，并将伪造签名回填到早于任何过期时间的时刻。针对泄露密钥的真正保护是
**吊销**（此处已强制执行）以及保持 vendored 密钥环的最新状态。因此，这里不强制过期，
与 `gpgv` 保持一致。

### Vendored 密钥环的时效性

密钥环是一个 vendored 快照，而 Node 版本解析是实时的。若某个发布是由在该快照构建后才新增的发布者密钥签署的，
那么在官方来源上将找不到匹配的受信任密钥，并会在密钥环（以及 Vite+）更新之前以关闭式失败返回。
所有当前发布者的密钥都已包含，因此这只会影响某个全新的发布者在密钥环刷新之前的短暂窗口。

密钥环会自动保持最新。一个定时工作流
（`.github/workflows/update-node-release-keys.yml`，每周执行）会通过
`.github/scripts/update-node-release-keys.sh` 从 `nodejs/release-keys` 重新生成
内嵌密钥环，并在内容变化时创建拉取请求。该 PR **不会自动合并**：在信任根更新之前，
需要人工审核哪些密钥发生了变化，而 PR CI（`vite_js_runtime` 测试）会确认每个 vendored 密钥仍然可以解析。
同一个脚本也可以在本地手动运行，以按需刷新密钥环。

### 运维者的关闭选项

`VP_NODE_SKIP_SIGNATURE_VERIFY`（见 [逃生通道：跳过签名验证](#逃生通道-跳过签名验证)）
允许运维者将信任边界降级为仅完整性验证（针对 `SHASUMS256.txt` 的 SHA-256），放弃真实性验证。
它默认关闭，需要显式设置环境变量，并且在每次跳过安装时都会警告，因此较弱模式是一个明确的选择，
而不是无声的默认行为。

### `rsa` 提示

引入 `pgp` 会传递性地加入 `rsa` crate，而它携带
[RUSTSEC-2023-0071](https://rustsec.org/advisories/RUSTSEC-2023-0071)（Marvin
时序侧信道）警告。该警告影响的是可通过网络观察到的 RSA **私钥**操作；
Vite+ 只执行**公钥签名验证**，因此不适用。当前没有修复版 `rsa` 发布，
而且没有任何纯 Rust 的 OpenPGP 库可以在不依赖它的情况下验证 RSA 签名的发布。

## 实现

- `crates/vite_js_runtime/src/pgp_verify.rs`（新增）：密钥环解析、
  `verify_clearsigned`、吊销和子密钥策略检查，以及异步
  `verify_signed_shasums` 包装器（在阻塞线程上运行；密钥解析和
  验证属于 CPU 密集型）。
- `crates/vite_js_runtime/src/assets/node-release-keys.asc`（新增）：内置
  的发布密钥环。
- `crates/vite_js_runtime/src/provider.rs`：`ShasumsSignature`，以及
  `HashVerification::ShasumsFile` 上的 `signature` 字段。
- `crates/vite_js_runtime/src/providers/node.rs`：构建 `.asc` URL，并根据解析出的主机设置 `required`。
- `crates/vite_js_runtime/src/runtime.rs`：获取/验证 `.asc`，对非官方镜像做尽力而为的回退处理。
- `crates/vite_js_runtime/src/error.rs`：`SignatureVerificationFailed`。

## 测试

单元测试使用位于
`crates/vite_js_runtime/src/assets/test/` 下的内置真实测试夹具：

- 一个真实发布版本能够通过验证并返回预期的校验和。
- 被篡改的 SHASUMS 正文会被拒绝。
- 对空/不受信任密钥环的签名会被拒绝。
- 非清签名输入会被拒绝。
- 针对之前曾出问题的情况提供了回归测试夹具：来自
  现已过期密钥的发布（`v18.14.0`）、其密钥后来被重新认证的发布
  （`v20.18.0`）、以及在其密钥过期后不久签名的发布（`v16.20.0`）。

我们还交叉核对了一系列真实发布版本（Node 16.x 到 24.x），以通过这段代码验证 `gpgv` 具体会在何时接受它们，并且在全新安装环境下对端到端的
`vp env exec` 下载路径进行了测试。

## 备选方案

- **调用 `gpg`/`gpgv`**：被否决。`gpg` 往往未安装，而且这需要将发布密钥环导入用户的 GnuPG 目录。
- **`sequoia-openpgp`**：其纯 Rust 后端同样依赖 `rsa` crate（存在相同的安全公告），而其他后端（nettle/OpenSSL/CNG）又需要 C/系统库，会破坏静态 musl 和 Windows 交叉编译。
- **仅限制为当前“主”密钥**：被否决。它会破坏由如今已退休密钥签名的旧 LTS 版本（例如 Node 18.x）的验证。
- **强制过期 / 要求以当前时间为准仍然有效**：被否决。它与 `gpgv` 不一致，会拒绝合法发布，而且也无法阻止回溯时间的攻击者。

## 参考

- Issue [#1807](https://github.com/voidzero-dev/vite-plus/issues/1807)
- [Node.js: Verifying binaries](https://github.com/nodejs/node#verifying-binaries)
- [`nodejs/release-keys`](https://github.com/nodejs/release-keys)
- [`pgp` (rPGP)](https://crates.io/crates/pgp)
- [`js-runtime.md`](./js-runtime.md)
