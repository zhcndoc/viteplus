export type TerminalTone = 'base' | 'muted' | 'brand' | 'accent' | 'success' | 'warning';

export interface TerminalSegment {
  text: string;
  tone?: TerminalTone;
  bold?: boolean;
}

export interface TerminalLine {
  segments: TerminalSegment[];
  tone?: TerminalTone;
}

export interface TerminalTranscript {
  id: string;
  label: string;
  title: string;
  command: string;
  prompt?: string;
  lineDelay?: number;
  completionDelay?: number;
  lines: TerminalLine[];
}

export const terminalTranscripts: TerminalTranscript[] = [
  {
    id: 'create',
    label: '创建',
    title: '脚手架创建项目',
    command: 'vp create',
    lineDelay: 220,
    completionDelay: 900,
    lines: [
      {
        segments: [
          { text: '◇ ', tone: 'accent' },
          { text: '选择模板 ', tone: 'muted' },
          { text: 'vite:application', tone: 'brand' },
        ],
      },
      {
        segments: [
          { text: '◇ ', tone: 'accent' },
          { text: '项目目录 ', tone: 'muted' },
          { text: 'vite-app', tone: 'brand' },
        ],
      },
      {
        segments: [
          { text: '• ', tone: 'muted' },
          { text: 'Node ', tone: 'muted' },
          { text: '24.14.0', tone: 'brand' },
          { text: '  pnpm ', tone: 'muted' },
          { text: '10.28.0', tone: 'accent' },
        ],
      },
      {
        segments: [
          { text: '✓ ', tone: 'success' },
          { text: '依赖已安装', tone: 'base' },
          { text: ' 用时 1.1s', tone: 'muted' },
        ],
      },
      {
        segments: [
          { text: '→ ', tone: 'brand' },
          { text: '下一步：', tone: 'muted' },
          { text: 'cd vite-app && vp dev', tone: 'accent' },
        ],
      },
    ],
  },
  {
    id: 'dev',
    label: '开发',
    title: '启动本地开发',
    command: 'vp dev',
    lineDelay: 220,
    completionDelay: 1100,
    lines: [
      {
        segments: [
          { text: 'VITE+ ', tone: 'brand' },
          { text: '已就绪，用时 ', tone: 'muted' },
          { text: '68ms', tone: 'base' },
        ],
      },
      {
        segments: [
          { text: '→ ', tone: 'brand' },
          { text: '本地 ', tone: 'muted' },
          { text: 'http://localhost:5173/', tone: 'accent' },
        ],
      },
      {
        segments: [
          { text: '→ ', tone: 'muted' },
          { text: '网络 ', tone: 'muted' },
          { text: '--host', tone: 'base' },
          { text: ' 以便暴露', tone: 'muted' },
        ],
      },
      {
        segments: [
          { text: '[hmr] ', tone: 'accent' },
          { text: '已更新 ', tone: 'muted' },
          { text: 'src/App.tsx', tone: 'brand' },
          { text: ' 用时 14ms', tone: 'muted' },
        ],
      },
    ],
  },
  {
    id: 'check',
    label: '检查',
    title: '检查整个项目',
    command: 'vp check',
    lineDelay: 220,
    completionDelay: 1100,
    lines: [
      {
        segments: [
          { text: 'pass: ', tone: 'accent' },
          { text: '42 个文件均已正确格式化', tone: 'base' },
          { text: ' (88ms, 16 threads)', tone: 'muted' },
        ],
      },
      {
        segments: [
          { text: 'pass: ', tone: 'accent' },
          { text: '未发现警告、lint 错误或类型错误', tone: 'base' },
          { text: '，共 42 个文件', tone: 'muted' },
          { text: ' (184ms, 16 threads)', tone: 'muted' },
        ],
      },
    ],
  },
  {
    id: 'test',
    label: '测试',
    title: '快速反馈运行测试',
    command: 'vp test',
    lineDelay: 220,
    completionDelay: 1100,
    lines: [
      {
        segments: [
          { text: 'RUN ', tone: 'muted' },
          { text: 'test/button.spec.ts', tone: 'brand' },
          { text: '（3 个测试）', tone: 'muted' },
        ],
      },
      {
        segments: [
          { text: '✓ ', tone: 'success' },
          { text: '按钮会渲染加载状态', tone: 'base' },
        ],
      },
      {
        segments: [
          { text: '✓ ', tone: 'success' },
          { text: '12 个测试通过', tone: 'base' },
          { text: '，分布在 4 个文件中', tone: 'muted' },
        ],
      },
      {
        segments: [
          { text: '耗时 ', tone: 'muted' },
          { text: '312ms', tone: 'accent' },
          { text: '（转换 22ms，测试 31ms）', tone: 'muted' },
        ],
      },
    ],
  },
  {
    id: 'build',
    label: '构建',
    title: '发布生产构建',
    command: 'vp build',
    lineDelay: 220,
    completionDelay: 1100,
    lines: [
      {
        segments: [
          { text: 'Rolldown ', tone: 'brand' },
          { text: '正在构建生产版本', tone: 'muted' },
        ],
      },
      {
        segments: [
          { text: '✓ ', tone: 'success' },
          { text: '已转换 128 个模块', tone: 'base' },
        ],
      },
      {
        segments: [
          { text: 'dist/assets/index-B6h2Q8.js', tone: 'accent' },
          { text: '  46.2 kB  gzip: 14.9 kB', tone: 'muted' },
        ],
      },
      {
        segments: [
          { text: 'dist/assets/index-H3a8K2.css', tone: 'brand' },
          { text: '  5.1 kB  gzip: 1.6 kB', tone: 'muted' },
        ],
      },
      {
        segments: [
          { text: '✓ ', tone: 'success' },
          { text: '构建耗时 ', tone: 'muted' },
          { text: '421ms', tone: 'base' },
        ],
      },
    ],
  },
];
