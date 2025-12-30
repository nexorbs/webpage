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

    // Get query parameters for filtering and pagination
    const url = new URL(request.url)
    const role = url.searchParams.get('role')
    const active = url.searchParams.get('active')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build query with filters
    let baseQuery = 'SELECT * FROM users;'
    let countQuery = 'SELECT COUNT(*) as total FROM users;'
    const conditions: string[] = []
    const params: any[] = []

    if (role) {
      conditions.push('role = ?')
      params.push(role)
    }

    if (active !== null) {
      conditions.push('is_active = ?')
      params.push(active === 'true')
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ')
      baseQuery += whereClause
      countQuery += whereClause
    }

    // Get total count
    const totalResult = await env.DB.prepare(countQuery)
      .bind(...params)
      .first()
    const total = totalResult?.total || 0

    // Get paginated users
    const usersQuery = baseQuery + ' ORDER BY created_at DESC LIMIT ? OFFSET ?'
    const users = await env.DB.prepare(usersQuery)
      .bind(...params, limit, offset)
      .all()

    // Remove password_hash from results
    const sanitizedUsers = users.results.map((user: any) => ({
      id: user.id,
      account_id: user.account_id,
      display_name: user.display_name,
      email: user.email,
      role: user.role,
      is_active: user.is_active,
      created_at: user.created_at,
      updated_at: user.updated_at,
      last_login: user.last_login,
      company_name: user.company_name,
      phone: user.phone,
      avatar_url: user.avatar_url,
    }))

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          users: sanitizedUsers,
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
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
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

// Handle preflight OPTIONS requests
export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
