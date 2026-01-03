<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { authManager } from '@/helpers/authManager';
import { projectService, type Project, type CreateProjectData, type UpdateProjectData } from '@/helpers/projectService';
import { userService, type User } from '@/helpers/userService';
import WhiteButton from '@/components/WhiteButton.vue';
import Chip from '@/components/Chip.vue';
import Swal from 'sweetalert2';

// Reactive data
const projects = ref<Project[]>([]);
const clients = ref<User[]>([]);
const loading = ref(false);
const saving = ref(false);
const showModal = ref(false);
const editingProject = ref<Project | null>(null);

const filters = reactive({
  status: '',
  type: '',
  client_id: '',
  page: 1,
  limit: 10
});

const pagination = reactive({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
});

const formData = reactive({
  name: '',
  description: '',
  type: '',
  client_id: '',
  status: 'active',
  estimated_budget: null as number | null,
  estimated_duration: null as number | null,
  start_date: '',
  deadline: ''
});

// Computed properties
const userRole = computed(() => authManager.getRole());
const canCreateProjects = computed(() => userRole.value === 'admin');
const canEditProjects = computed(() => userRole.value === 'admin');

const projectTypes = computed(() => projectService.getProjectTypes());
const projectStatuses = computed(() => projectService.getProjectStatuses());

// Methods
const loadProjects = async () => {
  try {
    loading.value = true;
    const response = await projectService.getProjects(filters);

    projects.value = response.projects;
    Object.assign(pagination, response.pagination);
    filters.page = response.pagination.page;

  } catch (error) {
    console.error('Error loading projects:', error);
    Swal.fire({
      title: 'Error',
      text: 'No se pudieron cargar los proyectos',
      icon: 'error',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });
  } finally {
    loading.value = false;
  }
};

const loadClients = async () => {
  if (userRole.value !== 'admin') return;

  try {
    const response = await userService.getUsers({ role: 'client', is_active: true, limit: 100 });
    clients.value = response.users;
  } catch (error) {
    console.error('Error loading clients:', error);
  }
};

const changePage = (page: number) => {
  filters.page = page;
  loadProjects();
};

const openCreateModal = () => {
  editingProject.value = null;
  resetForm();
  showModal.value = true;
};

const openEditModal = (project: Project) => {
  editingProject.value = project;
  fillForm(project);
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingProject.value = null;
  resetForm();
};

const resetForm = () => {
  Object.assign(formData, {
    name: '',
    description: '',
    type: '',
    client_id: '',
    status: 'active',
    estimated_budget: null,
    estimated_duration: null,
    start_date: '',
    deadline: ''
  });
};

const fillForm = (project: Project) => {
  Object.assign(formData, {
    name: project.name,
    description: project.description || '',
    type: project.type,
    client_id: project.client_id,
    status: project.status,
    estimated_budget: project.estimated_budget,
    estimated_duration: project.estimated_duration,
    start_date: project.start_date || '',
    deadline: project.deadline || ''
  });
};

const saveProject = async () => {
  try {
    saving.value = true;

    if (editingProject.value) {
      // Update existing project
      const updateData: UpdateProjectData = {
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type as any,
        client_id: formData.client_id,
        status: formData.status as any,
        estimated_budget: formData.estimated_budget || undefined,
        estimated_duration: formData.estimated_duration || undefined,
        start_date: formData.start_date || undefined,
        deadline: formData.deadline || undefined
      };

      await projectService.updateProject(editingProject.value.id, updateData);

      Swal.fire({
        title: 'Éxito',
        text: 'Proyecto actualizado correctamente',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } else {
      // Create new project
      const createData: CreateProjectData = {
        name: formData.name,
        description: formData.description || undefined,
        type: formData.type as any,
        client_id: formData.client_id,
        estimated_budget: formData.estimated_budget || undefined,
        estimated_duration: formData.estimated_duration || undefined,
        start_date: formData.start_date || undefined,
        deadline: formData.deadline || undefined
      };

      await projectService.createProject(createData);

      Swal.fire({
        title: 'Éxito',
        text: 'Proyecto creado correctamente',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }

    closeModal();
    loadProjects();

  } catch (error: any) {
    Swal.fire({
      title: 'Error',
      text: error.message || 'Error al guardar el proyecto',
      icon: 'error',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 5000
    });
  } finally {
    saving.value = false;
  }
};

const confirmDelete = async (project: Project) => {
  const result = await Swal.fire({
    title: '¿Eliminar proyecto?',
    html: `
      <p>¿Estás seguro de que quieres eliminar el proyecto:</p>
      <strong>${project.name}</strong>
      <p class="text-sm text-gray-600 mt-2">Esta acción no se puede deshacer.</p>
    `,
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#ef4444',
    cancelButtonColor: '#6b7280',
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  });

  if (result.isConfirmed) {
    try {
      await projectService.deleteProject(project.id);

      Swal.fire({
        title: 'Eliminado',
        text: 'El proyecto ha sido eliminado correctamente',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });

      loadProjects();
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Error al eliminar el proyecto',
        icon: 'error',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 5000
      });
    }
  }
};

// Helper methods
const getTypeInfo = (type: string) => projectService.getTypeInfo(type);
const getStatusInfo = (status: string) => projectService.getStatusInfo(status);
const formatBudget = (budget: number | null) => projectService.formatBudget(budget);
const formatDuration = (duration: number | null) => projectService.formatDuration(duration);
const formatDate = (date: string | null) => projectService.formatDate(date);

// Lifecycle
onMounted(() => {
  loadProjects();
  loadClients();
});
</script>

<template>
  <div class="project-management">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div class="title-section">
          <h1>Gestión de Proyectos</h1>
          <p>Administra y supervisa todos los proyectos activos</p>
        </div>
        <div class="actions" v-if="canCreateProjects">
          <WhiteButton @click="openCreateModal" icon="plus">
            Nuevo Proyecto
          </WhiteButton>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="filter-group">
        <label>Estado:</label>
        <select v-model="filters.status" @change="loadProjects">
          <option value="">Todos los estados</option>
          <option v-for="status in projectStatuses" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Tipo:</label>
        <select v-model="filters.type" @change="loadProjects">
          <option value="">Todos los tipos</option>
          <option v-for="type in projectTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>
      </div>

      <div class="filter-group" v-if="userRole === 'admin'">
        <label>Cliente:</label>
        <select v-model="filters.client_id" @change="loadProjects">
          <option value="">Todos los clientes</option>
          <option v-for="client in clients" :key="client.id" :value="client.id">
            {{ client.display_name }} {{ client.company_name ? `(${client.company_name})` : '' }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Por página:</label>
        <select v-model.number="filters.limit" @change="loadProjects">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>

    <!-- Projects Table -->
    <div class="table-container" v-if="!loading">
      <table class="projects-table">
        <thead>
          <tr>
            <th>Código</th>
            <th>Proyecto</th>
            <th>Cliente</th>
            <th>Tipo</th>
            <th>Estado</th>
            <th>Presupuesto</th>
            <th>Duración</th>
            <th>Fecha Límite</th>
            <th v-if="canEditProjects">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="project in projects" :key="project.id" class="project-row">
            <td>
              <span class="project-code">{{ project.project_code }}</span>
            </td>
            <td>
              <div class="project-info">
                <strong>{{ project.name }}</strong>
                <p v-if="project.description">{{ project.description }}</p>
              </div>
            </td>
            <td>
              <div class="client-info">
                <strong>{{ project.client_name }}</strong>
                <p v-if="project.company_name">{{ project.company_name }}</p>
                <small>{{ project.client_email }}</small>
              </div>
            </td>
            <td>
              <span class="type-chip" :style="{
                backgroundColor: getTypeInfo(project.type)?.color || '#3b82f6',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'inline-block'
              }">
                {{ getTypeInfo(project.type)?.label || project.type }}
              </span>
            </td>
            <td>
              <span class="status-chip" :style="{
                backgroundColor: getStatusInfo(project.status)?.color || '#10b981',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600',
                display: 'inline-block'
              }">
                {{ getStatusInfo(project.status)?.label || project.status }}
              </span>
            </td>
            <td>{{ formatBudget(project.estimated_budget) }}</td>
            <td>{{ formatDuration(project.estimated_duration) }}</td>
            <td>{{ formatDate(project.deadline) }}</td>
            <td v-if="canEditProjects">
              <div class="actions">
                <button @click="openEditModal(project)" class="edit-btn" title="Editar">
                  <i class="icon-edit"></i>
                </button>
                <button @click="confirmDelete(project)" class="delete-btn" title="Eliminar">
                  <i class="icon-delete"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-if="projects.length === 0" class="empty-state">
        <div class="empty-content">
          <i class="icon-projects"></i>
          <h3>No hay proyectos</h3>
          <p v-if="userRole === 'admin'">Comienza creando tu primer proyecto</p>
          <p v-else>Aún no tienes proyectos asignados</p>
          <WhiteButton v-if="canCreateProjects" @click="openCreateModal" icon="plus">
            Crear Primer Proyecto
          </WhiteButton>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando proyectos...</p>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="pagination.totalPages > 1">
      <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="page-btn">
        Anterior
      </button>

      <span class="page-info">
        Página {{ pagination.page }} de {{ pagination.totalPages }}
        ({{ pagination.total }} proyectos)
      </span>

      <button @click="changePage(pagination.page + 1)" :disabled="pagination.page === pagination.totalPages"
        class="page-btn">
        Siguiente
      </button>
    </div>

    <!-- Create/Edit Modal -->
    <div v-if="showModal" class="modal-overlay" @click="closeModal">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingProject ? 'Editar Proyecto' : 'Crear Nuevo Proyecto' }}</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>

        <form @submit.prevent="saveProject" class="modal-content">
          <div class="form-group">
            <label for="projectName">Nombre del Proyecto*</label>
            <input id="projectName" v-model="formData.name" type="text" required
              placeholder="Ingrese el nombre del proyecto" />
          </div>

          <div class="form-group">
            <label for="projectDescription">Descripción</label>
            <textarea id="projectDescription" v-model="formData.description" rows="3"
              placeholder="Describe brevemente el proyecto"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="projectType">Tipo de Proyecto*</label>
              <select id="projectType" v-model="formData.type" required>
                <option value="">Seleccionar tipo</option>
                <option v-for="type in projectTypes" :key="type.value" :value="type.value">
                  {{ type.label }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="projectClient">Cliente*</label>
              <select id="projectClient" v-model="formData.client_id" required>
                <option value="">Seleccionar cliente</option>
                <option v-for="client in clients" :key="client.id" :value="client.id">
                  {{ client.display_name }} {{ client.company_name ? `(${client.company_name})` : '' }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row" v-if="editingProject">
            <div class="form-group">
              <label for="projectStatus">Estado</label>
              <select id="projectStatus" v-model="formData.status">
                <option v-for="status in projectStatuses" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="projectBudget">Presupuesto Estimado (MXN)</label>
              <input id="projectBudget" v-model.number="formData.estimated_budget" type="number" min="0" step="1000"
                placeholder="0" />
            </div>

            <div class="form-group">
              <label for="projectDuration">Duración Estimada (días)</label>
              <input id="projectDuration" v-model.number="formData.estimated_duration" type="number" min="1"
                placeholder="30" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="startDate">Fecha de Inicio</label>
              <input id="startDate" v-model="formData.start_date" type="date" />
            </div>

            <div class="form-group">
              <label for="deadline">Fecha Límite</label>
              <input id="deadline" v-model="formData.deadline" type="date" />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">
              Cancelar
            </button>
            <button type="submit" class="save-btn" :disabled="saving">
              {{ saving ? 'Guardando...' : (editingProject ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>
.project-management {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.header {
  margin-bottom: 2rem;
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 2rem;
}

.title-section h1 {
  font-size: 2.5rem;
  font-weight: 700;
  color: white;
  margin: 0;
}

.title-section p {
  color: rgba(255, 255, 255, 0.7);
  margin: 0.5rem 0 0 0;
  font-size: 1.1rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  align-items: end;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  min-width: 150px;
}

.filter-group label {
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
}

.filter-group select {
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.875rem;
}

.filter-group select option {
  background-color: #1f1f1f;
  color: white;
}

.table-container {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.projects-table {
  width: 100%;
  border-collapse: collapse;
}

.projects-table th {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.projects-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: white;
}

.project-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.project-code {
  font-family: 'Courier New', monospace;
  background: rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #00d4ff;
}

.project-info strong {
  display: block;
  margin-bottom: 0.25rem;
}

.project-info p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin: 0;
}

.client-info strong {
  display: block;
}

.client-info p {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  margin: 0.25rem 0;
}

.client-info small {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.edit-btn {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.3);
}

.delete-btn {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
}

.delete-btn:hover {
  background: rgba(239, 68, 68, 0.3);
}

.empty-state {
  padding: 4rem 2rem;
  text-align: center;
}

.empty-content i {
  font-size: 4rem;
  color: rgba(255, 255, 255, 0.3);
  margin-bottom: 1rem;
}

.empty-content h3 {
  color: white;
  margin: 1rem 0;
  font-size: 1.5rem;
}

.empty-content p {
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 2rem;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: white;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.3);
  border-top: 3px solid #00d4ff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }

  100% {
    transform: rotate(360deg);
  }
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: rgba(255, 255, 255, 0.2);
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 1rem;
}

.modal {
  background: #1f1f1f;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.modal-header h3 {
  color: white;
  margin: 0;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.7);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0.25rem;
}

.close-btn:hover {
  color: white;
}

.modal-content {
  padding: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  color: white;
  margin-bottom: 0.5rem;
  font-weight: 500;
  font-size: 0.875rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.05);
  color: white;
  font-size: 0.875rem;
}

.form-group input::placeholder,
.form-group textarea::placeholder {
  color: rgba(255, 255, 255, 0.5);
}

.form-group select option {
  background: #1f1f1f;
  color: white;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 2rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.cancel-btn,
.save-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: rgba(255, 255, 255, 0.1);
  color: white;
}

.cancel-btn:hover {
  background: rgba(255, 255, 255, 0.15);
}

.save-btn {
  background: #00d4ff;
  color: #000;
}

.save-btn:hover:not(:disabled) {
  background: #00b8e6;
}

.save-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Icons (using Unicode or add icon font) */
.icon-edit::before {
  content: '✎';
}

.icon-delete::before {
  content: '✕';
}

.icon-projects::before {
  content: '◌';
}

@media (max-width: 768px) {
  .project-management {
    padding: 1rem;
  }

  .header-content {
    flex-direction: column;
    align-items: stretch;
  }

  .filters {
    flex-direction: column;
    gap: 0.5rem;
  }

  .filter-group {
    min-width: unset;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .projects-table {
    font-size: 0.75rem;
  }

  .projects-table th,
  .projects-table td {
    padding: 0.5rem;
  }
}
</style>
