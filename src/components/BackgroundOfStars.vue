<template>
  <div class="sky">
    <div class="stars">
      <span v-for="n in 100" :key="'star-' + n" class="star" :style="getStarStyle()" />
    </div>
  </div>
</template>

<script setup lang="ts">
const getStarStyle = () => {
  const top = Math.random() * 100
  const left = Math.random() * 100
  const duration = 2 + Math.random() * 2
  const delay = Math.random() * 2
  const size = Math.random() * 1.5 + 0.5
  return `
    top: ${top}%;
    left: ${left}%;
    width: ${size}px;
    height: ${size}px;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    animation-fill-mode: both;
  `
}
</script>

<style scoped>
.sky {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
  z-index: 0;
}

.star {
  position: absolute;
  background: white;
  border-radius: 50%;
  animation: twinkle 2s infinite ease-in-out alternate;
  animation-fill-mode: both;
}

@keyframes twinkle {
  from {
    opacity: 0.1;
    transform: scale(1);
  }
  to {
    opacity: 1;
    transform: scale(1.3);
  }
}
</style>
