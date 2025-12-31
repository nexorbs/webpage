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
}

export interface CreateTicketRequest {
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

export interface UpdateTicketRequest {
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
