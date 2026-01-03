<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Bars3Icon, XMarkIcon } from '@heroicons/vue/24/solid'
import { AuthManager } from '@/helpers/authManager'
import WhiteLogo from './WhiteLogo.vue'
import { getCurrentNavItems, getCurrentSectionIds } from '@/consts/navItems'
import { showErrorToast } from '@/helpers/sweetAlerts'

const router = useRouter()
const isMenuOpen = ref(false)
const isUserDropdownOpen = ref(false)
const isScrolled = ref(false)
const activeSection = ref('')
const isManualScroll = ref(false)
const hasScrolled = ref(false)
const isLoggedIn = ref(false)
const user = ref<any>(null)

const currentRoute = router.currentRoute.value.path

const navItems = computed(() => getCurrentNavItems(currentRoute, isLoggedIn.value, user.value))
const sectionIds = computed(() => getCurrentSectionIds(currentRoute))

function checkAuthStatus() {
  isLoggedIn.value = AuthManager.isLoggedIn()
  user.value = AuthManager.getUser()
}

function handleAuthChange() {
  checkAuthStatus()
}

function handleWindowAuthChange(event: any) {
  if (event.detail) {
    isLoggedIn.value = event.detail.isLoggedIn
    user.value = event.detail.user
  } else {
    checkAuthStatus()
  }
}

function getRoleLabel(role?: string): string {
  const labels = {
    admin: 'Administrador',
    developer: 'Desarrollador',
    client: 'Cliente'
  }
  return labels[role as keyof typeof labels] || 'Desconocido'
}

function handleLogout() {
  AuthManager.logout()
  isUserDropdownOpen.value = false
}

async function copyUserId(userId: string) {
  try {
    await navigator.clipboard.writeText(userId)
  } catch {
    showErrorToast('Error al copiar el ID de usuario')
  }
}

function getActiveState(index: number) {
  const currentItem = navItems.value[index]

  // If on dashboard and this is the user item (when authenticated)
  if (currentRoute.startsWith('/dashboard') && isLoggedIn.value && index === navItems.value.length - 1) return true

  // If on login page and this is the Login item
  if (currentRoute === '/dashboard/login' && currentItem === 'Login') return true

  // If not on home page, don't show section-based active states
  if (currentRoute !== '/') return false

  // For home page, show active based on scroll position
  if (currentRoute === '/' && index < sectionIds.value.length) return activeSection.value === sectionIds.value[index]

  return false
}

function shouldShowNavbar() {
  return currentRoute.startsWith('/dashboard') || hasScrolled.value
}

function goToByIndex(index: number) {
  isMenuOpen.value = false
  const currentItem = navItems.value[index]

  if (isLoggedIn.value && index === navItems.value.length - 1 && currentItem !== 'Login') {
    isUserDropdownOpen.value = !isUserDropdownOpen.value
    return
  }

  if (currentItem === 'Login') {
    router.push('/dashboard/login')
    return
  }

  if (index < sectionIds.value.length && sectionIds.value[index]) {
    const sectionId = sectionIds.value[index]

    if (router.currentRoute.value.path === '/') {
      scrollToSection(sectionId)
    } else {
      router.push({ path: '/', hash: `#${sectionId}` })
    }
  } else {
    const routeName = currentItem.toLowerCase()
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
  window.addEventListener('click', handleClickOutside)
  handleScroll()
  checkAuthStatus()

  // Listen to auth changes
  AuthManager.addEventListener('authChanged', handleAuthChange)
  window.addEventListener('storage', checkAuthStatus)
  window.addEventListener('authChanged', handleWindowAuthChange)

  if (router.currentRoute.value.hash) {
    const sectionId = router.currentRoute.value.hash.replace('#', '')
    if (sectionIds.value.includes(sectionId)) {
      setTimeout(() => {
        scrollToSection(sectionId)
      }, 500)
    }
  }
})

const handleClickOutside = (event: Event) => {
  const target = event.target as Element
  if (!target.closest('.user-dropdown-container')) {
    isUserDropdownOpen.value = false
  }
}

watch(() => router.currentRoute.value, (newRoute, oldRoute) => {
  if (newRoute.path === '/' && newRoute.hash && newRoute.hash !== oldRoute?.hash) {
    const sectionId = newRoute.hash.replace('#', '')
    if (sectionIds.value.includes(sectionId)) {
      setTimeout(() => {
        scrollToSection(sectionId)
      }, 300)
    }
  }
  checkAuthStatus()
}, { immediate: true })

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('click', handleClickOutside)
  window.removeEventListener('storage', checkAuthStatus)
  window.removeEventListener('authChanged', handleWindowAuthChange)
  AuthManager.removeEventListener('authChanged', handleAuthChange)
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
            { 'user-dropdown-container relative': isLoggedIn && index === navItems.length - 1 && item !== 'Login' }
          ]">
            <div class="flex items-center gap-2">
              <span v-if="isLoggedIn && index === navItems.length - 1 && item !== 'Login'"
                class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                {{ user?.display_name?.charAt(0)?.toUpperCase() }}
              </span>
              {{ item }}
              <svg v-if="isLoggedIn && index === navItems.length - 1 && item !== 'Login'"
                class="w-4 h-4 ml-1 transition-transform" :class="{ 'rotate-180': isUserDropdownOpen }" fill="none"
                stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            </div>
            <span :class="[
              'absolute -bottom-1 left-0 w-0 h-0.5 bg-nexWhite transition-all duration-300 group-hover:w-full',
              { 'w-full': getActiveState(index) },
            ]"></span>

            <!-- User Dropdown Menu -->
            <div v-if="isLoggedIn && index === navItems.length - 1 && item !== 'Login' && isUserDropdownOpen"
              class="user-dropdown absolute top-full right-0 mt-2 w-64 bg-nexBlack border border-nexWhite/20 rounded-lg shadow-lg z-50">
              <div class="p-4 ">
                <div class="flex items-center gap-3">
                  <div
                    class="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-semibold text-white">
                    {{ user?.display_name?.charAt(0)?.toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-semibold text-white">{{ user?.display_name }}</div>
                    <div class="text-sm text-gray-400">{{ user?.email }}</div>
                    <button @click="copyUserId(user?.id)"
                      class="text-nexWhite/30 text-xs hover:text-nexWhite/50 transition-colors cursor-pointer relative group">
                      {{ user?.id }}
                    </button>
                  </div>
                </div>
              </div>
              <div class="border-t border-nexWhite/30 my-1 mx-2"></div>

              <div class="p-2">
                <div class="px-4 py-2 text-sm">
                  <div class="text-white font-medium">{{ getRoleLabel(user?.role) }}</div>
                </div>


                <button @click="router.push({ name: 'dashboard' })"
                  class="w-full text-left px-4 py-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded transition-colors">
                  Dashboard
                </button>

                <div class="border-t border-nexWhite/30 my-1"></div>

                <button @click="handleLogout"
                  class="w-full text-left px-4 py-2 text-sm text-red-400 hover:text-red-300 hover:bg-gray-700 rounded transition-colors">
                  Cerrar Sesión
                </button>
              </div>
            </div>
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
              <template v-for="(item, index) in navItems" :key="item">
                <div v-if="isLoggedIn && index === navItems.length - 1 && item !== 'Login'"
                  class="px-4 sm:px-10 py-4 border-b border-nexWhite/20">
                  <div class="flex items-center gap-3 mb-3">
                    <div
                      class="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-sm font-semibold text-white">
                      {{ user?.display_name?.charAt(0)?.toUpperCase() }}
                    </div>
                    <div>
                      <div class="text-white font-medium">{{ user?.display_name }}</div>
                      <div class="text-xs text-gray-400">{{ getRoleLabel(user?.role) }}</div>
                    </div>
                  </div>
                  <button @click="router.push('/dashboard')"
                    class="w-full text-left py-2 text-gray-400 hover:text-nexWhite transition-colors duration-200 mb-2">
                    Dashboard
                  </button>
                  <button @click="handleLogout"
                    class="w-full text-left py-2 text-red-400 hover:text-red-300 transition-colors duration-200">
                    Cerrar Sesión
                  </button>
                </div>
                <button v-else @click.prevent.self="goToByIndex(index)" :class="[
                  'block w-full text-left px-4 sm:px-10 py-2 text-gray-400 hover:text-nexWhite transition-colors duration-200',
                  { 'text-nexWhite': getActiveState(index) },
                ]">
                  {{ item }}
                </button>
              </template>
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

.user-dropdown {
  animation: fadeIn 0.2s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.user-dropdown-container {
  position: relative;
}
</style>
