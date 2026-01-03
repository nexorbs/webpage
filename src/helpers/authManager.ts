export interface User {
  id: string
  account_id: string
  display_name: string
  email: string
  role: 'client' | 'developer' | 'admin'
  avatar_url?: string
}

export interface AuthResponse {
  success: boolean
  message?: string
  error?: string
  data?: {
    token: string
    user: User
  }
}

export class AuthManager {
  private static readonly TOKEN_KEY = 'nexorbs_auth_token'
  private static readonly USER_KEY = 'nexorbs_user_data'
  private static eventTarget = new EventTarget()

  // Login user
  static async login(id: string, displayName: string, password: string): Promise<AuthResponse> {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: id.toLowerCase(), // Ensure lowercase
          display_name: displayName,
          password,
        }),
      })

      const result: AuthResponse = await response.json()

      if (result.success && result.data) {
        // Store token and user data
        localStorage.setItem(this.TOKEN_KEY, result.data.token)
        localStorage.setItem(this.USER_KEY, JSON.stringify(result.data.user))
        // Dispatch auth change event
        this.dispatchAuthEvent()
      }

      return result
    } catch (error) {
      console.error('Login error:', error)
      return {
        success: false,
        error: 'Error de conexión',
      }
    }
  }

  // Logout user
  static logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_KEY)
    // Dispatch auth change event
    this.dispatchAuthEvent()
    window.location.href = '/dashboard/login'
  }

  // Get stored token
  static getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  // Get stored user data
  static getUser(): User | null {
    const userData = localStorage.getItem(this.USER_KEY)
    return userData ? JSON.parse(userData) : null
  }

  // Get user role
  static getRole(): string | null {
    const user = this.getUser()
    return user ? user.role : null
  }

  // Check if user is logged in
  static isLoggedIn(): boolean {
    return this.getToken() !== null && this.getUser() !== null
  }

  // Verify token with server
  static async verifyToken(): Promise<boolean> {
    const token = this.getToken()
    if (!token) return false

    try {
      const response = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      const result = await response.json()

      if (!result.success) {
        this.logout()
        return false
      }

      return true
    } catch (error) {
      console.error('Token verification error:', error)
      this.logout()
      return false
    }
  }

  // Check if user has required role
  static hasRole(requiredRole: 'client' | 'developer' | 'admin'): boolean {
    const user = this.getUser()
    if (!user) return false

    const roles = { client: 1, developer: 2, admin: 3 }
    const userLevel = roles[user.role] || 0
    const requiredLevel = roles[requiredRole] || 3

    return userLevel >= requiredLevel
  }

  // Get authorization header
  static getAuthHeader(): { [key: string]: string } {
    const token = this.getToken()
    return token ? { Authorization: `Bearer ${token}` } : {}
  }

  // Register new user (admin only)
  static async register(userData: {
    display_name: string
    email: string
    password: string
    role: 'client' | 'developer' | 'admin'
    company_name?: string
    phone?: string
  }): Promise<AuthResponse> {
    try {
      const token = this.getToken()
      if (!token) {
        return { success: false, error: 'No autorizado' }
      }

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(userData),
      })

      return await response.json()
    } catch (error) {
      console.error('Registration error:', error)
      return {
        success: false,
        error: 'Error de conexión',
      }
    }
  }

  // Initialize auth state on page load
  static async initialize(): Promise<void> {
    if (this.isLoggedIn()) {
      const isValid = await this.verifyToken()
      if (!isValid) {
        console.log('Token expired, redirecting to login')
      }
    }
  }

  // Event system for auth state changes
  static addEventListener(type: 'authChanged', listener: EventListener): void {
    this.eventTarget.addEventListener(type, listener)
  }

  static removeEventListener(type: 'authChanged', listener: EventListener): void {
    this.eventTarget.removeEventListener(type, listener)
  }

  private static dispatchAuthEvent(): void {
    this.eventTarget.dispatchEvent(
      new CustomEvent('authChanged', {
        detail: {
          isLoggedIn: this.isLoggedIn(),
          user: this.getUser(),
        },
      }),
    )
  }
}

// Export singleton instance
export const authManager = AuthManager
