<script setup lang="ts">
import { defineProps } from 'vue'

const props = defineProps<{
  type: {
    type: string
    default: 'button'
  }
  disabled: {
    type: boolean
    default: false
  }
  text: {
    type: string
    default: 'Click Me'
  }
}>()
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="border border-white/20 hover:border-white text-white px-8 py-4 font-semibold transition-all duration-300 hover:bg-white/5"
  >
    <slot />
    {{ props.text }}
  </button>
</template>
