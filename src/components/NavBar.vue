<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/solid'
import { AuthManager } from '@/helpers/authManager'
import WhiteLogo from './WhiteLogo.vue'
import { getCurrentNavItems, getCurrentSectionIds } from '@/consts/navItems'

const router = useRouter()
const isMenuOpen = ref(false)
const isScrolled = ref(false)
const activeSection = ref('')
const isManualScroll = ref(false)
const hasScrolled = ref(false)
const isLoggedIn = ref(false)
const user = ref<any>(null)

const currentRoute = router.currentRoute.value.path

const navItems = computed(() => getCurrentNavItems(currentRoute))
const sectionIds = computed(() => getCurrentSectionIds(currentRoute))

function checkAuthStatus() {
  isLoggedIn.value = AuthManager.isLoggedIn()
  user.value = AuthManager.getUser()
}

function getActiveState(index: number) {
  if (currentRoute === '/dashboard/login' && index === navItems.value.length - 1) return true
  if (currentRoute !== '/') return false
  if (currentRoute === '/' && index < sectionIds.value.length) return activeSection.value === sectionIds.value[index]

  return false
}

function shouldShowNavbar() {
  return currentRoute.startsWith('/dashboard') || hasScrolled.value
}

function goToByIndex(index: number) {
  isMenuOpen.value = false

  if (index < sectionIds.value.length && sectionIds.value[index]) {
    const sectionId = sectionIds.value[index]

    if (router.currentRoute.value.path === '/') {
      scrollToSection(sectionId)
    } else {
      router.push({ path: '/', hash: `#${sectionId}` })
    }
  } else {
    const routeName = navItems.value[index].toLowerCase()
    router.push({ name: routeName })
  }
}

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
  hasScrolled.value = hasScrolled.value ? true : isScrolled.value
  if (isManualScroll.value) {
    return
  }

  let currentActiveSection = ''
  const topThreshold = 100

  for (let i = sectionIds.value.length - 1; i >= 0; i--) {
    const sectionId = sectionIds.value[i]
    const section = document.getElementById(sectionId)
    if (section) {
      const rect = section.getBoundingClientRect()

      if (rect.top <= topThreshold && rect.bottom >= topThreshold) {
        currentActiveSection = sectionId
        break
      }
    }
  }

  if (currentActiveSection === '' && window.scrollY < topThreshold && sectionIds.value.length > 0) {
    currentActiveSection = sectionIds.value[0]
  }

  if (activeSection.value !== currentActiveSection) {
    activeSection.value = currentActiveSection
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
  handleScroll()
  checkAuthStatus()

  window.addEventListener('storage', checkAuthStatus)

  if (router.currentRoute.value.hash) {
    const sectionId = router.currentRoute.value.hash.replace('#', '')
    if (sectionIds.value.includes(sectionId)) {
      setTimeout(() => {
        scrollToSection(sectionId)
      }, 500)
    }
  }
})

watch(() => router.currentRoute.value, (newRoute, oldRoute) => {
  if (newRoute.path === '/' && newRoute.hash && newRoute.hash !== oldRoute?.hash) {
    const sectionId = newRoute.hash.replace('#', '')
    if (sectionIds.value.includes(sectionId)) {
      setTimeout(() => {
        scrollToSection(sectionId)
      }, 300)
    }
  }
}, { immediate: true })

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('storage', checkAuthStatus)
})
</script>

<template>
  <header :class="[
    'fixed top-0 left-0 right-0 z-50 transition-all duration-500 md:bg-nexBlack',
    isScrolled ? 'md:border-b md:border-nexWhite/20 ' : '',
    shouldShowNavbar() ? 'translate-y-0' : '-translate-y-full',
  ]">
    <div class="max-w-7xl mx-auto">
      <div :class="[
        'flex justify-between items-center transition-all duration-300 p-4 sm:px-10 max-md:bg-nexBlack',
        isScrolled && !isMenuOpen ? 'max-md:border-b max-md:border-nexWhite/20' : '',
      ]">
        <div v-if="currentRoute.startsWith('/dashboard')" class="header-left">
          <a href="/" class="flex gap-6 h-10 items-center">
            <WhiteLogo class="dashboard-logo" />
            <h1 class="dashboard-title">NexOrbs Dashboard</h1>
          </a>
        </div>
        <div v-else class="flex items-center space-x-3">
          <span class="text-nexWhite font-black text-xl tracking-tight">NexOrbs</span>
        </div>

        <nav class="hidden md:flex items-center space-x-8">
          <button v-for="(item, index) in navItems" :key="item" @click="goToByIndex(index)" :class="[
            'text-gray-400 hover:text-nexWhite transition-colors duration-200 font-medium relative group cursor-pointer',
            { 'text-nexWhite': getActiveState(index) },
          ]">
            {{ item }}
            <span :class="[
              'absolute -bottom-1 left-0 w-0 h-0.5 bg-nexWhite transition-all duration-300 group-hover:w-full',
              { 'w-full': getActiveState(index) },
            ]"></span>
          </button>
        </nav>

        <button aria-label="toggle menu" class="toggle-menu md:hidden text-nexWhite" @click="isMenuOpen = !isMenuOpen">
          <Bars3Icon v-if="!isMenuOpen" class="size-6" />
          <XMarkIcon v-else class="size-6" />
        </button>
      </div>

      <div class="relative overflow-hidden">
        <Transition name="menu-slide">
          <div v-if="isMenuOpen" class="md:hidden bg-nexBlack border-b border-nexWhite/20 px-4">
            <nav class="py-4 border-t border-nexWhite/20 space-y-2">
              <button v-for="(item, index) in navItems" :key="item" @click.prevent.self="goToByIndex(index)" :class="[
                'block w-full text-left px-4 sm:px-10 py-2 text-gray-400 hover:text-nexWhite transition-colors duration-200',
                { 'text-nexWhite': getActiveState(index) },
              ]">
                {{ item }}
              </button>
            </nav>
          </div>
        </Transition>
      </div>
    </div>
  </header>
</template>

<style scoped>
.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.dashboard-logo {
  width: 40px;
  height: 40px;
}

.dashboard-title {
  font-size: 20px;
  color: #FFFFFF;
  font-weight: 700;
  margin: 0;
}
</style>
