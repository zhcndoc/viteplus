import type { TerminalTranscript } from './terminal-transcripts';

export const featureRunTranscripts: TerminalTranscript[] = [
  {
    id: 'cold',
    label: '冷缓存',
    title: '首次运行会构建共享库和应用',
    command: 'vp run --cache build',
    lineDelay: 180,
    completionDelay: 1200,
    lines: [
      {
        segments: [{ text: '# 首次运行会构建共享库和应用', tone: 'muted' }],
      },
      {
        segments: [{ text: '$ vp pack', tone: 'muted' }],
      },
      {
        segments: [{ text: '$ vp build', tone: 'muted' }],
      },
      {
        segments: [
          { text: 'vp run:', tone: 'brand', bold: true },
          { text: ' 0/2 命中缓存（0%）。', tone: 'muted' },
        ],
      },
    ],
  },
  {
    id: 'no-changes',
    label: '完整回放',
    title: '没有改动时两项任务都从缓存回放',
    command: 'vp run --cache build',
    lineDelay: 180,
    completionDelay: 1200,
    lines: [
      {
        segments: [{ text: '# 没有改动时两项任务都从缓存回放', tone: 'muted' }],
      },
      {
        segments: [
          { text: '$ vp pack ', tone: 'muted' },
          { text: '✓ ', tone: 'success' },
          { text: '命中缓存，正在回放', tone: 'base' },
        ],
      },
      {
        segments: [
          { text: '$ vp build ', tone: 'muted' },
          { text: '✓ ', tone: 'success' },
          { text: '命中缓存，正在回放', tone: 'base' },
        ],
      },
      {
        segments: [
          { text: 'vp run:', tone: 'brand', bold: true },
          { text: ' 2/2 命中缓存（100%），节省 1.24s。', tone: 'muted' },
        ],
      },
    ],
  },
  {
    id: 'app-change',
    label: '局部回放',
    title: '应用变更时只重跑应用构建',
    command: 'vp run --cache build',
    lineDelay: 180,
    completionDelay: 1200,
    lines: [
      {
        segments: [{ text: '# 应用变更时只重跑应用构建', tone: 'muted' }],
      },
      {
        segments: [
          { text: '$ vp pack ', tone: 'muted' },
          { text: '✓ ', tone: 'success' },
          { text: '命中缓存，正在回放', tone: 'base' },
        ],
      },
      {
        segments: [
          { text: '$ vp build ', tone: 'muted' },
          { text: '✗ ', tone: 'base' },
          { text: '未命中缓存：', tone: 'muted' },
          { text: "'src/main.ts'", tone: 'base' },
          { text: ' 已修改，正在执行', tone: 'muted' },
        ],
      },
      {
        segments: [
          { text: 'vp run:', tone: 'brand', bold: true },
          { text: ' 1/2 命中缓存（50%），节省 528ms。', tone: 'muted' },
        ],
      },
    ],
  },
  {
    id: 'shared-change',
    label: '全量重建',
    title: '共享 API 变更时会重建库和应用',
    command: 'vp run --cache build',
    lineDelay: 180,
    completionDelay: 1200,
    lines: [
      {
        segments: [{ text: '# 共享 API 变更时会重建库和应用', tone: 'muted' }],
      },
      {
        segments: [
          { text: '$ vp pack ', tone: 'muted' },
          { text: '✗ ', tone: 'base' },
          { text: '未命中缓存：', tone: 'muted' },
          { text: "'src/index.ts'", tone: 'base' },
          { text: ' 已修改，正在执行', tone: 'muted' },
        ],
      },
      {
        segments: [
          { text: '$ vp build ', tone: 'muted' },
          { text: '✗ ', tone: 'base' },
          { text: '未命中缓存：', tone: 'muted' },
          { text: "'src/routes.ts'", tone: 'base' },
          { text: ' 已修改，正在执行', tone: 'muted' },
        ],
      },
      {
        segments: [
          { text: 'vp run:', tone: 'brand', bold: true },
          { text: ' 0/2 命中缓存（0%）。', tone: 'muted' },
        ],
      },
    ],
  },
];
