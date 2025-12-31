import { RegisterRequest } from '../../entities/auth.entities'
import { AuthService } from '../../utils/auth'

export async function onRequestPost(context: any): Promise<Response> {
  try {
    const { request, env } = context

    // Verify admin authorization
    const authHeader = request.headers.get('Authorization')
    const token = authHeader?.replace('Bearer ', '')

    if (!token) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Token de autorización requerido',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    const payload = await AuthService.verifyToken(token)
    if (!payload || payload.role !== 'admin') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Solo administradores pueden crear usuarios',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Parse request body
    const body: RegisterRequest = await request.json()
    const { display_name, email, password, role, company_name, phone } = body

    // Validate input
    if (!display_name || !email || !password || !role) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Nombre, email, contraseña y rol son requeridos',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    if (!['client', 'developer', 'admin'].includes(role)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Rol inválido. Debe ser: client, developer o admin',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Check if email already exists
    const existingUser = await env.DB.prepare('SELECT id FROM users WHERE email = ?')
      .bind(email)
      .first()

    if (existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'El email ya está registrado',
        }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Generate user data
    const userId = AuthService.generateUniqueId()
    const accountId = AuthService.generateAccountId(role)
    const passwordHash = await AuthService.hashPassword(password)

    // Insert new user
    const stmt = env.DB.prepare(`
      INSERT INTO users (
        id, account_id, display_name, email, password_hash,
        role, company_name, phone, is_active,
        created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, TRUE, datetime('now'), datetime('now'))
    `)

    await stmt
      .bind(
        userId,
        accountId,
        display_name,
        email,
        passwordHash,
        role,
        company_name || null,
        phone || null,
      )
      .run()

    // Log action in audit_log
    const auditStmt = env.DB.prepare(`
      INSERT INTO audit_log (
        entity_type, entity_id, action, user_id,
        new_values, created_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'))
    `)

    await auditStmt
      .bind(
        'user',
        userId,
        'create',
        payload.userId,
        JSON.stringify({ display_name, email, role, account_id: accountId }),
      )
      .run()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Usuario creado exitosamente',
        data: {
          user: {
            id: userId,
            account_id: accountId,
            display_name,
            email,
            role,
            company_name,
            phone,
          },
        },
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
    )
  } catch (error) {
    console.error('Registration error:', error)

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
