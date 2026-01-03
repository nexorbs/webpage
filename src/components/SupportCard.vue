<script setup lang="ts">
defineProps<{
  card: {
    id: string
    title: string
    description: string
    icon: 'BugAntIcon' | 'SparklesIcon' | 'QuestionMarkCircleIcon' | 'LightBulbIcon' | 'ExclamationTriangleIcon' | 'ArrowPathIcon'
    priority: 'ALTA' | 'MEDIA' | 'PROGRAMADA'
    hours: string
  },
  icons: {
    [key: string]: any
  }
}>()
</script>

<template>
  <div
    class="group z-10 bg-nexBlack border border-nexWhite/20 p-8 hover:border-nexWhite/40 transition-all duration-500 relative overflow-hidden">
    <div
      class="absolute inset-0 bg-nexWhite/5 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left">
    </div>

    <div class="relative z-10">
      <div class="flex items-center justify-between mb-6">
        <div
          class="size-12 border border-nexWhite/20 flex items-center justify-center group-hover:border-nexWhite group-hover:bg-nexWhite transition-all duration-300">
          <component :is="icons[card.icon]"
            class="size-6 text-nexWhite group-hover:text-nexBlack transition-colors duration-300" />
        </div>
        <span class="text-xs font-medium tracking-widest" :class="{
          'text-red-400': card.priority === 'ALTA',
          'text-yellow-400': card.priority === 'MEDIA',
          'text-blue-400': card.priority === 'PROGRAMADA'
        }">
          {{ card.priority }}
        </span>
      </div>

      <h3 class="text-xl font-bold text-nexWhite mb-4 tracking-wide">
        {{ card.title }}
      </h3>

      <p class="text-gray-400 mb-6 leading-relaxed font-light">
        {{ card.description }}
      </p>

      <!-- Response Time -->
      <div class="flex items-center space-x-3">
        <div class="w-1 h-1 bg-nexWhite"></div>
        <span class="text-sm text-gray-300 font-medium">
          Tiempo de respuesta: {{ card.hours }}
        </span>
      </div>
    </div>
  </div>
</template>
