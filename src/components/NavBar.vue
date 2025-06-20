<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/solid'

const isMenuOpen = ref(false)
const isScrolled = ref(false)
const activeSection = ref('')
const isManualScroll = ref(false)

const navItems = ['Inicio', 'Servicios', 'Nosotros', 'Tecnologías', 'Contacto']
const sectionIds = ['home', 'services', 'about', 'tech', 'contact']

function scrollToSection(sectionId: string) {
  isMenuOpen.value = false
  const section = document.getElementById(sectionId)
  const offset = 60

  if (section) {
    isManualScroll.value = true
    activeSection.value = sectionId

    const elementTop = section.getBoundingClientRect().top + window.pageYOffset

    window.scrollTo({
      top: elementTop - offset,
      behavior: 'smooth',
    })

    setTimeout(() => {
      isManualScroll.value = false
      handleScroll()
    }, 800)
  }
}

function handleScroll() {
  isScrolled.value = window.scrollY > 0

  if (isManualScroll.value) {
    return
  }

  let currentActiveSection = ''
  const topThreshold = 100

  for (let i = sectionIds.length - 1; i >= 0; i--) {
    const sectionId = sectionIds[i]
    const section = document.getElementById(sectionId)
    if (section) {
      const rect = section.getBoundingClientRect()

      if (rect.top <= topThreshold && rect.bottom >= topThreshold) {
        currentActiveSection = sectionId
        break
      }
    }
  }

  if (currentActiveSection === '' && window.scrollY < topThreshold && sectionIds.length > 0) {
    currentActiveSection = sectionIds[0]
  }

  if (activeSection.value !== currentActiveSection) {
    activeSection.value = currentActiveSection
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:bg-black',
      isScrolled ? 'md:border-b md:border-white/20' : '',
    ]"
  >
    <div class="max-w-7xl mx-auto">
      <div
        :class="[
          'flex justify-between items-center transition-all duration-300 p-4 sm:px-10 max-md:bg-black',
          isScrolled && !isMenuOpen ? 'max-md:border-b max-md:border-white/20' : '',
        ]"
      >
        <div class="flex items-center space-x-3">
          <span class="text-white font-black text-xl tracking-tight">NexOrbs</span>
        </div>

        <nav class="hidden md:flex items-center space-x-8">
          <button
            v-for="(item, index) in navItems"
            :key="item"
            @click="scrollToSection(sectionIds[index])"
            :class="[
              'text-gray-400 hover:text-white transition-colors duration-200 font-medium relative group cursor-pointer',
              { 'text-white': activeSection === sectionIds[index] },
            ]"
          >
            {{ item }}
            <span
              :class="[
                'absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full',
                { 'w-full': activeSection === sectionIds[index] },
              ]"
            ></span>
          </button>
        </nav>

        <button
          aria-label="toggle menu"
          class="toggle-menu md:hidden text-white"
          @click="isMenuOpen = !isMenuOpen"
        >
          <Bars3Icon v-if="!isMenuOpen" class="size-6" />
          <XMarkIcon v-else class="size-6" />
        </button>
      </div>

      <div class="relative overflow-hidden">
        <Transition name="menu-slide">
          <div v-if="isMenuOpen" class="md:hidden bg-black border-b border-white/20 px-4">
            <nav class="py-4 border-t border-white/20 space-y-2">
              <button
                v-for="(item, index) in navItems"
                :key="item"
                @click.prevent.self="scrollToSection(sectionIds[index])"
                :class="[
                  'block w-full text-left px-4 sm:px-10 py-2 text-gray-400 hover:text-white transition-colors duration-200',
                  { 'text-white': activeSection === sectionIds[index] },
                ]"
              >
                {{ item }}
              </button>
            </nav>
          </div></Transition
        >
      </div>
    </div>
  </header>
</template>
