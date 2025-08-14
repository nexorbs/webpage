<script setup lang="ts">
defineProps<{
  label?: string
}>()
defineEmits(['click'])
</script>

<template>
  <button
    class="border border-nexWhite/20 hover:border-nexWhite text-nexWhite px-8 py-4 font-semibold transition-all duration-300 bg-nexBlack hover:bg-nexBlack/95 cursor-pointer"
    @click="$emit('click', $event)"
  >
    <slot></slot>
    {{ label }}
  </button>
</template>
