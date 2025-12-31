export interface UpdateUserRequest {
  display_name?: string
  email?: string
  role?: 'client' | 'developer' | 'admin'
  is_active?: boolean
  company_name?: string
  phone?: string
  password?: string // Optional password change
}

export interface UserListItem {
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

export interface CreateUserRequest {
  account_id: string
  display_name: string
  email: string
  password: string
  role: 'developer' | 'client'
  company_name?: string
}

export interface UserListItem {
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
