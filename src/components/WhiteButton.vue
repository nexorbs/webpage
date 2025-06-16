<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

defineProps({
  label: {
    type: String,
    default: 'COMENZAR PROYECTO',
  },
  type: {
    type: String,
    default: 'button',
  },
})

defineEmits(['click'])
</script>

<template>
  <button
    class="group relative bg-white text-black px-8 py-4 font-semibold transition-all duration-300 hover:bg-gray-100 flex items-center overflow-hidden rounded max-w-xs w-full"
    :type="type"
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
