// Verify JWT token and return user info
import { AuthService } from '../../utils/auth'

export async function onRequestPost(context: any): Promise<Response> {
  try {
    const { request } = context

    // Get token from Authorization header or body
    const authHeader = request.headers.get('Authorization')
    let token = authHeader?.replace('Bearer ', '')

    if (!token) {
      const body = await request.json()
      token = body.token
    }

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Token no proporcionado',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Verify token
    const payload = await AuthService.verifyToken(token)

    if (!payload) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Token inválido o expirado',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Return user info
    return new Response(
      JSON.stringify({
        success: true,
        message: 'Token válido',
        data: {
          user: {
            id: payload.userId,
            account_id: payload.accountId,
            display_name: payload.displayName,
            email: payload.email,
            role: payload.role,
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
    console.error('Token verification error:', error)

    return new Response(
      JSON.stringify({
        success: false,
        error: 'Error al verificar token',
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
