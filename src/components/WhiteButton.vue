<script setup lang="ts">
defineProps<{
  label?: string
  disabled?: boolean
}>()

defineEmits(['click'])
</script>

<template>
  <button :class="[
    'group relative border border-white bg-nexWhite text-nexBlack px-8 py-4 font-semibold transition-all duration-300 flex items-center overflow-hidden',
    disabled
      ? 'opacity-50 cursor-not-allowed'
      : 'cursor-pointer group-focus:text-nexWhite hover:bg-gray-100'
  ]" :disabled="disabled" @click="!disabled && $emit('click', $event)">
    <span :class="[
      'relative z-10 flex items-center space-x-2 transition-colors duration-300',
      !disabled && 'group-focus:text-nexWhite group-hover:text-nexWhite'
    ]">
      <span>{{ label }}</span>
      <slot></slot>
    </span>
    <span v-if="!disabled"
      class="absolute inset-0 bg-nexBlack scale-x-0 group-focus:scale-x-100 group-hover:scale-x-100 transition-transform duration-300 origin-left z-0"
      aria-hidden="true"></span>
  </button>
</template>
