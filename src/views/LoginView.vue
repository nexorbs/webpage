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
  password: ''
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
      formData.value.password
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
  <div class="login-container">
    <div class="login-background">
      <BackgroundOfStars />
    </div>

    <div class="login-content">
      <div class="logo-section">
        <AnimatedLogo alt="NEXORBS Logo" class="md:size-96 object-contain size-24 select-none" draggable="false"
          :speed="0.5" :color="'white'" />
        <h1 class="text-center text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-nexWhite block">NexOrbs Dashboard</h1>
      </div>
<!-- wawawawa -->
      <div class="login-card">
        <h2 class="text-center text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold text-nexWhite block mb-8">Inicio de Sesión</h2>
        <form @submit.prevent="handleLogin" class="login-form">
          <div>
            <label htmlFor="userId" class="block text-md font-bold text-nexWhite mb-3 tracking-wide">
              ID de Usuario
            </label>
            <input type="text" id="userId" name="userId" v-model="formData.id" maxlength="16" required :disabled="isLoading"
              class="w-full px-0 py-3 bg-transparent border-0 border-b border-nexWhite/20 focus:border-nexWhite hover:border-nexWhite text-nexWhite placeholder-gray-500 transition-all duration-200 focus:outline-none"
              placeholder="a1b2c3d4e5f6g7h8" />
            <small class="text-zinc-700">16 caracteres (ej: a1b2c3d4e5f6g7h8)</small>
          </div>

          <div>
            <label htmlFor="displayName" class="block text-md font-bold text-nexWhite mb-3 tracking-wide">
              Nombre de Usuario
            </label>
            <input type="text" id="displayName" name="displayName" v-model="formData.displayName" required :disabled="isLoading"
              class="w-full px-0 py-3 bg-transparent border-0 border-b border-nexWhite/20 focus:border-nexWhite hover:border-nexWhite text-nexWhite placeholder-gray-500 transition-all duration-200 focus:outline-none"
              placeholder="Juan Pérez" />
          </div>

          <div>
            <label htmlFor="password" class="block text-md font-bold text-nexWhite mb-3 tracking-wide">
              Contraseña
            </label>
            <input type="password" id="password" name="password" v-model="formData.password" required :disabled="isLoading"
              class="w-full px-0 py-3 bg-transparent border-0 border-b border-nexWhite/20 focus:border-nexWhite hover:border-nexWhite text-nexWhite placeholder-gray-500 transition-all duration-200 focus:outline-none"
              placeholder="••••••••" />
          </div>

          <WhiteButton type="submit" :label="isLoading ? 'Iniciando...' : 'Iniciar Sesión'" :disabled="isLoading"
            class="w-full justify-center" />
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-container {
  min-height: calc(100vh - 80px);
  /* Ajustar para el navbar */
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.login-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
}

.login-content {
  display: flex;
  flex-direction: row;
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 1200px;
  align-items: center;
}

.login-card {
  height: 100%;

  width: 50%;
}

.logo-section {
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
  justify-content: center;
  width: 50%;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
}


.login-form {
  margin-bottom: 24px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 600;
  color: white;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid #333;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #ffffff;
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.form-input::placeholder {
  color: #666;
}

.form-group small {
  display: block;
  font-size: 12px;
  color: #666;
  margin-top: 4px;
}

@media (max-width: 480px) {
  .login-card {
    padding: 24px 20px;
  }

  .title {
    font-size: 20px;
  }
}
</style>
