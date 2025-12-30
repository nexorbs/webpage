// Ticket management service
import { authManager } from './authManager'

export interface Ticket {
  id: string
  ticket_number: string
  project_id: string
  client_id: string
  assigned_developer_id?: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status:
    | 'open'
    | 'assigned'
    | 'in_progress'
    | 'waiting_client'
    | 'resolved'
    | 'client_approved'
    | 'closed'
  category:
    | 'bug'
    | 'feature_request'
    | 'support'
    | 'consultation'
    | 'billing'
    | 'technical_issue'
    | 'change_request'
  created_at: string
  updated_at: string
  resolved_at?: string
  // Joined data
  project_name?: string
  client_name?: string
  developer_name?: string
  client_email?: string
  developer_email?: string
}

export interface TicketComment {
  id: string
  ticket_id: string
  user_id: string
  comment: string
  created_at: string
  author_name?: string
  author_role?: string
}

export interface CreateTicketData {
  project_id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category:
    | 'bug'
    | 'feature_request'
    | 'support'
    | 'consultation'
    | 'billing'
    | 'technical_issue'
    | 'change_request'
}

export interface UpdateTicketData {
  title?: string
  description?: string
  priority?: 'low' | 'medium' | 'high' | 'urgent'
  status?:
    | 'open'
    | 'assigned'
    | 'in_progress'
    | 'waiting_client'
    | 'resolved'
    | 'client_approved'
    | 'closed'
  category?:
    | 'bug'
    | 'feature_request'
    | 'support'
    | 'consultation'
    | 'billing'
    | 'technical_issue'
    | 'change_request'
  assigned_developer_id?: string
}

export interface TicketFilters {
  status?: string
  priority?: string
  category?: string
  project_id?: string
  assigned_developer_id?: string
  page?: number
  limit?: number
}

export interface TicketListResponse {
  tickets: Ticket[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface TicketDetailResponse {
  ticket: Ticket
  comments: TicketComment[]
}

class TicketService {
  private baseUrl = window.location.origin

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = authManager.getToken()

    const response = await fetch(`${this.baseUrl}/api/tickets${endpoint}`, {
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

  // Create new ticket
  async createTicket(ticketData: CreateTicketData): Promise<Ticket> {
    const response = await this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify(ticketData),
    })

    if (!response.success) {
      throw new Error(response.error || 'Error al crear el ticket')
    }

    return response.data.ticket
  }

  // Get tickets list with filters and pagination
  async getTickets(filters: TicketFilters = {}): Promise<TicketListResponse> {
    const params = new URLSearchParams()

    if (filters.status) params.append('status', filters.status)
    if (filters.priority) params.append('priority', filters.priority)
    if (filters.category) params.append('category', filters.category)
    if (filters.project_id) params.append('project_id', filters.project_id)
    if (filters.assigned_developer_id) params.append('assigned_to', filters.assigned_developer_id)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    const queryString = params.toString()
    const endpoint = queryString ? `?${queryString}` : ''

    const response = await this.makeRequest(endpoint)

    if (!response.success) {
      throw new Error(response.error || 'Error al obtener los tickets')
    }

    return response.data
  }

  // Get single ticket by ID with comments
  async getTicket(id: string): Promise<TicketDetailResponse> {
    const response = await this.makeRequest(`/${id}`)

    if (!response.success) {
      throw new Error(response.error || 'Error al obtener el ticket')
    }

    return response.data
  }

  // Update ticket
  async updateTicket(id: string, updates: UpdateTicketData): Promise<Ticket> {
    const response = await this.makeRequest(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })

    if (!response.success) {
      throw new Error(response.error || 'Error al actualizar el ticket')
    }

    return response.data.ticket
  }

  // Get available ticket priorities
  getTicketPriorities(): Array<{ value: string; label: string; color: string }> {
    return [
      { value: 'low', label: 'Baja', color: '#10b981' },
      { value: 'medium', label: 'Media', color: '#f59e0b' },
      { value: 'high', label: 'Alta', color: '#ef4444' },
      { value: 'urgent', label: 'Urgente', color: '#dc2626' },
    ]
  }

  // Get available ticket statuses
  getTicketStatuses(): Array<{ value: string; label: string; color: string }> {
    return [
      { value: 'open', label: 'Abierto', color: '#3b82f6' },
      { value: 'assigned', label: 'Asignado', color: '#8b5cf6' },
      { value: 'in_progress', label: 'En Progreso', color: '#f59e0b' },
      { value: 'waiting_client', label: 'Esperando Cliente', color: '#ef4444' },
      { value: 'resolved', label: 'Resuelto', color: '#10b981' },
      { value: 'client_approved', label: 'Aprobado por Cliente', color: '#06b6d4' },
      { value: 'closed', label: 'Cerrado', color: '#6b7280' },
    ]
  }

  // Get available ticket categories
  getTicketTypes(): Array<{ value: string; label: string; color: string; icon: string }> {
    return [
      { value: 'bug', label: 'Error', color: '#ef4444', icon: '🐛' },
      { value: 'feature_request', label: 'Nueva Funcionalidad', color: '#3b82f6', icon: '✨' },
      { value: 'support', label: 'Soporte', color: '#10b981', icon: '❓' },
      { value: 'consultation', label: 'Consultoría', color: '#8b5cf6', icon: '💡' },
      { value: 'billing', label: 'Facturación', color: '#f59e0b', icon: '💰' },
      { value: 'technical_issue', label: 'Problema Técnico', color: '#ef4444', icon: '⚠️' },
      { value: 'change_request', label: 'Solicitud de Cambio', color: '#06b6d4', icon: '🔄' },
    ]
  }

  // Helper to get priority display info
  getPriorityInfo(priority: string) {
    const priorities = this.getTicketPriorities()
    return (
      priorities.find((p) => p.value === priority) || {
        value: priority,
        label: priority,
        color: '#6b7280',
      }
    )
  }

  // Helper to get status display info
  getStatusInfo(status: string) {
    const statuses = this.getTicketStatuses()
    return (
      statuses.find((s) => s.value === status) || { value: status, label: status, color: '#6b7280' }
    )
  }

  // Helper to get category display info
  getTypeInfo(category: string) {
    const types = this.getTicketTypes()
    return (
      types.find((t) => t.value === category) || {
        value: category,
        label: category,
        color: '#6b7280',
        icon: '📋',
      }
    )
  }

  // Format date for display
  formatDate(dateString: string | null): string {
    if (!dateString) return 'No definida'
    return new Date(dateString).toLocaleDateString('es-MX', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  // Get time elapsed since creation
  getTimeElapsed(dateString: string): string {
    const now = new Date()
    const created = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - created.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - created.getTime()) / (1000 * 60))
      return `Hace ${diffInMinutes} min`
    } else if (diffInHours < 24) {
      return `Hace ${diffInHours}h`
    } else {
      const diffInDays = Math.floor(diffInHours / 24)
      return `Hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`
    }
  }
}

export const ticketService = new TicketService()
