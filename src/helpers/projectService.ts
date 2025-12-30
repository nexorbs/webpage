// Project management service
import { authManager } from './authManager'

export interface Project {
  id: string
  project_code: string
  client_id: string
  name: string
  description: string | null
  type: 'Desarrollo Web' | 'Aplicación Móvil' | 'Consultoría Tech' | 'Solución Integral'
  status: 'active' | 'completed' | 'cancelled' | 'on-hold'
  estimated_budget: number | null
  estimated_duration: number | null
  start_date: string | null
  deadline: string | null
  created_at: string
  updated_at: string
  client_name?: string
  client_email?: string
  company_name?: string
}

export interface CreateProjectData {
  name: string
  description?: string
  type: 'Desarrollo Web' | 'Aplicación Móvil' | 'Consultoría Tech' | 'Solución Integral'
  client_id: string
  estimated_budget?: number
  estimated_duration?: number
  start_date?: string
  deadline?: string
}

export interface UpdateProjectData {
  name?: string
  description?: string
  type?: 'Desarrollo Web' | 'Aplicación Móvil' | 'Consultoría Tech' | 'Solución Integral'
  client_id?: string
  status?: 'active' | 'completed' | 'cancelled' | 'on-hold'
  estimated_budget?: number
  estimated_duration?: number
  start_date?: string
  deadline?: string
}

export interface ProjectFilters {
  status?: string
  type?: string
  client_id?: string
  page?: number
  limit?: number
}

export interface ProjectListResponse {
  projects: Project[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

class ProjectService {
  private baseUrl = window.location.origin

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = authManager.getToken()

    const response = await fetch(`${this.baseUrl}/api/projects${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization: token ? `Bearer ${token}` : '',
        ...options.headers,
      },
    })

    if (!response.ok) {
      let errorMessage = 'Error en la petición'
      try {
        const errorData = await response.json()
        errorMessage = errorData.error || errorMessage
      } catch (e) {
        // Ignore JSON parse errors and use default message
      }
      throw new Error(errorMessage)
    }

    return response.json()
  }

  // Create new project (admin only)
  async createProject(projectData: CreateProjectData): Promise<Project> {
    const response = await this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify(projectData),
    })

    if (!response.success) {
      throw new Error(response.error || 'Error al crear el proyecto')
    }

    return response.data.project
  }

  // Get projects list with filters and pagination
  async getProjects(filters: ProjectFilters = {}): Promise<ProjectListResponse> {
    const params = new URLSearchParams()

    if (filters.status) params.append('status', filters.status)
    if (filters.type) params.append('type', filters.type)
    if (filters.client_id) params.append('client_id', filters.client_id)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    const queryString = params.toString()
    const endpoint = queryString ? `?${queryString}` : ''

    const response = await this.makeRequest(endpoint)

    if (!response.success) {
      throw new Error(response.error || 'Error al obtener los proyectos')
    }

    return response.data
  }

  // Get single project by ID
  async getProject(id: string): Promise<Project> {
    const response = await this.makeRequest(`/${id}`)

    if (!response.success) {
      throw new Error(response.error || 'Error al obtener el proyecto')
    }

    return response.data.project
  }

  // Update project (admin only)
  async updateProject(id: string, updates: UpdateProjectData): Promise<Project> {
    const response = await this.makeRequest(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })

    if (!response.success) {
      throw new Error(response.error || 'Error al actualizar el proyecto')
    }

    return response.data.project
  }

  // Delete project (admin only)
  async deleteProject(id: string): Promise<void> {
    const response = await this.makeRequest(`/${id}`, {
      method: 'DELETE',
    })

    if (!response.success) {
      throw new Error(response.error || 'Error al eliminar el proyecto')
    }
  }

  // Get available project types
  getProjectTypes(): Array<{ value: string; label: string; color: string }> {
    return [
      { value: 'Desarrollo Web', label: 'Desarrollo Web', color: '#3b82f6' },
      { value: 'Aplicación Móvil', label: 'Aplicación Móvil', color: '#8b5cf6' },
      { value: 'Consultoría Tech', label: 'Consultoría Tech', color: '#10b981' },
      { value: 'Solución Integral', label: 'Solución Integral', color: '#f59e0b' },
    ]
  }

  // Get available project statuses
  getProjectStatuses(): Array<{ value: string; label: string; color: string }> {
    return [
      { value: 'active', label: 'Activo', color: '#10b981' },
      { value: 'completed', label: 'Completado', color: '#6b7280' },
      { value: 'cancelled', label: 'Cancelado', color: '#ef4444' },
      { value: 'on-hold', label: 'En Pausa', color: '#f59e0b' },
    ]
  }

  // Helper to get status display info
  getStatusInfo(status: string) {
    const statuses = this.getProjectStatuses()
    return (
      statuses.find((s) => s.value === status) || { value: status, label: status, color: '#6b7280' }
    )
  }

  // Helper to get type display info
  getTypeInfo(type: string) {
    const types = this.getProjectTypes()
    return types.find((t) => t.value === type) || { value: type, label: type, color: '#6b7280' }
  }

  // Format budget for display
  formatBudget(budget: number | null): string {
    if (!budget) return 'No definido'
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
      minimumFractionDigits: 0,
    }).format(budget)
  }

  // Format duration for display
  formatDuration(days: number | null): string {
    if (!days) return 'No definido'
    if (days === 1) return '1 día'
    if (days < 30) return `${days} días`

    const months = Math.floor(days / 30)
    const remainingDays = days % 30

    let result = months === 1 ? '1 mes' : `${months} meses`
    if (remainingDays > 0) {
      result += ` y ${remainingDays} día${remainingDays > 1 ? 's' : ''}`
    }

    return result
  }

  // Format date for display
  formatDate(dateString: string | null): string {
    if (!dateString) return 'No definida'
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }
}

export const projectService = new ProjectService()
