import { AuthService } from '../../utils/auth'

interface LoginRequest {
  id: string // 16 character hex ID
  display_name: string // Juan Pérez
  password: string // Plain password
}

export async function onRequestPost(context: any): Promise<Response> {
  try {
    const { request, env } = context

    // Parse request body
    const body: LoginRequest = await request.json()
    const { id, display_name, password } = body

    // Validate input
    if (!id || !display_name || !password) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'ID, nombre de usuario y contraseña son requeridos',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Query user from database
    const stmt = env.DB.prepare(
      'SELECT * FROM users WHERE id = ? AND display_name = ? AND is_active = TRUE',
    )

    const user = await stmt.bind(id, display_name).first()

    if (!user) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Credenciales inválidas',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Verify password
    const isPasswordValid = await AuthService.verifyPassword(password, user.password_hash)

    if (!isPasswordValid) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Credenciales inválidas',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Update last login
    const updateStmt = env.DB.prepare('UPDATE users SET last_login = datetime("now") WHERE id = ?')
    await updateStmt.bind(user.id).run()

    // Generate JWT token
    const token = await AuthService.generateToken({
      id: user.id,
      account_id: user.account_id,
      display_name: user.display_name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
    })

    // Return success response
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Login exitoso',
        data: {
          token,
          user: {
            id: user.id,
            account_id: user.account_id,
            display_name: user.display_name,
            email: user.email,
            role: user.role,
            avatar_url: user.avatar_url,
          },
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
    )
  } catch (error) {
    console.error('Login error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error interno del servidor',
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}

// Handle preflight OPTIONS requests
export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
