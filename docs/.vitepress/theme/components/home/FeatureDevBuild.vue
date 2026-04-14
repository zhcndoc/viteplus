<script setup lang="ts">
import rolldownIcon from "@assets/icons/rolldown-light.svg";
import viteIcon from "@assets/icons/vite-light.svg";
</script>

<template>
  <section
    id="feature-dev-build"
    class="wrapper border-t grid md:grid-cols-2 divide-x divide-nickel"
  >
    <div class="px-5 py-6 md:p-10 flex flex-col justify-between gap-15">
      <div class="flex flex-col gap-5">
        <span class="text-grey text-xs font-mono uppercase tracking-wide"
          >Vite+ 开发与构建</span
        >
        <h4 class="text-white">飞快的构建速度</h4>
        <p class="text-white/70 text-base max-w-[25rem] text-pretty">
          以极快速度启动开发服务器并生成生产构建。保持开发节奏，也让 CI
          始终高效。
        </p>
        <ul class="checkmark-list">
          <li>
            始终即时的
            <code class="mr-1 outline-none bg-nickel/50 text-vite"
              >Hot Module Replacement (HMR)</code
            >
          </li>
          <li>生产构建比 webpack 快 40 倍</li>
          <li>面向大型应用可选完整打包开发模式</li>
          <li>庞大的插件生态</li>
        </ul>
      </div>
      <div class="px-3 py-1.5 bg-slate rounded w-fit flex gap-2 items-center">
        <span class="text-grey text-sm font-mono hidden md:inline"
          >由以下项目驱动</span
        >
        <a href="https://vite.dev/" target="_blank">
          <figure class="project-icon">
            <img
              loading="lazy"
              :src="viteIcon"
              alt="Vite"
              class="w-[20px] h-[12px]"
            />
            <figcaption>Vite</figcaption>
          </figure>
        </a>
        <span class="text-grey text-sm font-mono">&amp;</span>
        <a href="https://rolldown.rs/" target="_blank">
          <figure class="project-icon">
            <img
              loading="lazy"
              :src="rolldownIcon"
              alt="Rolldown"
              class="w-[20px] h-[12px]"
            />
            <figcaption>Rolldown</figcaption>
          </figure>
        </a>
      </div>
    </div>
    <div class="flex flex-col min-h-[22rem] sm:min-h-[30rem]">
      <div
        class="bg-vite pl-10 h-full flex flex-col justify-center overflow-clip"
      >
        <div
          class="mr-5 sm:mr-10 px-5 py-6 relative bg-slate rounded-tl rounded-bl outline-1 outline-offset-[2px] outline-white/20 font-mono text-sm leading-[1.5rem] text-white"
        >
          <div class="text-white">$ vp build</div>
          <div class="h-4" />
          <div class="text-grey">
            VITE+ <span class="terminal-blue">正在构建生产版本</span>
          </div>
          <div class="text-grey">
            <span class="text-zest">✓</span> 已转换
            <span class="text-white">128 个模块</span>
          </div>
          <div class="h-4" />
          <div class="text-grey">
            <span class="text-white">dist/index.html</span>
            <span class="inline-block w-2" aria-hidden="true"></span>
            <span class="terminal-blue">0.42 kB</span>
          </div>
          <div class="text-grey">
            <span class="text-white">dist/assets/index.css</span>
            <span class="inline-block w-2" aria-hidden="true"></span>
            <span class="terminal-blue">5.1 kB</span>
          </div>
          <div class="text-grey">
            <span class="text-white">dist/assets/index.js</span>
            <span class="inline-block w-2" aria-hidden="true"></span>
            <span class="terminal-blue">46.2 kB</span>
          </div>
          <div class="text-grey">
            <span class="text-zest">✓</span> 构建耗时
            <span class="text-white">421ms</span>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.bg-vite {
  background-image: url("@local-assets/backgrounds/vite.jpg");
  background-size: cover;
  background-position: center;
}
</style>
