<script setup lang="ts">
import { ArrowRightIcon } from '@heroicons/vue/24/outline'
import { BoltIcon } from '@heroicons/vue/24/solid'
import BlackButton from '@/components/BlackButton.vue'
import WhiteButton from '@/components/WhiteButton.vue'
import AnimatedLogo from '@/components/AnimatedLogo.vue'
import { nextTick, onMounted, ref } from 'vue'
import gsap from 'gsap'
import { SplitText } from 'gsap/SplitText'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Chip from '@/components/Chip.vue'

const steps = [
  { label: 'ESCUCHAMOS', desc: 'Tus necesidades' },
  { label: 'PROPONEMOS', desc: 'Soluciones óptimas' },
  { label: 'EJECUTAMOS', desc: 'Con vanguardia' },
  { label: 'LANZAMOS', desc: 'Y acompañamos' },
]

function scrollToAboutUs() {
  const section = document.getElementById('about')
  const offset = 60 // cantidad de píxeles antes
  if (section) {
    const elementTop = section.getBoundingClientRect().top + window.pageYOffset

    window.scrollTo({
      top: elementTop - offset,
      behavior: 'smooth',
    })
  }
}

gsap.registerPlugin(SplitText, ScrollTrigger)
const titleRef = ref<null | HTMLElement>(null)

onMounted(async () => {
  if (!titleRef.value) return
  await nextTick()
  const el = titleRef.value

  let splitter = new SplitText(el, { type: 'chars', absolute: false, linesClass: 'split-line' })

  let targets = splitter.chars

  targets.forEach((t) => {
    ;(t as HTMLElement).style.willChange = 'transform, opacity'
  })

  const tl = gsap.timeline({
    smoothChildTiming: true,
  })
  tl.set('#eWZEfwPv3ti1', { opacity: 0 })
  tl.set(targets, { opacity: 0, y: 40, immediateRender: false, force3D: true })
  tl.set('#underline', { width: 0 })
  tl.set('#nexorbs', {
    scale: 1.25,
    y: 140,
  })
  tl.set('#chip', { opacity: 0 })
  tl.set('#bottomContent', { opacity: 0, y: 130 })
  tl.set('#step', { opacity: 0 })
  tl.set('.step-details', { opacity: 0, y: -10 })

  tl.to('#eWZEfwPv3ti1', { opacity: 1, duration: 0.5 })
  tl.to(targets, {
    opacity: 1,
    y: 0,
    duration: 0.6,
    ease: 'power2.out',
    stagger: 0.1,
    force3D: true,
    delay: -0.2,
  })
  tl.to('#underline', { width: '100%', duration: 0.5, delay: -0.5 })
  tl.to('#nexorbs', {
    scale: 1.3,
    y: 130,
    duration: 0.6,
    ease: 'power2.out',
    force3D: true,
  })
  tl.to('#nexorbs', {
    scale: 1,
    duration: 1.2,
    delay: -0.2,
    y: 0,
    ease: 'power2.inOut',
    force3D: true,
  })
  tl.to(
    '#chip',
    {
      opacity: 1,
      duration: 0.6,
      delay: 0.5,
    },
    '<',
  )
  tl.to(
    '#bottomContent',
    {
      opacity: 1,
      duration: 0.6,
      y: 0,
    },
    '<',
  )
  tl.to('#step', {
    keyframes: {
      y: [0, -15, 0],
      ease: 'none',
      easeEach: 'power2.inOut',
    },
    opacity: 1,
    duration: 0.75,
    stagger: 0.2,
  })
  tl.to('.step-details', {
    y: 0,
    opacity: 1,
    duration: 0.75,
    stagger: 0.2,
    delay: -0.75,
  })
})
</script>

<template>
  <section
    id="home"
    class="flex justify-center relative overflow-hidden min-h-svh h-min bg-nexBlack"
  >
    <div
      id="content"
      class="max-w-7xl min-h-screen h-min flex items-center justify-center flex-col mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 py-16"
    >
      <!-- Chip -->
      <Chip class="mb-8 sm:mb-10">
        <BoltIcon class="w-4 h-4 text-nexWhite" />
        <span class="text-sm text-gray-300">Tech Solutions &amp; Beyond</span>
      </Chip>

      <!-- Logo + Título -->
      <div
        id="nexorbs"
        class="z-50 flex flex-col md:flex-row items-center justify-center gap-4 md:gap-6 mb-10"
      >
        <AnimatedLogo
          alt="NEXORBS Logo"
          class="md:size-40 object-contain size-24 select-none"
          draggable="false"
          :speed="0.5"
          :color="'white'"
        />
        <h1
          ref="titleRef"
          class="text-center md:text-left text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-extrabold text-nexWhite block"
        >
          <!-- NEXORBS -->
          <span class="font-extrabold text-nexWhite inline-block"> NEX </span>
          <span id="orbs" class="font-extrabold text-nexWhite relative inline-block">
            ORBS
            <div
              id="underline"
              class="absolute rounded-full -bottom-1 left-0 w-full h-0.5 bg-nexWhite"
            ></div>
          </span>
        </h1>
      </div>
      <div id="bottomContent">
        <!-- Descripción -->
        <p
          class="text-xl md:text-2xl text-gray-400 mb-12 max-w-4xl mx-auto leading-relaxed font-light"
        >
          Tu aliado en soluciones tecnológicas. Llevamos tu idea o negocio al siguiente nivel con
          desarrollo web, apps móviles y consultoría especializada.
        </p>

        <!-- Botones -->
        <div
          class="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-20"
        >
          <WhiteButton label="Comenzar Proyecto" @click="$emit('start-project')">
            <ArrowRightIcon
              class="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200 relative z-10"
            />
          </WhiteButton>

          <BlackButton v-on:click="scrollToAboutUs" label="Ver nuestro enfoque" />
        </div>

        <!-- Pasos -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
          <div v-for="(step, index) in steps" :key="index" class="text-center group">
            <div
              id="step"
              class="w-8 h-8 border border-nexWhite/20 bg-nexBlack rounded-full flex items-center justify-center mx-auto mb-4 group-hover:border-nexWhite transition-colors duration-300"
            >
              <span class="text-nexWhite text-sm font-bold select-none">{{ index + 1 }}</span>
            </div>
            <div class="step-details">
              <div class="text-nexWhite font-bold text-sm tracking-widest mb-2">
                {{ step.label }}
              </div>
              <div class="text-gray-400 text-xs">
                {{ step.desc }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
