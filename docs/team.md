---
layout: page
title: 认识团队
description: Vite+ 的开发由一个国际化团队指导。
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamPageSection,
  VPTeamMembers
} from '@voidzero-dev/vitepress-theme'
import { core } from './_data/team'
</script>

<VPTeamPage>
  <VPTeamPageTitle>
    <template #title>认识团队</template>
    <template #lead>
      负责 Vite+ 的开发、维护以及社区参与的团队成员。
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers :members="core" />
  <!-- <VPTeamPageSection v-if="emeriti.length">
    <template #title>团队名誉成员</template>
    <template #lead>
      在这里，我们向一些已经不再活跃、但曾在过去作出宝贵
      贡献的团队成员致敬。
    </template>
    <template #members>
      <VPTeamMembers size="small" :members="emeriti" />
    </template>
  </VPTeamPageSection> -->
</VPTeamPage>
