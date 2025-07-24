<script setup lang="ts">
import { UsersIcon, AdjustmentsVerticalIcon, BoltIcon, TrophyIcon } from '@heroicons/vue/24/outline'

defineProps<{
  feature: {
    icon: 'UsersIcon' | 'AdjustmentsVerticalIcon' | 'BoltIcon' | 'TrophyIcon'
    title: string
    description: string
  }
}>()

const icons = { UsersIcon, AdjustmentsVerticalIcon, BoltIcon, TrophyIcon }
</script>
<template>
  <div class="bg-nexBlack relative text-nexWhite p-6 text-center transition-all duration-300 group">
    <div
      class="absolute bg-transparent hover:bg-nexWhite/10 transition-colors duration-300 inset-0 w-full h-full z-10"
    ></div>
    <div
      class="w-10 h-10 border border-nexWhite/20 flex items-center justify-center mx-auto mb-4 group-hover:border-white transition-colors duration-300"
    >
      <component :is="icons[feature.icon]" class="w-5 h-5 text-nexWhite" />
    </div>
    <div class="text-sm font-bold text-nexWhite mb-2 tracking-wide">{{ feature.title }}</div>
    <div class="text-gray-400 text-xs font-light">{{ feature.description }}</div>
  </div>
</template>
