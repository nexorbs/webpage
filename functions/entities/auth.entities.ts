export interface LoginRequest {
  id: string // 16 character hex ID
  display_name: string // Juan Pérez
  password: string // Plain password
}

export interface RegisterRequest {
  display_name: string
  email: string
  password: string
  role: 'client' | 'developer' | 'admin'
  company_name?: string
  phone?: string
}
