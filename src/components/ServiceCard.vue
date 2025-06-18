<script setup lang="ts">
import {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  LightBulbIcon,
  Square3Stack3DIcon,
} from '@heroicons/vue/24/outline'

defineProps<{
  service: {
    icon: 'CodeBracketIcon' | 'DevicePhoneMobileIcon' | 'LightBulbIcon' | 'Square3Stack3DIcon'
    title: string
    description: string
    features: string[]
    highlight: string
  }
}>()

const icons = {
  CodeBracketIcon,
  DevicePhoneMobileIcon,
  LightBulbIcon,
  Square3Stack3DIcon,
}
</script>
<template>
  <div
    class="group bg-black border border-white/20 p-8 hover:border-white/40 transition-all duration-500 relative overflow-hidden"
  >
    <div
      class="absolute inset-0 bg-white/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left"
    ></div>

    <div class="relative z-10">
      <div class="flex items-center justify-between mb-6">
        <div
          class="size-12 border border-white/20 flex items-center justify-center group-hover:border-white group-hover:bg-white transition-all duration-300"
        >
          <component
            :is="icons[service.icon]"
            class="size-6 text-white group-hover:text-black transition-colors duration-300"
          />
        </div>
        <span class="text-xs text-gray-400 font-medium tracking-widest">
          {{ service.highlight.toUpperCase() }}
        </span>
      </div>

      <h3 class="text-xl font-bold text-white mb-4 tracking-wide">
        {{ service.title.toUpperCase() }}
      </h3>

      <p class="text-gray-400 mb-6 leading-relaxed font-light">{{ service.description }}</p>

      <ul class="space-y-2">
        <li
          v-for="(feature, index) in service.features"
          :key="index"
          class="flex items-center space-x-3"
        >
          <div class="w-1 h-1 bg-white"></div>
          <span class="text-sm text-gray-300 font-medium">{{ feature }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>
