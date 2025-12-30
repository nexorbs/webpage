<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { AuthManager, type User } from '@/helpers/authManager'
import { showSuccessToast, showErrorToast } from '@/helpers/sweetAlerts'

const router = useRouter()
const user = ref<User | null>(null)

onMounted(async () => {
  if (!AuthManager.isLoggedIn()) {
    router.push('/login')
    return
  }

  // Verify token
  // const isValid = await AuthManager.verifyToken()
  // if (!isValid) {
  // showErrorToast('Sesión expirada')
  // router.push('/login')
  // return
  // }

  // Get user data
  user.value = AuthManager.getUser()
})

const getRoleLabel = (role?: string): string => {
  const labels = {
    admin: 'Administrador',
    developer: 'Desarrollador',
    client: 'Cliente'
  }
  return labels[role as keyof typeof labels] || 'Desconocido'
}

const handleLogout = () => {
  AuthManager.logout()
  showSuccessToast('Sesión cerrada exitosamente')
}
</script>

<template>
  <div class="dashboard-container bg-nexBlack">
    <header class="dashboard-header">
      <div class="header-content">

        <div class="header-right">
          <div class="user-info">
            <div class="user-details">
              <span class="user-name">{{ user?.display_name }}</span>
              <span class="user-role" :class="`role-${user?.role}`">
                {{ getRoleLabel(user?.role) }}
              </span>
            </div>
            <button @click="handleLogout" class="logout-button">
              Cerrar Sesión
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="dashboard-main">
      <div v-if="user?.role === 'admin'" class="role-section">
        <div class="section-header">
          <h2>Panel de Administrador</h2>
          <p>Gestiona usuarios, proyectos y tickets del sistema</p>
        </div>

        <div class="dashboard-grid">
          <div class="dashboard-card">
            <h3>👥 Gestión de Usuarios</h3>
            <p>Crear y administrar cuentas de clientes y desarrolladores</p>
            <button @click="router.push({ name: 'user-management' })" class="card-action">Gestionar Usuarios</button>
          </div>

          <div class="dashboard-card">
            <h3>📊 Proyectos</h3>
            <p>Gestionar proyectos y asignaciones de clientes</p>
            <button @click="router.push({ name: 'project-management' })" class="card-action">Gestionar
              Proyectos</button>
          </div>

          <div class="dashboard-card">
            <h3>🎫 Tickets</h3>
            <p>Supervisar y asignar tickets a desarrolladores</p>
            <button @click="router.push({ name: 'ticket-management' })" class="card-action">Gestionar Tickets</button>
          </div>

          <div class="dashboard-card">
            <h3>📈 Reportes</h3>
            <p>Estadísticas y métricas del sistema</p>
            <button class="card-action">Ver Reportes</button>
          </div>
        </div>
      </div>

      <!-- Developer Dashboard -->
      <div v-if="user?.role === 'developer'" class="role-section">
        <div class="section-header">
          <h2>Panel de Desarrollador</h2>
          <p>Gestiona tus tickets asignados y proyectos</p>
        </div>

        <div class="dashboard-grid">
          <div class="dashboard-card">
            <h3>🎯 Mis Tickets</h3>
            <p>Tickets asignados y en progreso</p>
            <button class="card-action">Ver Tickets</button>
          </div>

          <div class="dashboard-card">
            <h3>📋 Proyectos</h3>
            <p>Proyectos en los que colaboras</p>
            <button @click="router.push({ name: 'project-management' })" class="card-action">Ver Proyectos</button>
          </div>

          <div class="dashboard-card">
            <h3>🎫 Tickets</h3>
            <p>Tickets asignados y estado</p>
            <button @click="router.push({ name: 'ticket-management' })" class="card-action">Ver Tickets</button>
          </div>

          <div class="dashboard-card">
            <h3>⏱️ Tiempo</h3>
            <p>Registro de tiempo y actividades</p>
            <button class="card-action">Registrar Tiempo</button>
          </div>
        </div>
      </div>

      <!-- Client Dashboard -->
      <div v-if="user?.role === 'client'" class="role-section">
        <div class="section-header">
          <h2>Panel de Cliente</h2>
          <p>Gestiona tus proyectos y tickets</p>
        </div>

        <div class="dashboard-grid">
          <div class="dashboard-card">
            <h3>📂 Mis Proyectos</h3>
            <p>Proyectos activos y completados</p>
            <button @click="router.push({ name: 'project-management' })" class="card-action">Ver Mis Proyectos</button>
          </div>

          <div class="dashboard-card">
            <h3>🎫 Mis Tickets</h3>
            <p>Estado de tus solicitudes y reportes</p>
            <button @click="router.push({ name: 'ticket-management' })" class="card-action">Ver Tickets</button>
          </div>
        </div>
      </div>

      <!-- System Info (for all roles) -->
      <div class="system-info">
        <h3>Información del Sistema</h3>
        <div class="info-grid">
          <div class="info-item">
            <strong>Usuario ID:</strong>
            <code>{{ user?.id }}</code>
          </div>
          <div class="info-item">
            <strong>Account ID:</strong>
            <code>{{ user?.account_id }}</code>
          </div>
          <div class="info-item">
            <strong>Email:</strong>
            {{ user?.email }}
          </div>
          <div class="info-item">
            <strong>Rol:</strong>
            <span :class="`role-badge role-${user?.role}`">
              {{ getRoleLabel(user?.role) }}
            </span>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  color: white;
}

.dashboard-header {
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid #334155;
  padding: 16px 24px;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1200px;
  margin: 0 auto;
}


.user-info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-details {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.user-name {
  font-weight: 600;
  font-size: 14px;
}

.user-role {
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 12px;
  font-weight: 500;
}

.role-admin {
  background: #dc2626;
  color: white;
}

.role-developer {
  background: #0ea5e9;
  color: white;
}

.role-client {
  background: #059669;
  color: white;
}

.logout-button {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #475569;
  border-radius: 8px;
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.logout-button:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: #64748b;
}

.dashboard-main {
  padding: 32px 24px;
  max-width: 1200px;
  margin: 0 auto;
}

.role-section {
  margin-bottom: 48px;
}

.section-header {
  text-align: center;
  margin-bottom: 32px;
}

.section-header h2 {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.section-header p {
  font-size: 16px;
  color: #94a3b8;
  margin: 0;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 24px;
  margin-bottom: 32px;
}

.dashboard-card {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #334155;
  border-radius: 16px;
  padding: 24px;
  transition: all 0.3s ease;
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  border-color: #475569;
}

.dashboard-card h3 {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 12px;
  color: #f1f5f9;
}

.dashboard-card p {
  color: #94a3b8;
  margin-bottom: 20px;
  line-height: 1.5;
}

.card-action {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.card-action:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(14, 165, 233, 0.3);
}

.system-info {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid #334155;
  border-radius: 12px;
  padding: 24px;
  margin-top: 32px;
}

.system-info h3 {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: #94a3b8;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 16px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  font-size: 14px;
}

.info-item strong {
  color: #e2e8f0;
}

.info-item code {
  background: rgba(0, 0, 0, 0.3);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #06b6d4;
}

.role-badge {
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 16px;
  }

  .user-info {
    width: 100%;
    justify-content: space-between;
  }

  .dashboard-main {
    padding: 24px 16px;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
