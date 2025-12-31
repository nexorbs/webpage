export interface Project {
  id: string
  project_code: string
  client_id: string
  name: string
  description: string | null
  type: string
  status: string
  estimated_budget: number | null
  estimated_duration: number | null
  start_date: string | null
  deadline: string | null
  created_at: string
  updated_at: string
}

export interface CreateProjectRequest {
  name: string
  description?: string
  type: 'Desarrollo Web' | 'Aplicación Móvil' | 'Consultoría Tech' | 'Solución Integral'
  client_id: string
  estimated_budget?: number
  estimated_duration?: number // days
  start_date?: string
  deadline?: string
}

export interface UpdateProjectRequest {
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
