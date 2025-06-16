<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/solid'

const isMenuOpen = ref(false)
const isScrolled = ref(false)

const navItems = ['Inicio', 'Servicios', 'Nosotros', 'Tecnologías', 'Contacto']
const sectionIds = ['home', 'services', 'about', 'tech', 'contact']

function scrollToSection(sectionId: string) {
  const element = document.getElementById(sectionId)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' })
    isMenuOpen.value = false
  }
}

function handleScroll() {
  isScrolled.value = window.scrollY > 0
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>

<template>
  <header
    :class="[
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300 md:bg-black/90 md:backdrop-blur-md',
      isScrolled ? 'md:border-b md:border-white/20' : ''
    ]"
  >
    <div class="max-w-7xl mx-auto sm:px-6 lg:px-8">
      <div :class="['flex justify-between items-center transition-all duration-300 p-4 max-md:bg-black/90 max-md:backdrop-blur-md',
        isScrolled && !isMenuOpen ? 'max-md:border-b max-md:border-white/20' : '' // Eliminado el -sm si no es una clase de tailwind
      ]">
        <div class="flex items-center space-x-3">
          <span class="text-white font-black text-xl tracking-tight">NexOrbs</span>
        </div>

        <nav class="hidden md:flex items-center space-x-8">
          <button
            v-for="(item, index) in navItems"
            :key="item"
            @click="scrollToSection(sectionIds[index])"
            class="text-gray-400 hover:text-white transition-colors duration-200 font-medium relative group"
          >
            {{ item }}
            <span
              class="absolute -bottom-1 left-0 w-0 h-0.5 bg-white transition-all duration-300 group-hover:w-full"
            ></span>
          </button>
        </nav>

        <button name="toggle menu" class="md:hidden text-white" @click="isMenuOpen = !isMenuOpen">
          <Bars3Icon v-if="!isMenuOpen" class="size-6" />
          <XMarkIcon v-else class="size-6" />
        </button>
      </div>

      <!-- Mobile Menu -->
       <div class="relative overflow-hidden"><Transition name="menu-slide">
      <div
        v-if="isMenuOpen"
        class="md:hidden bg-black/90 backdrop-blur-md border-b border-white/20 px-4"
      >
        <nav class="py-4 border-t border-white/20 space-y-2">
          <button
            v-for="(item, index) in navItems"
            :key="item"
            @click.prevent.self="scrollToSection(sectionIds[index])"
            class="block w-full text-left px-4 py-2 text-gray-400 hover:text-white hover:bg-white/5 transition-colors duration-200"
          >
            {{ item }}
          </button>
        </nav>
      </div></Transition></div>
    </div>
  </header>
</template>
