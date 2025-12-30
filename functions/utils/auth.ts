// JWT Authentication utilities for NexOrbs
// Handles user authentication with role-based access control

interface User {
  id: string
  account_id: string
  display_name: string
  email: string
  role: 'client' | 'developer' | 'admin'
  is_active: boolean
}

interface JWTPayload {
  userId: string
  accountId: string
  displayName: string
  email: string
  role: string
  exp: number
  iat: number
}

export class AuthService {
  private static JWT_SECRET = 'your-jwt-secret-key' // En producción usar env variable
  private static JWT_EXPIRY = 24 * 60 * 60 // 24 horas

  // Generar token JWT
  static async generateToken(user: User): Promise<string> {
    const payload: JWTPayload = {
      userId: user.id,
      accountId: user.account_id,
      displayName: user.display_name,
      email: user.email,
      role: user.role,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + this.JWT_EXPIRY,
    }

    const encoder = new TextEncoder()
    const secretKey = encoder.encode(this.JWT_SECRET)

    const key = await crypto.subtle.importKey(
      'raw',
      secretKey,
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['sign'],
    )

    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const payloadEncoded = btoa(JSON.stringify(payload))
    const unsigned = `${header}.${payloadEncoded}`

    const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(unsigned))

    const signatureEncoded = btoa(String.fromCharCode(...new Uint8Array(signature)))

    return `${unsigned}.${signatureEncoded}`
  }

  // Verificar token JWT
  static async verifyToken(token: string): Promise<JWTPayload | null> {
    try {
      const parts = token.split('.')
      if (parts.length !== 3) return null

      const [header, payload, signature] = parts
      const encoder = new TextEncoder()
      const secretKey = encoder.encode(this.JWT_SECRET)

      const key = await crypto.subtle.importKey(
        'raw',
        secretKey,
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify'],
      )

      const unsigned = `${header}.${payload}`
      const signatureBytes = new Uint8Array(
        atob(signature)
          .split('')
          .map((char) => char.charCodeAt(0)),
      )

      const isValid = await crypto.subtle.verify(
        'HMAC',
        key,
        signatureBytes,
        encoder.encode(unsigned),
      )

      if (!isValid) return null

      const decodedPayload = JSON.parse(atob(payload)) as JWTPayload

      // Verificar expiración
      if (decodedPayload.exp < Math.floor(Date.now() / 1000)) {
        return null
      }

      return decodedPayload
    } catch (error) {
      console.error('JWT verification error:', error)
      return null
    }
  }

  // Hash password usando Web Crypto API
  static async hashPassword(password: string): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(password)

    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')

    return hashHex
  }

  // Verificar password
  static async verifyPassword(password: string, hash: string): Promise<boolean> {
    const passwordHash = await this.hashPassword(password)
    return passwordHash === hash
  }

  // Verificar permisos por rol
  static hasPermission(userRole: string, requiredRole: string): boolean {
    const roles = { client: 1, developer: 2, admin: 3 }
    const userLevel = roles[userRole as keyof typeof roles] || 0
    const requiredLevel = roles[requiredRole as keyof typeof roles] || 3

    return userLevel >= requiredLevel
  }

  // Generar ID único de 16 caracteres
  static generateUniqueId(): string {
    return crypto.randomUUID().replace(/-/g, '').substring(0, 16).toLowerCase()
  }

  // Generar account_id basado en rol
  static generateAccountId(role: string): string {
    const prefix = {
      client: 'user',
      developer: 'dev',
      admin: 'admin',
    }

    const rolePrefix = prefix[role as keyof typeof prefix] || 'user'
    const uniquePart = this.generateUniqueId().substring(0, 8)

    return `${rolePrefix}-${uniquePart}`
  }
}
