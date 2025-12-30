<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import BackgroundOfStars from '@/components/BackgroundOfStars.vue'
import WhiteLogo from '@/components/WhiteLogo.vue'
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
    router.push('/dashboard')
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
      <div class="login-card">
        <div class="logo-section">
          <WhiteLogo class="logo" />
          <h1 class="title">NexOrbs Dashboard</h1>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="userId">ID de Usuario</label>
            <input id="userId" v-model="formData.id" type="text" placeholder="a1b2c3d4e5f6g7h8" maxlength="16" required
              class="form-input" :disabled="isLoading" />
            <small>16 caracteres (ej: a1b2c3d4e5f6g7h8)</small>
          </div>

          <div class="form-group">
            <label for="displayName">Nombre de Usuario</label>
            <input id="displayName" v-model="formData.displayName" type="text" placeholder="Juan Pérez" required
              class="form-input" :disabled="isLoading" />
          </div>

          <div class="form-group">
            <label for="password">Contraseña</label>
            <input id="password" v-model="formData.password" type="password" placeholder="••••••••" required
              class="form-input" :disabled="isLoading" />
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
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: rgba(0, 0, 0, 0.8);
  border: 1px solid #333;
  border-radius: 16px;
  padding: 40px 32px;
  backdrop-filter: blur(10px);
}

.logo-section {
  text-align: center;
  margin-bottom: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo {
  width: 60px;
  height: 60px;
  margin-bottom: 16px;
}

.title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}

.subtitle {
  font-size: 14px;
  color: #999;
  margin: 0;
}

.login-form {
  margin-bottom: 24px;
}

.form-group {
  margin-bottom: 20px;
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
