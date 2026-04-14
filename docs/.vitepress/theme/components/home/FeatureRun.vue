<script setup lang="ts">
import FeatureRunTerminal from "./FeatureRunTerminal.vue";
</script>

<template>
  <section
    id="feature-run"
    class="wrapper border-t grid md:grid-cols-2 md:divide-x divide-nickel"
  >
    <div class="px-5 py-6 md:p-10 flex flex-col justify-between gap-15">
      <div class="flex flex-col gap-5">
        <span class="text-grey text-xs font-mono uppercase tracking-wide"
          >Vite+ 运行</span
        >
        <h4 class="text-white">面向 monorepo 和脚本的 Vite Task</h4>
        <p class="text-white/70 text-base max-w-[25rem] text-pretty">
          运行内置命令和
          <code class="mx-1 outline-none bg-nickel/50 text-aqua"
            >package.json</code
          >
          scripts with 自动缓存与依赖感知执行。
        </p>
        <ul class="checkmark-list">
          <li>为可缓存任务自动追踪输入</li>
          <li>跨工作区包的依赖感知执行</li>
          <li>
            通过
            <code class="mx-1 outline-none bg-nickel/50 text-aqua">vp run</code>
            获得熟悉的脚本执行体验
          </li>
        </ul>
      </div>
    </div>
    <div class="flex flex-col min-h-[22rem] sm:min-h-[30rem]">
      <div
        class="bg-viteplus pl-5 sm:pl-10 h-full overflow-clip flex flex-col justify-center py-6"
      >
        <FeatureRunTerminal />
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-viteplus {
  background-image: url("@local-assets/backgrounds/viteplus.jpg");
  background-size: cover;
  background-position: center;
}
</style>
