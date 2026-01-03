<script setup lang="ts"></script>
<template>
  <div id="chip"
    class="relative inline-flex items-center space-x-2 bg-nexWhite/5 backdrop-blur-sm border border-nexWhite/20 rounded-full px-4 py-2">
    <slot></slot>
  </div>
</template>
<style scoped>
#chip:before,
#chip:after {
  content: '';
  position: absolute;
  left: -2px;
  top: -2px;
  background: linear-gradient(90deg, transparent 30%, #faf9f6 50%, transparent 70%);
  background-size: 400%;
  background-repeat: no-repeat;
  width: calc(100% + 4px);
  height: calc(100% + 4px);
  z-index: 1;
  opacity: 0.075;
  animation: steam 10s linear infinite;
  border-radius: calc(infinity * 1px);
}

@keyframes steam {
  0% {
    background-position: 800% 0;
  }

  100% {
    background-position: 0 0;
  }
}
</style>
