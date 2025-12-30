// User management service
import { authManager } from './authManager'

export interface User {
  id: string
  account_id: string
  display_name: string
  email: string
  role: 'admin' | 'developer' | 'client'
  company_name?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface CreateUserData {
  account_id: string
  display_name: string
  email: string
  password: string
  role: 'developer' | 'client'
  company_name?: string
}

export interface UpdateUserData {
  display_name?: string
  email?: string
  company_name?: string
  is_active?: boolean
}

export interface UserFilters {
  role?: string
  is_active?: boolean
  search?: string
  page?: number
  limit?: number
}

export interface UserListResponse {
  users: User[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

class UserService {
  private baseUrl = window.location.origin

  private async makeRequest(endpoint: string, options: RequestInit = {}): Promise<any> {
    const token = authManager.getToken()

    const response = await fetch(`${this.baseUrl}/api/users${endpoint}`, {
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

  // Create new user (admin only)
  async createUser(userData: CreateUserData): Promise<User> {
    const response = await this.makeRequest('', {
      method: 'POST',
      body: JSON.stringify(userData),
    })

    if (!response.success) {
      throw new Error(response.error || 'Error al crear el usuario')
    }

    return response.data.user
  }

  // Get users list with filters and pagination
  async getUsers(filters: UserFilters = {}): Promise<UserListResponse> {
    const params = new URLSearchParams()

    if (filters.role) params.append('role', filters.role)
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString())
    if (filters.search) params.append('search', filters.search)
    if (filters.page) params.append('page', filters.page.toString())
    if (filters.limit) params.append('limit', filters.limit.toString())

    const queryString = params.toString()
    const endpoint = queryString ? `?${queryString}` : ''

    const response = await this.makeRequest(endpoint)

    if (!response.success) {
      throw new Error(response.error || 'Error al obtener los usuarios')
    }

    return response.data
  }

  // Get single user by ID
  async getUser(id: string): Promise<User> {
    const response = await this.makeRequest(`/${id}`)

    if (!response.success) {
      throw new Error(response.error || 'Error al obtener el usuario')
    }

    return response.data.user
  }

  // Update user (admin only)
  async updateUser(id: string, updates: UpdateUserData): Promise<User> {
    const response = await this.makeRequest(`/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    })

    if (!response.success) {
      throw new Error(response.error || 'Error al actualizar el usuario')
    }

    return response.data.user
  }

  // Get available user roles
  getRoles(): Array<{ value: string; label: string; color: string }> {
    return [
      { value: 'admin', label: 'Administrador', color: '#ef4444' },
      { value: 'developer', label: 'Desarrollador', color: '#3b82f6' },
      { value: 'client', label: 'Cliente', color: '#10b981' },
    ]
  }

  // Helper to get role display info
  getRoleInfo(role: string) {
    const roles = this.getRoles()
    return roles.find((r) => r.value === role) || { value: role, label: role, color: '#6b7280' }
  }

  // Generate account ID suggestion
  generateAccountId(displayName: string): string {
    const cleanName = displayName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '')
      .substring(0, 8)
    const randomSuffix = Math.random().toString(36).substring(2, 6)
    return `${cleanName}${randomSuffix}`
  }
}

export const userService = new UserService()
