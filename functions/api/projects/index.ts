import { CreateProjectRequest } from '../../entities/project.entities'
import { AuthService } from '../../utils/auth'

// Helper function to generate project code
async function generateProjectCode(env: any, type: string): Promise<string> {
  const year = new Date().getFullYear()

  // Get type prefix
  const typePrefix =
    {
      'Desarrollo Web': 'WEB',
      'Aplicación Móvil': 'MOB',
      'Consultoría Tech': 'CON',
      'Solución Integral': 'INT',
    }[type] || 'PRJ'

  // Get next counter
  const counterResult = await env.DB.prepare(
    'SELECT counter FROM sequence_counters WHERE type = ? AND year = ?',
  )
    .bind('project', year)
    .first()

  let counter = 1

  if (counterResult) {
    counter = counterResult.counter + 1
    // Update counter
    await env.DB.prepare('UPDATE sequence_counters SET counter = ? WHERE type = ? AND year = ?')
      .bind(counter, 'project', year)
      .run()
  } else {
    // Create counter for this year
    await env.DB.prepare('INSERT INTO sequence_counters (type, year, counter) VALUES (?, ?, ?)')
      .bind('project', year, counter)
      .run()
  }

  return `NX-${typePrefix}-${year}-${counter.toString().padStart(3, '0')}`
}

// CREATE PROJECT (POST)
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
          error: 'Solo administradores pueden crear proyectos',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Parse request body
    const body: CreateProjectRequest = await request.json()
    const {
      name,
      description,
      type,
      client_id,
      estimated_budget,
      estimated_duration,
      start_date,
      deadline,
    } = body

    // Validate required fields
    if (!name || !type || !client_id) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Nombre, tipo y cliente son requeridos',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Validate type
    const validTypes = [
      'Desarrollo Web',
      'Aplicación Móvil',
      'Consultoría Tech',
      'Solución Integral',
    ]
    if (!validTypes.includes(type)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Tipo de proyecto inválido',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Verify client exists and is a client
    const client = await env.DB.prepare(
      'SELECT id, role FROM users WHERE id = ? AND role = ? AND is_active = TRUE',
    )
      .bind(client_id, 'client')
      .first()

    if (!client) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Cliente no encontrado o inactivo',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Generate project data
    const projectId = AuthService.generateUniqueId()
    const projectCode = await generateProjectCode(env, type)

    // Insert project
    const stmt = env.DB.prepare(`
      INSERT INTO projects (
        id, project_code, client_id, name, description,
        type, status, estimated_budget, estimated_duration,
        start_date, deadline, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, 'active', ?, ?, ?, ?, datetime('now'), datetime('now'))
    `)

    await stmt
      .bind(
        projectId,
        projectCode,
        client_id,
        name,
        description || null,
        type,
        estimated_budget || null,
        estimated_duration || null,
        start_date || null,
        deadline || null,
      )
      .run()

    // Get created project with client info
    const createdProject = await env.DB.prepare(
      `
      SELECT p.*, u.display_name as client_name, u.email as client_email
      FROM projects p
      JOIN users u ON p.client_id = u.id
      WHERE p.id = ?
    `,
    )
      .bind(projectId)
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
        'project',
        projectId,
        'create',
        payload.userId,
        JSON.stringify({ name, type, client_id, project_code: projectCode }),
      )
      .run()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Proyecto creado exitosamente',
        data: { project: createdProject },
      }),
      {
        status: 201,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
    )
  } catch (error) {
    console.error('Create project error:', error)

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

// LIST PROJECTS (GET)
export async function onRequestGet(context: any): Promise<Response> {
  try {
    const { request, env } = context

    // Verify authorization
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
    if (!payload) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Token inválido',
        }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Get query parameters
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const type = url.searchParams.get('type')
    const client_id = url.searchParams.get('client_id')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build query based on user role
    let baseQuery = `
      SELECT p.*, u.display_name as client_name, u.email as client_email, u.company_name
      FROM projects p
      JOIN users u ON p.client_id = u.id
    `
    let countQuery = 'SELECT COUNT(*) as total FROM projects p'

    const conditions: string[] = []
    const params: any[] = []

    // Role-based filtering
    if (payload.role === 'client') {
      // Clients only see their own projects
      conditions.push('p.client_id = ?')
      params.push(payload.userId)
    } else if (payload.role === 'developer') {
      conditions.push('1 = 0') // No projects for developers yet
    }
    // Admins see all projects (no additional conditions)

    // Additional filters
    if (status) {
      conditions.push('p.status = ?')
      params.push(status)
    }

    if (type) {
      conditions.push('p.type = ?')
      params.push(type)
    }

    if (client_id && payload.role === 'admin') {
      conditions.push('p.client_id = ?')
      params.push(client_id)
    }

    if (conditions.length > 0) {
      const whereClause = ' WHERE ' + conditions.join(' AND ')
      baseQuery += whereClause
      countQuery += whereClause
        .replace('p.client_id', 'client_id')
        .replace('p.status', 'status')
        .replace('p.type', 'type')
    }

    // Get total count
    const totalResult = await env.DB.prepare(countQuery)
      .bind(...params)
      .first()
    const total = totalResult?.total || 0

    // Get paginated projects
    const projectsQuery = baseQuery + ' ORDER BY p.created_at DESC LIMIT ? OFFSET ?'
    const projects = await env.DB.prepare(projectsQuery)
      .bind(...params, limit, offset)
      .all()

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          projects: projects.results,
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
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
    )
  } catch (error) {
    console.error('List projects error:', error)

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
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
