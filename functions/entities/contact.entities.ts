export interface ContactFormData {
  name: string
  email: string
  project?: 'web' | 'mobile' | 'consultoria' | 'integral'
  message: string
}

export interface Env {
  BREVO_API_KEY: string
}
