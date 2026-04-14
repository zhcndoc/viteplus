<script setup lang="ts">
import vitestIcon from "@assets/icons/vitest-light.svg";
import testTerminal from "@local-assets/terminal-features/test.svg";
</script>
<template>
  <section
    id="feature-test"
    class="wrapper border-t grid md:grid-cols-2 divide-x divide-nickel"
  >
    <div class="px-5 py-6 md:p-10 flex flex-col justify-between gap-15">
      <div class="flex flex-col gap-5">
        <span class="text-grey text-xs font-mono uppercase tracking-wide"
          >Vite+ 测试</span
        >
        <h4 class="text-white">让测试变得简单</h4>
        <p class="text-white/70 text-base max-w-[25rem] text-pretty">
          功能丰富的测试运行器，会自动复用应用中的 resolve 和 transform 配置。
        </p>
        <ul class="checkmark-list">
          <li>
            <code class="mr-1 outline-none bg-nickel/50 text-zest">Jest</code>
            兼容 API
          </li>
          <li>默认测试隔离</li>
          <li>浏览器模式：在真实浏览器中运行单元测试</li>
          <li>覆盖率报告、快照测试、类型测试、视觉回归测试……</li>
        </ul>
      </div>
      <div class="px-3 py-1.5 bg-slate rounded w-fit flex gap-2 items-center">
        <span class="text-grey text-sm font-mono hidden md:inline"
          >由以下项目驱动</span
        >
        <a href="https://vitest.dev/" target="_blank">
          <figure class="project-icon">
            <img
              loading="lazy"
              :src="vitestIcon"
              alt="Vitest"
              class="w-[20px] h-[12px]"
            />
            <figcaption>Vitest</figcaption>
          </figure>
        </a>
      </div>
    </div>
    <div class="flex flex-col min-h-[22rem] sm:min-h-[30rem]">
      <div
        class="bg-vitest pl-10 h-full flex flex-col justify-center overflow-clip"
      >
        <div
          class="block px-5 py-6 relative bg-slate rounded-tl rounded-bl outline-1 outline-offset-[2px] outline-white/20"
        >
          <img
            loading="lazy"
            :src="testTerminal"
            alt="vp test terminal command"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-vitest {
  background-image: url("@local-assets/backgrounds/vitest.jpg");
  background-size: cover;
  background-position: center;
}
</style>
