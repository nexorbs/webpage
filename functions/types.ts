interface Env {
  BREVO_API_KEY: string
}

interface ContactFormData {
  name: string
  email: string
  project?: 'web' | 'mobile' | 'consultoria' | 'integral'
  message: string
}

interface PagesContext {
  request: Request
  env: Env
  params: Record<string, string>
  waitUntil: (promise: Promise<any>) => void
  next: () => Promise<Response>
}

export type { Env, ContactFormData, PagesContext }
