<script setup lang="ts">
import type { TechnologyCardType } from './TechnologyCard.vue'
import TechnologyCard from './TechnologyCard.vue'

defineProps<{
  category: {
    category: string
    techs: TechnologyCardType[]
  }
}>()
</script>
<template>
  <div class="space-y-6">
    <h3
      class="text-nexWhite font-bold text-lg tracking-wide text-center border-b border-nexWhite/20 pb-4"
    >
      {{ category.category.toUpperCase() }}
    </h3>

    <div class="space-y-4">
      <TechnologyCard
        v-for="(technology, index) in category.techs"
        :technology="technology"
        :key="index"
      />
    </div>
  </div>
</template>
