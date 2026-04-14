<template>
  <footer class="bg-primary" data-theme="dark">
    <Sponsors
      description="Vite+ 是免费且开源的，由全职团队与热情的开源贡献者共同推动。"
      sponsorLinkText="参与贡献"
      sponsorLink="https://github.com/voidzero-dev/vite-plus/blob/main/CONTRIBUTING.md"
    />
    <section class="wrapper">
      <Footer
        heading="让团队生产力再上一个台阶"
        subheading=" "
        button-text="开始使用"
        button-link="/guide"
      />
    </section>
  </footer>
</template>

<style scoped></style>
<script setup lang="ts">
import Sponsors from "@components/oss/Sponsors.vue";
import Footer from "@components/oss/Footer.vue";
</script>
