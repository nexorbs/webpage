<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { AuthManager } from '@/helpers/authManager'
import { showSuccessToast, showErrorToast, showActionConfirmation } from '@/helpers/sweetAlerts'

// Types
interface User {
  id: string
  account_id: string
  display_name: string
  email: string
  role: string
  is_active: boolean
  created_at: string
  last_login: string | null
  company_name: string | null
  phone: string | null
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
}

// State
const users = ref<User[]>([])
const pagination = ref<Pagination | null>(null)
const loading = ref(false)
const error = ref('')
const submitting = ref(false)

// Filters
const filters = ref({
  role: '',
  active: ''
})

// Modals
const showCreateModal = ref(false)
const showEditModal = ref(false)
const editingUser = ref<User | null>(null)

// Form data
const formData = ref({
  display_name: '',
  email: '',
  role: '',
  phone: '',
  company_name: '',
  password: '',
  is_active: true
})

// Load users
const loadUsers = async (page = 1) => {
  loading.value = true
  error.value = ''

  try {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: '10'
    })

    if (filters.value.role) params.append('role', filters.value.role)
    if (filters.value.active) params.append('active', filters.value.active)

    const response = await fetch(`/api/users/list?${params}`, {
      headers: AuthManager.getAuthHeader()
    })

    const result = await response.json()

    if (result.success) {
      users.value = result.data.users
      pagination.value = result.data.pagination
    } else {
      error.value = result.error || 'Error al cargar usuarios'
    }
  } catch (err) {
    error.value = 'Error de conexión'
    console.error('Load users error:', err)
  } finally {
    loading.value = false
  }
}

// Utility functions
const getRoleLabel = (role: string): string => {
  const labels = {
    admin: 'Admin',
    developer: 'Dev',
    client: 'Cliente'
  }
  return labels[role as keyof typeof labels] || role
}

const formatDate = (dateString: string | null): string => {
  if (!dateString) return 'Nunca'
  return new Date(dateString).toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const clearFilters = () => {
  filters.value.role = ''
  filters.value.active = ''
  loadUsers(1)
}

const changePage = (page: number) => {
  if (pagination.value && page >= 1 && page <= pagination.value.totalPages) {
    loadUsers(page)
  }
}

// Modal functions
const closeModals = () => {
  showCreateModal.value = false
  showEditModal.value = false
  editingUser.value = null
  resetForm()
}

const resetForm = () => {
  formData.value = {
    display_name: '',
    email: '',
    role: '',
    phone: '',
    company_name: '',
    password: '',
    is_active: true
  }
}

const editUser = (user: User) => {
  editingUser.value = user
  formData.value = {
    display_name: user.display_name,
    email: user.email,
    role: user.role,
    phone: user.phone || '',
    company_name: user.company_name || '',
    password: '',
    is_active: user.is_active
  }
  showEditModal.value = true
}

const submitForm = async () => {
  submitting.value = true

  try {
    let response

    if (showCreateModal.value) {
      // Create user
      response = await AuthManager.register({
        ...formData.value,
        role: formData.value.role as 'client' | 'developer' | 'admin'
      })
    } else {
      // Update user
      const updateData: any = { ...formData.value }
      if (!updateData.password) delete updateData.password // Don't send empty password

      response = await fetch(`/api/users/${editingUser.value?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...AuthManager.getAuthHeader()
        },
        body: JSON.stringify(updateData)
      })

      response = await response.json()
    }

    if (response.success) {
      showSuccessToast(showCreateModal.value ? 'Usuario creado exitosamente' : 'Usuario actualizado exitosamente')
      closeModals()
      loadUsers(pagination.value?.page || 1)
    } else {
      showErrorToast(response.error || 'Error al procesar la solicitud')
    }
  } catch (err) {
    showErrorToast('Error de conexión')
    console.error('Submit form error:', err)
  } finally {
    submitting.value = false
  }
}

const toggleUserStatus = async (user: User) => {
  const action = user.is_active ? 'desactivar' : 'activar'
  const confirmed = await showActionConfirmation(
    `¿Estás seguro de ${action} a ${user.display_name}?`
  )

  if (!confirmed) return

  try {
    const response = await fetch(`/api/users/${user.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...AuthManager.getAuthHeader()
      },
      body: JSON.stringify({
        is_active: !user.is_active
      })
    })

    const result = await response.json()

    if (result.success) {
      showSuccessToast(`Usuario ${action} exitosamente`)
      loadUsers(pagination.value?.page || 1)
    } else {
      showErrorToast(result.error || 'Error al cambiar el estado del usuario')
    }
  } catch (err) {
    showErrorToast('Error de conexión')
    console.error('Toggle user status error:', err)
  }
}

async function copyUserId(userId: string) {
  try {
    await navigator.clipboard.writeText(userId)
  } catch {
    showErrorToast('Error al copiar el ID de usuario')
  }
}

// Initialize
onMounted(() => {
  loadUsers()
})
</script>

<template>
  <div class="user-management">
    <!-- Header -->
    <div class="management-header">
      <div class="header-content">
        <h1 class="page-title">👥 Gestión de Usuarios</h1>
        <p class="page-description">Administrar usuarios del sistema NexOrbs</p>
      </div>

      <button @click="showCreateModal = true" class="create-button">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
        </svg>
        Crear Usuario
      </button>
    </div>

    <!-- Filters -->
    <div class="filters-section">
      <div class="filters">
        <div class="filter-group">
          <label>Rol:</label>
          <select v-model="filters.role" @change="() => loadUsers()">
            <option value="">Todos</option>
            <option value="client">Cliente</option>
            <option value="developer">Desarrollador</option>
            <option value="admin">Administrador</option>
          </select>
        </div>

        <div class="filter-group">
          <label>Estado:</label>
          <select v-model="filters.active" @change="() => loadUsers()">
            <option value="">Todos</option>
            <option value="true">Activo</option>
            <option value="false">Inactivo</option>
          </select>
        </div>

        <button @click="clearFilters" class="clear-filters">
          Limpiar Filtros
        </button>
      </div>
    </div>

    <!-- Users Table -->
    <div class="table-container">
      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button @click="() => loadUsers()" class="retry-button">
          Reintentar
        </button>
      </div>

      <table v-else class="users-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Estado</th>
            <th>Último Login</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id" class="user-row">
            <td class="user-id cursor-pointer">
              <code @click="copyUserId(user.id)">{{ user.id.substring(0, 8) }}...</code>
            </td>
            <td class="user-name">
              <div class="user-info">
                <strong>{{ user.display_name }}</strong>
                <small v-if="user.company_name">{{ user.company_name }}</small>
              </div>
            </td>
            <td class="user-email">{{ user.email }}</td>
            <td class="user-role">
              <span :class="`role-badge role-${user.role}`">
                {{ getRoleLabel(user.role) }}
              </span>
            </td>
            <td class="user-status">
              <span :class="`status-badge ${user.is_active ? 'status-active' : 'status-inactive'}`">
                {{ user.is_active ? 'Activo' : 'Inactivo' }}
              </span>
            </td>
            <td class="user-login">
              {{ formatDate(user.last_login) }}
            </td>
            <td class="user-actions">
              <button @click="editUser(user)" class="action-button edit-button" title="Editar usuario">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </button>

              <button @click="toggleUserStatus(user)"
                :class="`action-button ${user.is_active ? 'deactivate-button' : 'activate-button'}`"
                :title="user.is_active ? 'Desactivar usuario' : 'Activar usuario'">
                <svg v-if="user.is_active" class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L5.636 5.636" />
                </svg>
                <svg v-else class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div v-if="pagination" class="pagination">
        <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="page-button">
          Anterior
        </button>

        <span class="page-info">
          Página {{ pagination.page }} de {{ pagination.totalPages }}
          ({{ pagination.total }} usuarios)
        </span>

        <button @click="changePage(pagination.page + 1)" :disabled="pagination.page >= pagination.totalPages"
          class="page-button">
          Siguiente
        </button>
      </div>
    </div>

    <!-- Create/Edit User Modal -->
    <div v-if="showCreateModal || showEditModal" class="modal-overlay" @click="closeModals">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h2>{{ showCreateModal ? 'Crear Usuario' : 'Editar Usuario' }}</h2>
          <button @click="closeModals" class="close-button">&times;</button>
        </div>

        <form @submit.prevent="submitForm" class="modal-form">
          <div class="form-row">
            <div class="form-group">
              <label>Nombre Completo *</label>
              <input v-model="formData.display_name" type="text" required class="form-input" placeholder="Juan Pérez" />
            </div>

            <div class="form-group">
              <label>Email *</label>
              <input v-model="formData.email" type="email" required class="form-input" placeholder="juan@empresa.com" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Rol *</label>
              <select v-model="formData.role" required class="form-input">
                <option value="">Seleccionar rol</option>
                <option value="client">Cliente</option>
                <option value="developer">Desarrollador</option>
                <option value="admin">Administrador</option>
              </select>
            </div>

            <div class="form-group">
              <label>Teléfono</label>
              <input v-model="formData.phone" type="tel" class="form-input" placeholder="+34 666 777 888" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Empresa</label>
              <input v-model="formData.company_name" type="text" class="form-input"
                placeholder="Nombre de la empresa" />
            </div>

            <div class="form-group">
              <label>{{ showCreateModal ? 'Contraseña *' : 'Nueva Contraseña' }}</label>
              <input v-model="formData.password" type="password" :required="showCreateModal" class="form-input"
                :placeholder="showCreateModal ? 'Contraseña' : 'Dejar vacío para mantener actual'" />
            </div>
          </div>

          <div v-if="showEditModal" class="form-row">
            <div class="form-group">
              <label class="checkbox-label">
                <input v-model="formData.is_active" type="checkbox" class="form-checkbox" />
                Usuario activo
              </label>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModals" class="cancel-button">
              Cancelar
            </button>
            <button type="submit" class="submit-button" :disabled="submitting">
              {{ submitting ? 'Procesando...' : (showCreateModal ? 'Crear Usuario' : 'Actualizar Usuario') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-management {
  padding: 24px;
  max-width: 1400px;
  margin: 0 auto;
}

.management-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 32px;
}

.header-content h1 {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin-bottom: 8px;
}

.header-content p {
  color: #94a3b8;
  margin: 0;
}

.create-button {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.create-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
}

.filters-section {
  padding: 20px;
  margin-bottom: 24px;
}

.filters {
  display: flex;
  gap: 24px;
  align-items: end;
  flex-wrap: wrap;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-group label {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 600;
}

.filter-group select {
  padding: 8px 12px;
  border: 1px solid #475569;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  font-size: 14px;
}

.clear-filters {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #64748b;
  border-radius: 6px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-filters:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.table-container {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid #334155;
  border-radius: 12px;
  overflow: hidden;
}

.loading-state,
.error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px;
  color: #94a3b8;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid #334155;
  border-top: 3px solid #0ea5e9;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 16px;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.users-table {
  width: 100%;
  border-collapse: collapse;
}

.users-table th {
  background: rgba(0, 0, 0, 0.5);
  color: #e2e8f0;
  font-weight: 600;
  padding: 16px;
  text-align: left;
  border-bottom: 1px solid #334155;
  font-size: 14px;
}

.user-row {
  border-bottom: 1px solid #334155;
  transition: background-color 0.2s ease;
}

.user-row:hover {
  background: rgba(255, 255, 255, 0.05);
}

.users-table td {
  padding: 16px;
  color: white;
  vertical-align: middle;
}

.user-id code {
  background: rgba(0, 0, 0, 0.5);
  padding: 4px 8px;
  border-radius: 4px;
  font-family: 'Courier New', monospace;
  font-size: 12px;
  color: #06b6d4;
}

.user-info strong {
  display: block;
  font-size: 14px;
  font-weight: 600;
}

.user-info small {
  color: #94a3b8;
  font-size: 12px;
}

.role-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
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

.status-badge {
  display: inline-block;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.status-active {
  background: #10b981;
  color: white;
}

.status-inactive {
  background: #64748b;
  color: white;
}

.user-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  padding: 6px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-button {
  background: #3b82f6;
  color: white;
}

.edit-button:hover {
  background: #2563eb;
}

.activate-button {
  background: #10b981;
  color: white;
}

.activate-button:hover {
  background: #059669;
}

.deactivate-button {
  background: #ef4444;
  color: white;
}

.deactivate-button:hover {
  background: #dc2626;
}

.pagination {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid #334155;
}

.page-button {
  padding: 8px 16px;
  background: transparent;
  border: 1px solid #475569;
  border-radius: 6px;
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
}

.page-button:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.1);
}

.page-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: #94a3b8;
  font-size: 14px;
}

/* Modal styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #334155;
}

.modal-header h2 {
  color: white;
  font-size: 20px;
  font-weight: 700;
  margin: 0;
}

.close-button {
  background: none;
  border: none;
  color: #94a3b8;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.2s ease;
}

.close-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.modal-form {
  padding: 24px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  color: #e2e8f0;
  font-size: 14px;
  font-weight: 600;
}

.form-input {
  padding: 12px 16px;
  border: 1px solid #475569;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.3);
  color: white;
  font-size: 14px;
  transition: all 0.3s ease;
}

.form-input:focus {
  border-color: #0ea5e9;
  outline: none;
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.1);
}

.checkbox-label {
  display: flex !important;
  flex-direction: row !important;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}

.form-checkbox {
  width: 16px;
  height: 16px;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 32px;
  padding-top: 20px;
  border-top: 1px solid #334155;
}

.cancel-button {
  padding: 12px 24px;
  background: transparent;
  border: 1px solid #64748b;
  border-radius: 8px;
  color: #94a3b8;
  cursor: pointer;
  transition: all 0.3s ease;
}

.cancel-button:hover {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.submit-button {
  padding: 12px 24px;
  background: linear-gradient(135deg, #0ea5e9, #06b6d4);
  border: none;
  border-radius: 8px;
  color: white;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.submit-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(14, 165, 233, 0.3);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

@media (max-width: 768px) {
  .user-management {
    padding: 16px;
  }

  .management-header {
    flex-direction: column;
    gap: 16px;
    align-items: stretch;
  }

  .filters {
    flex-direction: column;
    gap: 16px;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .modal {
    margin: 16px;
  }

  .users-table {
    font-size: 12px;
  }

  .users-table th,
  .users-table td {
    padding: 8px;
  }
}
</style>
