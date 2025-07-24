<script setup lang="ts">
defineProps<{
  technology: TechnologyCardType
}>()

export interface TechnologyCardType {
  icon: string
  name: string
  description: string
}
</script>
<template>
  <div
    class="bg-nexBlack border border-nexWhite/20 p-4 hover:border-nexWhite/40 transition-all duration-300 group"
  >
    <div class="flex items-center space-x-3 mb-2">
      <img class="size-6" :src="technology.icon" :alt="`${technology.name} icon`" />

      <span class="text-nexWhite font-semibold text-sm">{{ technology.name }}</span>
    </div>
    <p class="text-gray-400 text-xs font-light leading-relaxed">
      {{ technology.description }}
    </p>
  </div>
</template>
