// Tickets API - Create and list tickets
import { AuthService } from '../../utils/auth'

export interface Ticket {
  id: string
  ticket_number: string
  project_id: string
  client_id: string
  assigned_developer_id?: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  status:
    | 'open'
    | 'assigned'
    | 'in_progress'
    | 'waiting_client'
    | 'resolved'
    | 'client_approved'
    | 'closed'
  category:
    | 'bug'
    | 'feature_request'
    | 'support'
    | 'consultation'
    | 'billing'
    | 'technical_issue'
    | 'change_request'
  created_at: string
  updated_at: string
  resolved_at?: string
  // Joined data
  project_name?: string
  client_name?: string
  developer_name?: string
}

interface CreateTicketRequest {
  project_id: string
  title: string
  description?: string
  priority: 'low' | 'medium' | 'high' | 'urgent'
  category:
    | 'bug'
    | 'feature_request'
    | 'support'
    | 'consultation'
    | 'billing'
    | 'technical_issue'
    | 'change_request'
}

// Helper function to generate ticket number
async function generateTicketNumber(env: any): Promise<string> {
  const year = new Date().getFullYear()

  // Get next counter
  const counterResult = await env.DB.prepare(
    'SELECT counter FROM sequence_counters WHERE type = ? AND year = ?',
  )
    .bind('ticket', year)
    .first()

  let counter = 1

  if (counterResult) {
    counter = counterResult.counter + 1
    // Update counter
    await env.DB.prepare('UPDATE sequence_counters SET counter = ? WHERE type = ? AND year = ?')
      .bind(counter, 'ticket', year)
      .run()
  } else {
    // Create counter for this year
    await env.DB.prepare('INSERT INTO sequence_counters (type, year, counter) VALUES (?, ?, ?)')
      .bind('ticket', year, counter)
      .run()
  }

  return `NX-${year}-${counter.toString().padStart(3, '0')}`
}

// CREATE TICKET (POST)
export async function onRequestPost(context: any): Promise<Response> {
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

    // Parse request body
    const body: CreateTicketRequest = await request.json()
    const { project_id, title, description, priority, category } = body

    // Validate required fields
    if (!project_id || !title || !priority || !category) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Proyecto, título, prioridad y categoría son requeridos',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Validate priority and type
    const validPriorities = ['low', 'medium', 'high', 'urgent']
    const validCategories = [
      'bug',
      'feature_request',
      'support',
      'consultation',
      'billing',
      'technical_issue',
      'change_request',
    ]

    if (!validPriorities.includes(priority) || !validCategories.includes(category)) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Prioridad o tipo inválidos',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Verify project exists and user has access
    const project = await env.DB.prepare(
      `
      SELECT id, client_id, name FROM projects WHERE id = ?
    `,
    )
      .bind(project_id)
      .first()

    if (!project) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Proyecto no encontrado',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Check access permissions
    if (payload.role === 'client' && project.client_id !== payload.userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Solo puedes crear tickets en tus propios proyectos',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Generate ticket data
    const ticketId = AuthService.generateUniqueId()
    const ticketNumber = await generateTicketNumber(env)

    // Determine client_id (for admin/developer created tickets)
    let clientId = project.client_id
    if (payload.role === 'client') {
      clientId = payload.userId
    }

    // Insert ticket
    const stmt = env.DB.prepare(`
      INSERT INTO tickets (
        id, ticket_number, project_id, client_id, title, description,
        priority, status, category, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, 'open', ?, datetime('now'), datetime('now'))
    `)

    await stmt
      .bind(
        ticketId,
        ticketNumber,
        project_id,
        clientId,
        title,
        description || null,
        priority,
        category,
      )
      .run()

    // Get created ticket with project info
    const createdTicket = await env.DB.prepare(
      `
      SELECT t.*, p.name as project_name, u.display_name as client_name
      FROM tickets t
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON t.client_id = u.id
      WHERE t.id = ?
    `,
    )
      .bind(ticketId)
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
        'ticket',
        ticketId,
        'create',
        payload.userId,
        JSON.stringify({ ticket_number: ticketNumber, title, priority, category, project_id }),
      )
      .run()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Ticket creado exitosamente',
        data: { ticket: createdTicket },
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
    console.error('Create ticket error:', error)

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

// LIST TICKETS (GET)
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
    const priority = url.searchParams.get('priority')
    const category = url.searchParams.get('category')
    const project_id = url.searchParams.get('project_id')
    const assigned_to = url.searchParams.get('assigned_to')
    const page = parseInt(url.searchParams.get('page') || '1')
    const limit = parseInt(url.searchParams.get('limit') || '10')
    const offset = (page - 1) * limit

    // Build query based on user role
    let baseQuery = `
      SELECT t.*, p.name as project_name, u.display_name as client_name,
             dev.display_name as developer_name
      FROM tickets t
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON t.client_id = u.id
      LEFT JOIN users dev ON t.assigned_developer_id = dev.id
    `
    let countQuery =
      'SELECT COUNT(*) as total FROM tickets t JOIN projects p ON t.project_id = p.id JOIN users u ON t.client_id = u.id'

    const conditions: string[] = []
    const params: any[] = []

    // Role-based filtering
    if (payload.role === 'client') {
      // Clients only see their own tickets
      conditions.push('t.client_id = ?')
      params.push(payload.userId)
    } else if (payload.role === 'developer') {
      // Developers see tickets assigned to them OR unassigned tickets
      conditions.push('(t.assigned_developer_id = ? OR t.assigned_developer_id IS NULL)')
      params.push(payload.userId)
    }
    // Admins see all tickets (no additional conditions)

    // Additional filters
    if (status) {
      conditions.push('t.status = ?')
      params.push(status)
    }

    if (priority) {
      conditions.push('t.priority = ?')
      params.push(priority)
    }

    if (category) {
      conditions.push('t.category = ?')
      params.push(category)
    }

    if (project_id) {
      conditions.push('t.project_id = ?')
      params.push(project_id)
    }

    if (assigned_to && payload.role === 'admin') {
      conditions.push('t.assigned_developer_id = ?')
      params.push(assigned_to)
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

    // Get paginated tickets
    const ticketsQuery = baseQuery + ' ORDER BY t.created_at DESC LIMIT ? OFFSET ?'
    const tickets = await env.DB.prepare(ticketsQuery)
      .bind(...params, limit, offset)
      .all()

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          tickets: tickets.results,
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
    console.error('List tickets error:', error)

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
