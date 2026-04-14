<script setup lang="ts">
import RiveAnimation from "@components/shared/RiveAnimation.vue";
import focusOnShippingAnimation from "@local-assets/animations/514_x_246_focus_on_shipping_v2.riv";
import stayFastAtScaleAnimation from "@local-assets/animations/561_x_273_stay_fast_at_scale.riv";
import productivitySecurityImage from "@local-assets/productivity-security.png";
import tileOxc from "@local-assets/tiles/oxc.png";
import tileVite from "@local-assets/tiles/vite.png";
import tileVitest from "@local-assets/tiles/vitest.png";
</script>

<template>
  <section
    class="wrapper wrapper--ticks border-t grid lg:grid-cols-2 divide-x divide-y divide-stroke"
  >
    <div class="p-5 sm:p-10 flex flex-col gap-3">
      <h5 class="text-balance sm:text-pretty">值得标准化采用的可信技术栈</h5>
      <p class="sm:max-w-[28rem] text-pretty mb-12 sm:mb-16">
        Vite+ 建立在成熟的开源行业标准之上，并由这些项目背后的同一批专家维护。
      </p>
      <div
        class="flex flex-col gap-6 sm:pr-10 -mx-5 sm:mx-0 divide-y sm:divide-y-0 divide-stroke"
      >
        <div
          class="flex flex-col gap-6 pt-6 pb-6 sm:pb-0 px-5 sm:px-0 sm:pt-0 first:pt-0"
        >
          <img
            loading="lazy"
            :src="tileVite"
            alt="Vite"
            class="w-24 flex-shrink-0 sm:hidden"
          />
          <div class="flex flex-row sm:items-center gap-6">
            <img
              loading="lazy"
              :src="tileVite"
              alt="Vite"
              class="w-24 flex-shrink-0 hidden sm:block"
            />
            <div
              class="relative flex flex-col flex-1 sm:pl-6 before:content-none sm:before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-full before:w-px before:bg-stroke"
            >
              <p class="text-primary font-medium text-base sm:text-xl">69m+</p>
              <p class="leading-tight text-base">每周 npm 下载量</p>
            </div>
            <div
              class="relative flex flex-col flex-shrink-0 pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-full before:w-px before:bg-stroke"
            >
              <p class="text-primary font-medium text-base sm:text-xl">78.7k</p>
              <p class="leading-tight text-base">GitHub Stars</p>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col gap-6 pt-6 pb-6 sm:pb-0 px-5 sm:px-0 sm:pt-0 first:pt-0"
        >
          <img
            loading="lazy"
            :src="tileVitest"
            alt="Vitest"
            class="w-24 flex-shrink-0 sm:hidden"
          />
          <div class="flex flex-row sm:items-center gap-6">
            <img
              loading="lazy"
              :src="tileVitest"
              alt="Vitest"
              class="w-24 flex-shrink-0 hidden sm:block"
            />
            <div
              class="relative flex flex-col flex-1 sm:pl-6 before:content-none sm:before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-full before:w-px before:bg-stroke"
            >
              <p class="text-primary font-medium text-base sm:text-xl">35m+</p>
              <p class="leading-tight text-base">每周 npm 下载量</p>
            </div>
            <div
              class="relative flex flex-col flex-shrink-0 pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-full before:w-px before:bg-stroke"
            >
              <p class="text-primary font-medium text-base sm:text-xl">16.1k</p>
              <p class="leading-tight text-base">GitHub Stars</p>
            </div>
          </div>
        </div>
        <div
          class="flex flex-col gap-6 pt-6 pb-6 sm:pb-0 px-5 sm:px-0 sm:pt-0 first:pt-0"
        >
          <img
            loading="lazy"
            :src="tileOxc"
            alt="Oxc"
            class="w-24 flex-shrink-0 sm:hidden"
          />
          <div class="flex flex-row sm:items-center gap-6">
            <img
              loading="lazy"
              :src="tileOxc"
              alt="Oxc"
              class="w-24 flex-shrink-0 hidden sm:block"
            />
            <div
              class="relative flex flex-col flex-1 sm:pl-6 before:content-none sm:before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-full before:w-px before:bg-stroke"
            >
              <p class="text-primary font-medium text-base sm:text-xl">5m+</p>
              <p class="leading-tight text-base">每周 npm 下载量</p>
            </div>
            <div
              class="relative flex flex-col flex-shrink-0 pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:h-full before:w-px before:bg-stroke"
            >
              <p class="text-primary font-medium text-base sm:text-xl">19.8k</p>
              <p class="leading-tight text-base">GitHub Stars</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="p-5 sm:p-10 flex flex-col gap-3 border-r-0">
      <h5>在大规模场景下依然保持高速</h5>
      <p class="max-w-[26rem] text-pretty">
        依托 Rust 编写的底层组件，Vite+ 提供企业级性能：构建速度比 webpack
        <span class="text-primary">快 40 倍</span>，lint 速度比 ESLint
        <span class="text-primary">快约 50 至 100 倍</span>，格式化速度比
        Prettier <span class="text-primary">快至 30 倍</span>。
      </p>
      <RiveAnimation
        :desktop-src="stayFastAtScaleAnimation"
        :desktop-width="561"
        :desktop-height="273"
        canvas-class="w-full mt-10"
      />
    </div>
    <div class="p-5 sm:p-10 flex flex-col gap-3">
      <h5>专注交付，而不是工具链</h5>
      <ul class="list-disc pl-3 flex flex-col gap-2 marker:text-ruby mt-1">
        <li class="leading-tight">别把时间浪费在工具维护上</li>
        <li class="leading-tight">提升跨团队开发者流动效率</li>
        <li class="leading-tight">为人类和 AI 辅助工作流统一最佳实践</li>
      </ul>
      <RiveAnimation
        :desktop-src="focusOnShippingAnimation"
        :desktop-width="514"
        :desktop-height="246"
        canvas-class="w-full mt-10"
      />
    </div>
    <div class="p-5 sm:p-10 flex flex-col gap-3">
      <h5>供应链安全</h5>
      <p class="max-w-[20rem] text-pretty">
        Vite+ 的开发遵循严格的安全实践，我们会在统一工具链中审查其依赖项。
      </p>
      <img
        loading="lazy"
        class="w-full"
        :src="productivitySecurityImage"
        alt="Vite+ 以严格的安全实践审查所有依赖"
      />
    </div>
  </section>
</template>

<style scoped></style>
