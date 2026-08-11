import { resolve } from 'node:path';

import type { VoidZeroThemeConfig } from '@voidzero-dev/vitepress-theme';
import { extendConfig } from '@voidzero-dev/vitepress-theme/config';
import { defineConfig, type HeadConfig } from 'vitepress';
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons';
import llmstxt from 'vitepress-plugin-llms';
import { withMermaid } from 'vitepress-plugin-mermaid';

// Non-production deploys (the main preview, PR staging) serve their own
// copies of the install scripts and llms dumps, so the https://vite.plus
// installer shortcuts and absolute site URLs must point at the deploy's
// origin instead of production. The deploy workflows set DOCS_SITE_ORIGIN via
// the deploy-docs composite action; markdown content is rewritten through
// markdown-it below, and Vue components read the __DOCS_*__ define constants.
const siteOrigin = process.env.DOCS_SITE_ORIGIN;
const docsOrigin = siteOrigin || 'https://viteplus.dev';
const installShUrl = siteOrigin ? `${siteOrigin}/install.sh` : 'https://vite.plus';
const installPs1Url = siteOrigin ? `${siteOrigin}/install.ps1` : 'https://vite.plus/ps1';

function rewriteInstallUrls(text: string): string {
  if (!siteOrigin) {
    return text;
  }
  return text
    .replaceAll('https://vite.plus/ps1', installPs1Url)
    .replaceAll('https://vite.plus', installShUrl);
}

const taskRunnerGuideItems = [
  {
    text: '运行',
    link: '/guide/run',
  },
  {
    text: '任务缓存',
    link: '/guide/cache',
    items: [
      { text: 'Automatic Data Tracking', link: '/guide/automatic-data-tracking' },
      { text: 'GitHub Actions Cache', link: '/guide/github-actions-cache' },
    ],
  },
  {
    text: '运行二进制',
    link: '/guide/vpx',
  },
];

const guideSidebar = [
  {
    text: '入门',
    items: [
      { text: '开始使用', link: '/guide/' },
      { text: '创建项目', link: '/guide/create' },
      {
        text: '迁移到 Vite+',
        link: '/guide/migrate',
        items: [{ text: '迁移规则', link: '/guide/migrate-rules' }],
      },
      { text: '安装依赖', link: '/guide/install' },
      { text: '环境', link: '/guide/env' },
      { text: '安装程序环境变量', link: '/guide/installer-env-vars' },
      { text: '为什么选择 Vite+', link: '/guide/why' },
    ],
  },
  {
    text: '开发',
    items: [
      { text: '开发', link: '/guide/dev' },
      {
        text: '检查',
        link: '/guide/check',
        items: [
          { text: 'Lint', link: '/guide/lint' },
          { text: '格式化', link: '/guide/fmt' },
        ],
      },
      { text: '测试', link: '/guide/test' },
    ],
  },
  {
    text: '执行',
    items: taskRunnerGuideItems,
  },
  {
    text: '构建',
    items: [
      { text: '构建', link: '/guide/build' },
      { text: '打包', link: '/guide/pack' },
    ],
  },
  {
    text: '维护',
    items: [
      { text: '升级 Vite+', link: '/guide/upgrade' },
      { text: '移除 Vite+', link: '/guide/implode' },
    ],
  },
  {
    text: '工作流',
    items: [
      { text: 'IDE 集成', link: '/guide/ide-integration' },
      { text: 'CI', link: '/guide/ci' },
      { text: 'Docker', link: '/guide/docker' },
      { text: '提交钩子', link: '/guide/commit-hooks' },
      { text: 'Monorepo 指南', link: '/guide/monorepo' },
      { text: '故障排查', link: '/guide/troubleshooting' },
    ],
  },
];

export default extendConfig(
  withMermaid(
    defineConfig({
      title: 'Vite+ 中文文档',
      // titleTemplate: ':title - Vite+ 中文文档',
      description: 'Web 的统一工具链，用一个工具管理运行时、包管理器和前端技术栈。',
      cleanUrls: true,
      head: [
        ['link', { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' }],
        [
          'link',
          {
            rel: 'preconnect',
            href: 'https://fonts.gstatic.com',
            crossorigin: 'true',
          },
        ],
        ['meta', { name: 'theme-color', content: '#7474FB' }],
        ['meta', { property: 'og:type', content: 'website' }],
        ['meta', { property: 'og:site_name', content: 'Vite+ 中文文档' }],
        ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
        ['meta', { name: 'twitter:site', content: '@voidzerodev' }],
        ['script', { src: 'https://www.zhcndoc.com/js/common.js', defer: '' }],
      ],
      vite: {
        define: {
          __DOCS_ORIGIN__: JSON.stringify(docsOrigin),
          __DOCS_INSTALL_SH_URL__: JSON.stringify(installShUrl),
          __DOCS_INSTALL_PS1_URL__: JSON.stringify(installPs1Url),
        },
        optimizeDeps: {
          include: ['mermaid > @braintree/sanitize-url'],
        },
        resolve: {
          alias: [
            { find: '@local-assets', replacement: resolve(__dirname, 'theme/assets') },
            { find: '@layouts', replacement: resolve(__dirname, 'theme/layouts') },
            // dayjs ships CJS by default; redirect to its ESM build so
            // mermaid (imported via vitepress-plugin-mermaid) works in dev
            { find: /^dayjs$/, replacement: 'dayjs/esm' },
          ],
        },
        plugins: [
          groupIconVitePlugin({
            customIcon: {
              tsdown: 'https://tsdown.dev/tsdown.svg',
            },
          }),
          llmstxt({
            ignoreFiles: ['team.md'],
            description: 'The Unified Toolchain for the Web',
            details: '',
          }),
        ],
      },
      themeConfig: {
        variant: 'viteplus' as VoidZeroThemeConfig['variant'],
        nav: [
          {
            text: '指南',
            link: '/guide/',
            activeMatch: '^/guide/',
          },
          {
            text: '配置',
            link: '/config/',
            activeMatch: '^/config/',
          },
          {
            text: '资源',
            items: [
              { text: 'Team', link: '/team' },
              { text: 'GitHub', link: 'https://github.com/voidzero-dev/vite-plus' },
              { text: '版本发布', link: 'https://github.com/voidzero-dev/vite-plus/releases' },
              {
                text: '公告',
                link: 'https://voidzero.dev/posts/announcing-vite-plus-beta',
              },
              {
                text: '贡献指南',
                link: 'https://github.com/voidzero-dev/vite-plus/blob/main/CONTRIBUTING.md',
              },
            ],
          },
          {
            text: '简中文档',
            link: 'https://www.zhcndoc.com',
            target: '_blank',
          },
        ],
        sidebar: {
          '/guide/': guideSidebar,
          '/config/': [
            {
              text: '配置',
              items: [
                { text: '配置 Vite+', link: '/config/' },
                { text: '创建', link: '/config/create' },
                { text: '运行', link: '/config/run' },
                { text: '格式化', link: '/config/fmt' },
                { text: 'Lint', link: '/config/lint' },
                { text: 'Check', link: '/config/check' },
                { text: '测试', link: '/config/test' },
                { text: '构建', link: '/config/build' },
                { text: '打包', link: '/config/pack' },
                { text: '暂存检查', link: '/config/staged' },
              ],
            },
          ],
        },
        socialLinks: [
          { icon: 'github', link: 'https://github.com/voidzero-dev/vite-plus' },
          { icon: 'x', link: 'https://x.com/voidzerodev' },
          { icon: 'discord', link: 'https://discord.gg/cC6TEVFKSx' },
          { icon: 'bluesky', link: 'https://bsky.app/profile/voidzero.dev' },
        ],
        outline: {
          level: [2, 3],
        },
        search: {
          provider: 'local',
        },

        footer: {
          copyright: `© ${new Date().getFullYear()} VoidZero Inc. and Vite+ contributors.`,
          nav: [
            {
              title: '公司',
              items: [
                { text: 'VoidZero', link: 'https://voidzero.dev' },
                { text: 'Vite', link: 'https://vite.dev' },
                { text: 'Vitest', link: 'https://vitest.dev' },
                { text: 'Rolldown', link: 'https://rolldown.rs' },
                { text: 'Oxc', link: 'https://oxc.rs' },
              ],
            },
          ],
          social: [
            { icon: 'github', link: 'https://github.com/voidzero-dev/vite-plus' },
            { icon: 'x', link: 'https://x.com/voidzerodev' },
            { icon: 'discord', link: 'https://discord.gg/cC6TEVFKSx' },
            { icon: 'bluesky', link: 'https://bsky.app/profile/voidzero.dev' },
          ],
        },
      },
      transformHead({ page, pageData }) {
        const url = 'https://viteplus.zhcndoc.com/' + page.replace(/\.md$/, '').replace(/index$/, '');

        const canonicalUrlEntry: HeadConfig = [
          'link',
          {
            rel: 'canonical',
            href: url,
          },
        ];

        const ogInfo: HeadConfig[] = [
          ['meta', { property: 'og:title', content: pageData.frontmatter.title ?? 'Vite+ 中文文档' }],
          [
            'meta',
            {
              property: 'og:image',
              content: `https://viteplus.zhcndoc.com/${pageData.frontmatter.cover ?? 'og.jpg'}`,
            },
          ],
          ['meta', { property: 'og:url', content: url }],
          [
            'meta',
            {
              property: 'og:description',
              content: pageData.frontmatter.description ?? 'Web 的统一工具链，用一个工具管理运行时、包管理器和前端技术栈。',
            },
          ],
        ];

        return [...ogInfo, canonicalUrlEntry];
      },
      markdown: {
        config(md) {
          md.use(groupIconMdPlugin);
          if (siteOrigin) {
            md.core.ruler.push('rewrite-install-urls', (state) => {
              const walk = (tokens: typeof state.tokens) => {
                for (const token of tokens) {
                  if (
                    token.type === 'fence' ||
                    token.type === 'code_inline' ||
                    token.type === 'text'
                  ) {
                    token.content = rewriteInstallUrls(token.content);
                  }
                  if (token.type === 'link_open') {
                    const href = token.attrGet('href');
                    if (href) {
                      token.attrSet('href', rewriteInstallUrls(href));
                    }
                  }
                  if (token.children) {
                    walk(token.children);
                  }
                }
              };
              walk(state.tokens);
            });
          }
        },
      },
    }),
  ),
);
