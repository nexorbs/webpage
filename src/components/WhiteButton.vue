<script setup lang="ts">
defineProps<{
  label?: string
}>()

defineEmits(['click'])
</script>

<template>
  <button
    class="group relative bg-white text-black px-8 py-4 font-semibold transition-all duration-300 hover:bg-gray-100 flex items-center overflow-hidden rounded"
    @click="$emit('click', $event)"
  >
    <span
      class="relative z-10 flex items-center space-x-2 transition-colors duration-300 group-hover:text-white"
    >
      <span>{{ label }}</span>
      <slot></slot>
    </span>
    <span
      class="absolute inset-0 bg-black scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-0"
      aria-hidden="true"
    ></span>
  </button>
</template>
