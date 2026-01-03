<script setup lang="ts">
import { ref, reactive, onMounted, computed } from 'vue';
import { authManager } from '@/helpers/authManager';
import { ticketService, type Ticket, type CreateTicketData, type UpdateTicketData } from '@/helpers/ticketService';
import { projectService, type Project } from '@/helpers/projectService';
import { userService, type User } from '@/helpers/userService';
import WhiteButton from '@/components/WhiteButton.vue';
import Chip from '@/components/Chip.vue';
import Swal from 'sweetalert2';

// Reactive data
const tickets = ref<Ticket[]>([]);
const projects = ref<Project[]>([]);
const developers = ref<User[]>([]);
const loading = ref(false);
const saving = ref(false);
const showModal = ref(false);
const showDetailModal = ref(false);
const editingTicket = ref<Ticket | null>(null);
const selectedTicket = ref<Ticket | null>(null);
const detailLoading = ref(false);

const filters = reactive({
  status: '',
  priority: '',
  category: '',
  project_id: '',
  assigned_developer_id: '',
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
  project_id: '',
  title: '',
  description: '',
  category: '',
  priority: '',
  status: 'open',
  assigned_developer_id: ''
});

// Computed properties
const userRole = computed(() => authManager.getRole());
const canCreateTickets = computed(() => ['admin', 'client'].includes(userRole.value || ''));

const ticketTypes = computed(() => ticketService.getTicketTypes());
const ticketPriorities = computed(() => ticketService.getTicketPriorities());
const ticketStatuses = computed(() => ticketService.getTicketStatuses());

const availableProjects = computed(() => {
  if (userRole.value === 'admin') return projects.value;
  if (userRole.value === 'client') {
    // Filter projects where user is the client
    const userId = authManager.getUser()?.id;
    return projects.value.filter(p => p.client_id === userId);
  }
  return [];
});

// Methods
const loadTickets = async () => {
  try {
    loading.value = true;
    const response = await ticketService.getTickets(filters);

    tickets.value = response.tickets;
    Object.assign(pagination, response.pagination);
    filters.page = response.pagination.page;

  } catch (error) {
    console.error('Error loading tickets:', error);
    Swal.fire({
      title: 'Error',
      text: 'No se pudieron cargar los tickets',
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

const loadProjects = async () => {
  try {
    const response = await projectService.getProjects({ limit: 100 });
    projects.value = response.projects;
  } catch (error) {
    console.error('Error loading projects:', error);
  }
};

const loadDevelopers = async () => {
  if (userRole.value !== 'admin') return;

  try {
    const response = await userService.getUsers({ role: 'developer', is_active: true, limit: 100 });
    developers.value = response.users;
  } catch (error) {
    console.error('Error loading developers:', error);
  }
};

const changePage = (page: number) => {
  filters.page = page;
  loadTickets();
};

const openCreateModal = () => {
  editingTicket.value = null;
  resetForm();
  showModal.value = true;
};

const openEditModal = (ticket: Ticket) => {
  editingTicket.value = ticket;
  fillForm(ticket);
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  editingTicket.value = null;
  resetForm();
};

const resetForm = () => {
  Object.assign(formData, {
    project_id: '',
    title: '',
    description: '',
    category: '',
    priority: '',
    status: 'open',
    assigned_developer_id: ''
  });
};

const fillForm = (ticket: Ticket) => {
  Object.assign(formData, {
    project_id: ticket.project_id,
    title: ticket.title,
    description: ticket.description || '',
    category: ticket.category,
    priority: ticket.priority,
    status: ticket.status,
    assigned_developer_id: ticket.assigned_developer_id || ''
  });
};

const saveTicket = async () => {
  try {
    saving.value = true;

    if (editingTicket.value) {
      // Update existing ticket
      const updateData: UpdateTicketData = {
        title: formData.title,
        description: formData.description || undefined,
        category: formData.category as any,
        priority: formData.priority as any,
        status: formData.status as any,
        assigned_developer_id: formData.assigned_developer_id || undefined
      };

      await ticketService.updateTicket(editingTicket.value.id, updateData);

      Swal.fire({
        title: 'Éxito',
        text: 'Ticket actualizado correctamente',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    } else {
      // Create new ticket
      const createData: CreateTicketData = {
        project_id: formData.project_id,
        title: formData.title,
        description: formData.description || undefined,
        category: formData.category as any,
        priority: formData.priority as any
      };

      await ticketService.createTicket(createData);

      Swal.fire({
        title: 'Éxito',
        text: 'Ticket creado correctamente',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });
    }

    closeModal();
    loadTickets();

  } catch (error: any) {
    Swal.fire({
      title: 'Error',
      text: error.message || 'Error al guardar el ticket',
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

const canEditTicket = (ticket: Ticket) => {
  if (userRole.value === 'admin') return true;
  if (userRole.value === 'client') return ticket.client_id === authManager.getUser()?.id;
  if (userRole.value === 'developer') return ticket.assigned_developer_id === authManager.getUser()?.id;
  return false;
};

const canAssignTicket = (ticket: Ticket) => {
  return userRole.value === 'admin';
};

const getAvailableStatuses = () => {
  if (userRole.value === 'client') {
    return ticketStatuses.value.filter(s => ['open', 'closed'].includes(s.value));
  }
  return ticketStatuses.value;
};

const openTicketDetail = async (ticket: Ticket) => {
  selectedTicket.value = ticket;
  showDetailModal.value = true;

  try {
    detailLoading.value = true;
    // Get fresh ticket data with all details
    const response = await ticketService.getTicket(ticket.id);
    selectedTicket.value = response.ticket;
  } catch (error) {
    console.error('Error loading ticket details:', error);
  } finally {
    detailLoading.value = false;
  }
};

const closeDetailModal = () => {
  showDetailModal.value = false;
  selectedTicket.value = null;
};

const openEditFromDetail = (ticket: Ticket) => {
  closeDetailModal();
  openEditModal(ticket);
};

const assignToSelf = async (ticket: Ticket) => {
  try {
    const currentUser = authManager.getUser();
    if (!currentUser) return;

    await ticketService.updateTicket(ticket.id, {
      assigned_developer_id: currentUser.id,
      status: 'in_progress'
    });

    Swal.fire({
      title: 'Éxito',
      text: 'Ticket asignado exitosamente',
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });

    // Refresh ticket details and list
    await openTicketDetail(ticket);
    loadTickets();

  } catch (error: any) {
    Swal.fire({
      title: 'Error',
      text: error.message || 'Error al asignar el ticket',
      icon: 'error'
    });
  }
};

const updateTicketStatus = async (ticket: Ticket, newStatus: string) => {
  try {
    await ticketService.updateTicket(ticket.id, { status: newStatus as any });

    Swal.fire({
      title: 'Éxito',
      text: `Ticket marcado como ${getStatusInfo(newStatus).label.toLowerCase()}`,
      icon: 'success',
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000
    });

    // Update local ticket data
    if (selectedTicket.value) {
      selectedTicket.value.status = newStatus as any;
    }

    loadTickets();

  } catch (error: any) {
    Swal.fire({
      title: 'Error',
      text: error.message || 'Error al actualizar el ticket',
      icon: 'error'
    });
  }
};

const openAssignModal = async (ticket: Ticket) => {
  const { value: developerId } = await Swal.fire({
    title: 'Asignar Ticket',
    html: `
      <div class="assign-modal">
        <p>Asignar ticket <strong>${ticket.ticket_number}</strong> a:</p>
        <select id="developer-select" class="swal2-input">
          <option value="">Sin asignar</option>
          ${developers.value.map(dev =>
      `<option value="${dev.id}" ${dev.id === ticket.assigned_developer_id ? 'selected' : ''}>
              ${dev.display_name}
            </option>`
    ).join('')}
        </select>
      </div>
    `,
    showCancelButton: true,
    confirmButtonText: 'Asignar',
    cancelButtonText: 'Cancelar',
    preConfirm: () => {
      const select = document.getElementById('developer-select') as HTMLSelectElement;
      return select.value;
    }
  });

  if (developerId !== undefined) {
    try {
      await ticketService.updateTicket(ticket.id, { assigned_developer_id: developerId || undefined });

      Swal.fire({
        title: 'Éxito',
        text: 'Ticket asignado correctamente',
        icon: 'success',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000
      });

      loadTickets();
    } catch (error: any) {
      Swal.fire({
        title: 'Error',
        text: error.message || 'Error al asignar el ticket',
        icon: 'error'
      });
    }
  }
};

// Helper methods
const getPriorityInfo = (priority: string) => ticketService.getPriorityInfo(priority);
const getStatusInfo = (status: string) => ticketService.getStatusInfo(status);
const getTypeInfo = (type: string) => ticketService.getTypeInfo(type);
const formatDate = (date: string) => ticketService.formatDate(date);
const getTimeElapsed = (date: string) => ticketService.getTimeElapsed(date);

const truncateText = (text: string, maxLength: number) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Lifecycle
onMounted(() => {
  loadTickets();
  loadProjects();
  loadDevelopers();
});
</script>

<template>
  <div class="ticket-management">
    <!-- Header -->
    <div class="header">
      <div class="header-content">
        <div class="title-section">
          <h1>Gestión de Tickets</h1>
          <p>Administra y supervisa todos los tickets del sistema</p>
        </div>
        <div class="actions" v-if="canCreateTickets">
          <WhiteButton @click="openCreateModal" icon="plus">
            Nuevo Ticket
          </WhiteButton>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters">
      <div class="filter-group">
        <label>Estado:</label>
        <select v-model="filters.status" @change="loadTickets">
          <option value="">Todos los estados</option>
          <option v-for="status in ticketStatuses" :key="status.value" :value="status.value">
            {{ status.label }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Prioridad:</label>
        <select v-model="filters.priority" @change="loadTickets">
          <option value="">Todas las prioridades</option>
          <option v-for="priority in ticketPriorities" :key="priority.value" :value="priority.value">
            {{ priority.label }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Categoría:</label>
        <select v-model="filters.category" @change="loadTickets">
          <option value="">Todas las categorías</option>
          <option v-for="type in ticketTypes" :key="type.value" :value="type.value">
            {{ type.icon }} {{ type.label }}
          </option>
        </select>
      </div>

      <div class="filter-group" v-if="userRole === 'admin'">
        <label>Proyecto:</label>
        <select v-model="filters.project_id" @change="loadTickets">
          <option value="">Todos los proyectos</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">
            {{ project.project_code }} - {{ project.name }}
          </option>
        </select>
      </div>

      <div class="filter-group" v-if="userRole === 'admin'">
        <label>Asignado a:</label>
        <select v-model="filters.assigned_developer_id" @change="loadTickets">
          <option value="">Todos los desarrolladores</option>
          <option v-for="developer in developers" :key="developer.id" :value="developer.id">
            {{ developer.display_name }}
          </option>
        </select>
      </div>

      <div class="filter-group">
        <label>Por página:</label>
        <select v-model.number="filters.limit" @change="loadTickets">
          <option value="10">10</option>
          <option value="25">25</option>
          <option value="50">50</option>
        </select>
      </div>
    </div>

    <!-- Tickets Table -->
    <div class="table-container" v-if="!loading">
      <table class="tickets-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Título</th>
            <th>Proyecto</th>
            <th v-if="userRole === 'admin'">Cliente</th>
            <th>Tipo</th>
            <th>Prioridad</th>
            <th>Estado</th>
            <th v-if="userRole !== 'client'">Asignado a</th>
            <th>Creado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ticket in tickets" :key="ticket.id" class="ticket-row">
            <td>
              <span class="ticket-number">{{ ticket.ticket_number }}</span>
            </td>
            <td>
              <div class="ticket-info">
                <strong>{{ ticket.title }}</strong>
                <p v-if="ticket.description">{{ truncateText(ticket.description, 80) }}</p>
              </div>
            </td>
            <td>
              <div class="project-info">
                <strong>{{ ticket.project_name }}</strong>
              </div>
            </td>
            <td v-if="userRole === 'admin'">
              <div class="client-info">
                {{ ticket.client_name }}
              </div>
            </td>
            <td>
              <div class="type-badge"
                :style="{ background: getTypeInfo(ticket.category).color + '20', color: getTypeInfo(ticket.category).color }">
                {{ getTypeInfo(ticket.category).icon }} {{ getTypeInfo(ticket.category).label }}
              </div>
            </td>
            <td>
              <span class="priority-badge"
                :style="{ backgroundColor: getPriorityInfo(ticket.priority).color + '20', color: getPriorityInfo(ticket.priority).color }">
                {{ getPriorityInfo(ticket.priority).label }}
              </span>
            </td>
            <td>
              <span class="status-badge"
                :style="{ backgroundColor: getStatusInfo(ticket.status).color + '20', color: getStatusInfo(ticket.status).color }">
                {{ getStatusInfo(ticket.status).label }}
              </span>
            </td>
            <td v-if="userRole !== 'client'">
              <span v-if="ticket.developer_name" class="developer-name">
                {{ ticket.developer_name }}
              </span>
              <span v-else class="unassigned">Sin asignar</span>
            </td>
            <td>
              <div class="date-info">
                <span class="time-elapsed">{{ getTimeElapsed(ticket.created_at) }}</span>
                <small>{{ formatDate(ticket.created_at) }}</small>
              </div>
            </td>
            <td>
              <div class="actions">
                <button @click="openTicketDetail(ticket)" class="view-btn" title="Ver detalles">
                  <i class="icon-view"></i>
                </button>
                <button v-if="canEditTicket(ticket)" @click="openEditModal(ticket)" class="edit-btn" title="Editar">
                  <i class="icon-edit"></i>
                </button>
                <button v-if="canAssignTicket(ticket)" @click="openAssignModal(ticket)" class="assign-btn"
                  title="Asignar">
                  <i class="icon-assign"></i>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>

      <!-- Empty state -->
      <div v-if="tickets.length === 0" class="empty-state">
        <div class="empty-content">
          <i class="icon-tickets"></i>
          <h3>No hay tickets</h3>
          <p v-if="userRole === 'admin'">Administra todos los tickets del sistema</p>
          <p v-else-if="userRole === 'client'">Aún no tienes tickets creados</p>
          <p v-else>Aún no tienes tickets asignados</p>
          <WhiteButton v-if="canCreateTickets" @click="openCreateModal" icon="plus">
            Crear Primer Ticket
          </WhiteButton>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Cargando tickets...</p>
    </div>

    <!-- Pagination -->
    <div class="pagination" v-if="pagination.totalPages > 1">
      <button @click="changePage(pagination.page - 1)" :disabled="pagination.page === 1" class="page-btn">
        Anterior
      </button>

      <span class="page-info">
        Página {{ pagination.page }} de {{ pagination.totalPages }}
        ({{ pagination.total }} tickets)
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
          <h3>{{ editingTicket ? 'Editar Ticket' : 'Crear Nuevo Ticket' }}</h3>
          <button @click="closeModal" class="close-btn">&times;</button>
        </div>

        <form @submit.prevent="saveTicket" class="modal-content">
          <div class="form-group" v-if="!editingTicket">
            <label for="ticketProject">Proyecto*</label>
            <select id="ticketProject" v-model="formData.project_id" required>
              <option value="">Seleccionar proyecto</option>
              <option v-for="project in availableProjects" :key="project.id" :value="project.id">
                {{ project.project_code }} - {{ project.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="ticketTitle">Título*</label>
            <input id="ticketTitle" v-model="formData.title" type="text" required
              placeholder="Describe brevemente el problema o solicitud" />
          </div>

          <div class="form-group">
            <label for="ticketDescription">Descripción*</label>
            <textarea id="ticketDescription" v-model="formData.description" rows="4" required
              placeholder="Proporciona detalles adicionales sobre el ticket"></textarea>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label for="ticketCategory">Categoría*</label>
              <select id="ticketCategory" v-model="formData.category" required>
                <option value="">Seleccionar categoría</option>
                <option v-for="type in ticketTypes" :key="type.value" :value="type.value">
                  {{ type.icon }} {{ type.label }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="ticketPriority">Prioridad*</label>
              <select id="ticketPriority" v-model="formData.priority" required>
                <option value="">Seleccionar prioridad</option>
                <option v-for="priority in ticketPriorities" :key="priority.value" :value="priority.value">
                  {{ priority.label }}
                </option>
              </select>
            </div>
          </div>

          <div class="form-row" v-if="editingTicket">
            <div class="form-group">
              <label for="ticketStatus">Estado</label>
              <select id="ticketStatus" v-model="formData.status">
                <option v-for="status in getAvailableStatuses()" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
            </div>

            <div class="form-group" v-if="userRole === 'admin'">
              <label for="ticketAssignedTo">Asignar a</label>
              <select id="ticketAssignedTo" v-model="formData.assigned_developer_id">
                <option value="">Sin asignar</option>
                <option v-for="developer in developers" :key="developer.id" :value="developer.id">
                  {{ developer.display_name }}
                </option>
              </select>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" @click="closeModal" class="cancel-btn">
              Cancelar
            </button>
            <button type="submit" class="save-btn" :disabled="saving">
              {{ saving ? 'Guardando...' : (editingTicket ? 'Actualizar' : 'Crear') }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Ticket Detail Modal -->
    <div v-if="showDetailModal" class="modal-overlay" @click="closeDetailModal">
      <div class="detail-modal" @click.stop>
        <div class="modal-header">
          <h3>Detalles del Ticket</h3>
          <button @click="closeDetailModal" class="close-btn">&times;</button>
        </div>

        <div class="detail-content" v-if="selectedTicket && !detailLoading">
          <!-- Ticket Info Header -->
          <div class="ticket-header">
            <div class="ticket-number-large">{{ selectedTicket.ticket_number }}</div>
            <div class="ticket-status-section">
              <Chip :color="getStatusInfo(selectedTicket.status).color"
                :text="getStatusInfo(selectedTicket.status).label" />
              <Chip :color="getPriorityInfo(selectedTicket.priority).color"
                :text="getPriorityInfo(selectedTicket.priority).label" />
            </div>
          </div>

          <div class="ticket-title">{{ selectedTicket.title }}</div>

          <!-- Ticket Details Grid -->
          <div class="details-grid">
            <div class="detail-item">
              <strong>Proyecto:</strong>
              <span>{{ selectedTicket.project_name }}</span>
            </div>

            <div class="detail-item">
              <strong>Cliente:</strong>
              <span>{{ selectedTicket.client_name }}</span>
            </div>

            <div class="detail-item">
              <strong>Categoría:</strong>
              <div class="category-badge"
                :style="{ background: getTypeInfo(selectedTicket.category).color + '20', color: getTypeInfo(selectedTicket.category).color }">
                {{ getTypeInfo(selectedTicket.category).icon }} {{
                  getTypeInfo(selectedTicket.category).label }}
              </div>
            </div>

            <div class="detail-item">
              <strong>Asignado a:</strong>
              <span v-if="selectedTicket.developer_name">{{ selectedTicket.developer_name }}</span>
              <span v-else class="unassigned">Sin asignar</span>
            </div>

            <div class="detail-item">
              <strong>Creado:</strong>
              <span>{{ formatDate(selectedTicket.created_at) }}</span>
            </div>

            <div class="detail-item">
              <strong>Actualizado:</strong>
              <span>{{ formatDate(selectedTicket.updated_at) }}</span>
            </div>
          </div>

          <!-- Description -->
          <div class="description-section" v-if="selectedTicket.description">
            <strong>Descripción:</strong>
            <p>{{ selectedTicket.description }}</p>
          </div>

          <!-- Actions Section -->
          <div class="detail-actions">
            <!-- Developer Self-Assignment -->
            <button v-if="userRole === 'developer' && !selectedTicket.assigned_developer_id"
              @click="assignToSelf(selectedTicket)" class="action-btn assign-btn">
              Asignarme este Ticket
            </button>

            <!-- Admin Assignment -->
            <button v-if="userRole === 'admin'" @click="openAssignModal(selectedTicket)" class="action-btn assign-btn">
              {{ selectedTicket.assigned_developer_id ? 'Reasignar' : 'Asignar' }} Ticket
            </button>

            <!-- Status Changes -->
            <div class="status-actions">
              <!-- Developer Status Updates -->
              <button
                v-if="userRole === 'developer' && selectedTicket.assigned_developer_id === authManager.getUser()?.id && selectedTicket.status === 'open'"
                @click="updateTicketStatus(selectedTicket, 'in_progress')" class="action-btn progress-btn">
                Marcar En Progreso
              </button>

              <button
                v-if="userRole === 'developer' && selectedTicket.assigned_developer_id === authManager.getUser()?.id && selectedTicket.status === 'in_progress'"
                @click="updateTicketStatus(selectedTicket, 'resolved')" class="action-btn resolve-btn">
                Marcar como Resuelto
              </button>

              <!-- Client Status Updates -->
              <button
                v-if="(userRole === 'client' && selectedTicket.client_id === authManager.getUser()?.id) || userRole === 'admin'"
                @click="updateTicketStatus(selectedTicket, 'closed')" class="action-btn close-btn"
                :disabled="selectedTicket.status === 'closed'">
                {{ selectedTicket.status === 'closed' ? 'Ticket Cerrado' : 'Cerrar Ticket' }}
              </button>

              <!-- Admin Status Override -->
              <select v-if="userRole === 'admin'" v-model="selectedTicket.status"
                @change="updateTicketStatus(selectedTicket, selectedTicket.status)" class="status-select">
                <option v-for="status in ticketStatuses" :key="status.value" :value="status.value">
                  {{ status.label }}
                </option>
              </select>
            </div>

            <!-- Edit Button -->
            <button v-if="canEditTicket(selectedTicket)" @click="openEditFromDetail(selectedTicket)"
              class="action-btn edit-btn">
              Editar Ticket
            </button>
          </div>
        </div>

        <!-- Loading state for detail -->
        <div v-if="detailLoading" class="detail-loading">
          <div class="spinner"></div>
          <p>Cargando detalles del ticket...</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.ticket-management {
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

.tickets-table {
  width: 100%;
  border-collapse: collapse;
}

.tickets-table th {
  background: rgba(255, 255, 255, 0.1);
  color: white;
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  font-size: 0.875rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.tickets-table td {
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  color: white;
}

.ticket-row:hover {
  background: rgba(255, 255, 255, 0.03);
}

.ticket-number {
  font-family: 'Courier New', monospace;
  background: rgba(0, 212, 255, 0.2);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  color: #00d4ff;
}

.ticket-info strong {
  display: block;
  margin-bottom: 0.25rem;
}

.ticket-info p {
  color: rgba(255, 255, 255, 0.7);
  font-size: 0.875rem;
  margin: 0;
}

.type-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
}

.priority-badge,
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
}

.developer-name {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
}

.unassigned {
  color: rgba(255, 255, 255, 0.5);
  font-style: italic;
  font-size: 0.875rem;
}

.date-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.time-elapsed {
  color: rgba(255, 255, 255, 0.9);
  font-size: 0.875rem;
  font-weight: 500;
}

.date-info small {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.view-btn,
.edit-btn,
.assign-btn {
  padding: 0.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.view-btn {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
}

.view-btn:hover {
  background: rgba(16, 185, 129, 0.3);
}

.edit-btn {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
}

.edit-btn:hover {
  background: rgba(59, 130, 246, 0.3);
}

.assign-btn {
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
}

.assign-btn:hover {
  background: rgba(139, 92, 246, 0.3);
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

/* Icons */
.icon-view::before {
  content: '○';
}

.icon-edit::before {
  content: '✎';
}

.icon-assign::before {
  content: '→';
}

@media (max-width: 768px) {
  .ticket-management {
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

  .tickets-table {
    font-size: 0.75rem;
  }

  .tickets-table th,
  .tickets-table td {
    padding: 0.5rem;
  }
}

/* Detail Modal Styles */
.detail-modal {
  background: #1f1f1f;
  border-radius: 12px;
  width: 100%;
  max-width: 800px;
  max-height: 90vh;
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.ticket-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.ticket-number-large {
  font-family: 'Courier New', monospace;
  font-size: 1.25rem;
  font-weight: bold;
  background: rgba(0, 212, 255, 0.2);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  color: #00d4ff;
}

.ticket-status-section {
  display: flex;
  gap: 0.5rem;
}

.ticket-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: white;
  margin-bottom: 1.5rem;
  padding: 0 1.5rem;
}

.details-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.detail-item strong {
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.875rem;
  font-weight: 600;
}

.detail-item span {
  color: white;
  font-size: 0.9rem;
}

.category-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
  width: fit-content;
}

.description-section {
  padding: 0 1.5rem;
  margin-bottom: 1.5rem;
}

.description-section strong {
  display: block;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.description-section p {
  color: white;
  line-height: 1.6;
  margin: 0;
  background: rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.detail-actions {
  padding: 1.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  align-items: center;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.875rem;
}

.assign-btn {
  background: rgba(139, 92, 246, 0.2);
  color: #8b5cf6;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.assign-btn:hover {
  background: rgba(139, 92, 246, 0.3);
}

.progress-btn {
  background: rgba(59, 130, 246, 0.2);
  color: #3b82f6;
  border: 1px solid rgba(59, 130, 246, 0.3);
}

.progress-btn:hover {
  background: rgba(59, 130, 246, 0.3);
}

.resolve-btn {
  background: rgba(16, 185, 129, 0.2);
  color: #10b981;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.resolve-btn:hover {
  background: rgba(16, 185, 129, 0.3);
}

.close-btn {
  background: rgba(239, 68, 68, 0.2);
  color: #ef4444;
  border: 1px solid rgba(239, 68, 68, 0.3);
}

.close-btn:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.3);
}

.close-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.edit-btn {
  background: rgba(245, 158, 11, 0.2);
  color: #f59e0b;
  border: 1px solid rgba(245, 158, 11, 0.3);
}

.edit-btn:hover {
  background: rgba(245, 158, 11, 0.3);
}

.status-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.status-select {
  padding: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  font-size: 0.875rem;
}

.status-select option {
  background: #1f1f1f;
  color: white;
}

.detail-loading {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: white;
}

@media (max-width: 768px) {
  .detail-modal {
    width: 95vw;
    max-height: 95vh;
  }

  .ticket-header {
    flex-direction: column;
    gap: 1rem;
    align-items: flex-start;
  }

  .details-grid {
    grid-template-columns: 1fr;
  }

  .detail-actions {
    flex-direction: column;
    align-items: stretch;
  }

  .action-btn {
    width: 100%;
    text-align: center;
  }

  .status-actions {
    width: 100%;
    justify-content: space-between;
  }
}
</style>
