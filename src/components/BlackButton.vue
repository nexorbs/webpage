<script setup lang="ts">
defineProps<{
  label?: string
}>()
defineEmits(['click'])
</script>

<template>
  <button
    class="border border-white/20 hover:border-white text-white px-8 py-4 font-semibold transition-all duration-300 bg-black hover:bg-black/95 cursor-pointer"
    @click="$emit('click', $event)"
  >
    <slot></slot>
    {{ label }}
  </button>
</template>
