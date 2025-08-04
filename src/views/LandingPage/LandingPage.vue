<script setup lang="ts">
import ServicesView from './components/ServicesView.vue'
import AboutUsView from './components/AboutUsView.vue'
import TechnologiesStack from './components/TechnologiesStack.vue'
import ContactView from './components/ContactView.vue'
import HomeView from './components/HomeView.vue'
import BackgroundOfStars from '@/components/BackgroundOfStars.vue'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { onMounted } from 'vue'

gsap.registerPlugin({
  ScrollTrigger,
})
onMounted(() => {
  const tl = gsap.timeline()
  gsap.set('.sky', {
    y: 200,
    scale: 1.5,
  })
  gsap.to('.sky', {
    scrollTrigger: { trigger: 'body', start: 'top top', end: 'bottom bottom', scrub: true },
    y: 0,
    scale: 1,
  })
})
</script>

<template>
  <BackgroundOfStars class="z-10 pointer-events-none fixed w-screen h-svh top-0 left-0" />

  <HomeView />
  <ServicesView />
  <AboutUsView />
  <TechnologiesStack />
  <ContactView />
</template>
