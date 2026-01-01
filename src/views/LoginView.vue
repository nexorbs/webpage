<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BackgroundOfStars from '@/components/BackgroundOfStars.vue'
import AnimatedLogo from '@/components/AnimatedLogo.vue'
import { AuthManager } from '@/helpers/authManager'
import { showSuccessToast, showErrorToast } from '@/helpers/sweetAlerts'
import WhiteButton from '@/components/WhiteButton.vue'

const router = useRouter()

const isLoading = ref(false)
const formData = ref({
  id: '',
  displayName: '',
  password: '',
})

onMounted(() => {
  if (AuthManager.isLoggedIn()) {
    // router.push('/dashboard') // Commented for debugging
  }
})

const handleLogin = async () => {
  if (isLoading.value) return

  isLoading.value = true

  try {
    const result = await AuthManager.login(
      formData.value.id,
      formData.value.displayName,
      formData.value.password,
    )

    if (result.success) {
      showSuccessToast('¡Login exitoso! Redirigiendo...')
      router.push('/dashboard')
    } else {
      showErrorToast(result.error || 'Error al iniciar sesión')
    }
  } catch (error) {
    console.error('Login error:', error)
    showErrorToast('Error de conexión')
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="min-h-[calc(100vh-80px)] flex items-center justify-center px-5">
    <!-- Background -->
    <div class="absolute inset-0 z-0">
      <BackgroundOfStars />
    </div>

    <!-- Content -->
    <div class="relative z-10 w-full max-w-7xl mx-auto flex flex-row items-center gap-10 px-12 not-md:flex-col not-md:pt-8">
      <!-- Logo Section -->
      <div class="w-1/2 flex flex-col items-center justify-center gap-5">
        <AnimatedLogo
          alt="NEXORBS Logo"
          class="select-none object-contain size-24 md:size-64 lg:size-96"
          draggable="false"
          :speed="0.5"
          :color="'white'"
        />

        <h1
          class="text-center font-extrabold text-nexWhite text-3xl md:text-5xl lg:text-6xl"
        >
          NexOrbs Dashboard
        </h1>
      </div>

      <!-- Login Card -->
      <div class="w-1/2 not-md:w-full">
        <h2 class="mb-8 text-center font-extrabold text-nexWhite text-xl md:text-3xl lg:text-4xl not-md:hidden">
          Inicio de Sesión
        </h2>

        <form @submit.prevent="handleLogin" class="flex flex-col gap-8">
          <!-- ID -->
          <div class="flex flex-col gap-2">
            <label class="text-md font-bold tracking-wide text-nexWhite"> ID de Usuario </label>

            <input
              v-model="formData.id"
              type="text"
              maxlength="16"
              required
              :disabled="isLoading"
              placeholder="a1b2c3d4e5f6g7h8"
              class="bg-transparent border-0 border-b border-white/20 py-3 text-nexWhite placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:border-white hover:border-white disabled:opacity-50"
            />

            <small class="text-xs text-zinc-500"> 16 caracteres (ej: a1b2c3d4e5f6g7h8) </small>
          </div>

          <!-- Display Name -->
          <div class="flex flex-col gap-2">
            <label class="text-md font-bold tracking-wide text-nexWhite"> Nombre de Usuario </label>

            <input
              v-model="formData.displayName"
              type="text"
              required
              :disabled="isLoading"
              placeholder="Juan Pérez"
              class="bg-transparent border-0 border-b border-white/20 py-3 text-nexWhite placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:border-white hover:border-white disabled:opacity-50"
            />
          </div>

          <!-- Password -->
          <div class="flex flex-col gap-2">
            <label class="text-md font-bold tracking-wide text-nexWhite"> Contraseña </label>

            <input
              v-model="formData.password"
              type="password"
              required
              :disabled="isLoading"
              placeholder="••••••••"
              class="bg-transparent border-0 border-b border-white/20 py-3 text-nexWhite placeholder-gray-500 transition-colors duration-200 focus:outline-none focus:border-white hover:border-white disabled:opacity-50"
            />
          </div>

          <WhiteButton
            type="submit"
            :label="isLoading ? 'Iniciando...' : 'Iniciar Sesión'"
            :disabled="isLoading"
            class="w-full justify-center"
          />
        </form>
      </div>
    </div>
  </div>
</template>
