// Users API - List and Create users
import { AuthService } from '../../utils/auth'

interface UserListItem {
  id: string
  account_id: string
  display_name: string
  email: string
  role: string
  is_active: boolean
  created_at: string
  last_login: string | null
  company_name: string | null
  phone: string | null
}

interface CreateUserRequest {
  account_id: string
  display_name: string
  email: string
  password: string
  role: 'developer' | 'client'
  company_name?: string
}

// GET - List users
export async function onRequestGet(context: any): Promise<Response> {
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
          error: 'Solo administradores pueden ver la lista de usuarios',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Parse query parameters
    const url = new URL(request.url)
    const role = url.searchParams.get('role')
    const isActive = url.searchParams.get('is_active')
    const search = url.searchParams.get('search')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build query
    let query = `
      SELECT
        id, account_id, display_name, email, role, is_active,
        created_at, last_login, company_name, phone
      FROM users
    `
    let countQuery = 'SELECT COUNT(*) as total FROM users'

    const conditions: string[] = []
    const params: any[] = []

    // Add filters
    if (role) {
      conditions.push('role = ?')
      params.push(role)
    }

    if (isActive !== null) {
      conditions.push('is_active = ?')
      params.push(isActive === 'true')
    }

    if (search) {
      conditions.push('(display_name LIKE ? OR email LIKE ? OR account_id LIKE ?)')
      const searchTerm = `%${search}%`
      params.push(searchTerm, searchTerm, searchTerm)
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ')
      query += whereClause
      countQuery += whereClause
    }

    // Get total count
    const totalResult = await env.DB.prepare(countQuery)
      .bind(...params)
      .first()
    const total = totalResult?.total || 0

    // Get paginated users
    query += ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    const users = await env.DB.prepare(query)
      .bind(...params, limit, offset)
      .all()

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          users: users.results,
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
          },
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
    )
  } catch (error) {
    console.error('List users error:', error)

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

// POST - Create user
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
    const body: CreateUserRequest = await request.json()
    const { account_id, display_name, email, password, role, company_name } = body

    // Validate required fields
    if (!account_id || !display_name || !email || !password || !role) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Todos los campos requeridos deben ser proporcionados',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Validate role
    if (!['developer', 'client'].includes(role)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Rol inválido',
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
          error: 'Ya existe un usuario con este email',
        }),
        {
          status: 409,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Hash password
    const hashedPassword = await AuthService.hashPassword(password)

    // Generate user ID
    const userId = AuthService.generateUniqueId()

    // Insert user
    const stmt = env.DB.prepare(`
      INSERT INTO users (
        id, account_id, display_name, email, password_hash,
        role, is_active, company_name, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, datetime('now'), datetime('now'))
    `)

    await stmt
      .bind(
        userId,
        account_id,
        display_name,
        email,
        hashedPassword,
        role,
        true,
        company_name || null,
      )
      .run()

    // Get created user (without password)
    const createdUser = await env.DB.prepare(
      `
      SELECT id, account_id, display_name, email, role, is_active, company_name, created_at, updated_at
      FROM users WHERE id = ?
    `,
    )
      .bind(userId)
      .first()

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
        JSON.stringify({ account_id, display_name, email, role, company_name }),
      )
      .run()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Usuario creado exitosamente',
        data: { user: createdUser },
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
    )
  } catch (error) {
    console.error('Create user error:', error)

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
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
