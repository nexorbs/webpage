import { UpdateTicketRequest } from '../../entities/tickets.entities'
import { AuthService } from '../../utils/auth'

// GET TICKET BY ID
export async function onRequestGet(context: any): Promise<Response> {
  try {
    const { params, env, request } = context
    const ticketId = params.id

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

    // Get ticket with all related information
    const ticket = await env.DB.prepare(
      `
      SELECT t.*, p.name as project_name, p.client_id as project_client_id,
             u.display_name as client_name, u.email as client_email,
             dev.display_name as developer_name, dev.email as developer_email
      FROM tickets t
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON t.client_id = u.id
      LEFT JOIN users dev ON t.assigned_developer_id = dev.id
      WHERE t.id = ?
    `,
    )
      .bind(ticketId)
      .first()

    if (!ticket) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Ticket no encontrado',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Check access permissions
    if (payload.role === 'client' && ticket.client_id !== payload.userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No tienes permisos para ver este ticket',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    if (
      payload.role === 'developer' &&
      ticket.assigned_developer_id !== null &&
      ticket.assigned_developer_id !== payload.userId
    ) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Solo puedes ver tickets asignados a ti o sin asignar',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Get ticket comments
    const comments = await env.DB.prepare(
      `
      SELECT tc.*, u.display_name as author_name, u.role as author_role
      FROM ticket_comments tc
      JOIN users u ON tc.user_id = u.id
      WHERE tc.ticket_id = ?
      ORDER BY tc.created_at ASC
    `,
    )
      .bind(ticketId)
      .all()

    return new Response(
      JSON.stringify({
        success: true,
        data: {
          ticket,
          comments: comments.results,
        },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
    )
  } catch (error) {
    console.error('Get ticket error:', error)

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

// UPDATE TICKET
export async function onRequestPut(context: any): Promise<Response> {
  try {
    const { params, env, request } = context
    const ticketId = params.id

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
    const updates: UpdateTicketRequest = await request.json()

    // Verify ticket exists
    const existingTicket = await env.DB.prepare(
      `
      SELECT t.*, p.client_id as project_client_id
      FROM tickets t
      JOIN projects p ON t.project_id = p.id
      WHERE t.id = ?
    `,
    )
      .bind(ticketId)
      .first()

    if (!existingTicket) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Ticket no encontrado',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Check permissions based on role and what's being updated
    if (payload.role === 'client') {
      // Clients can only update their own tickets and limited fields
      if (existingTicket.client_id !== payload.userId) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Solo puedes editar tus propios tickets',
          }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      // Clients cannot assign tickets or change certain statuses
      if (
        updates.assigned_developer_id !== undefined ||
        (updates.status && !['open', 'closed'].includes(updates.status))
      ) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'No tienes permisos para realizar esta acción',
          }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }
    } else if (payload.role === 'developer') {
      // Developers can update tickets assigned to them OR unassigned tickets (for self-assignment)
      if (
        existingTicket.assigned_developer_id !== null &&
        existingTicket.assigned_developer_id !== payload.userId
      ) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Solo puedes editar tickets asignados a ti',
          }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }

      // Developers can only assign tickets to themselves or leave them unassigned
      if (
        updates.assigned_developer_id !== undefined &&
        updates.assigned_developer_id !== null &&
        updates.assigned_developer_id !== payload.userId
      ) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'No puedes asignar tickets a otros desarrolladores',
          }),
          {
            status: 403,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }
    }
    // Admins can update anything

    // Build update query
    const updateFields: string[] = []
    const updateParams: any[] = []

    if (updates.title !== undefined) {
      updateFields.push('title = ?')
      updateParams.push(updates.title)
    }

    if (updates.description !== undefined) {
      updateFields.push('description = ?')
      updateParams.push(updates.description)
    }

    if (updates.priority !== undefined) {
      const validPriorities = ['low', 'medium', 'high', 'urgent']
      if (!validPriorities.includes(updates.priority)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Prioridad inválida',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }
      updateFields.push('priority = ?')
      updateParams.push(updates.priority)
    }

    if (updates.status !== undefined) {
      const validStatuses = [
        'open',
        'assigned',
        'in_progress',
        'waiting_client',
        'resolved',
        'client_approved',
        'closed',
      ]
      if (!validStatuses.includes(updates.status)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Estado inválido',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }
      updateFields.push('status = ?')
      updateParams.push(updates.status)

      // Set resolved_at when status changes to resolved
      if (updates.status === 'resolved') {
        updateFields.push("resolved_at = datetime('now')")
      }
    }

    if (updates.category !== undefined) {
      const validCategories = ['bug', 'feature', 'support', 'improvement']
      if (!validCategories.includes(updates.category)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Categoría inválida',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }
      updateFields.push('category = ?')
      updateParams.push(updates.category)
    }

    if (updates.assigned_developer_id !== undefined) {
      if (updates.assigned_developer_id) {
        // Verify the user exists and is a developer
        const developer = await env.DB.prepare(
          'SELECT id FROM users WHERE id = ? AND role = ? AND is_active = TRUE',
        )
          .bind(updates.assigned_developer_id, 'developer')
          .first()

        if (!developer) {
          return new Response(
            JSON.stringify({
              success: false,
              error: 'Desarrollador no encontrado o inactivo',
            }),
            {
              status: 404,
              headers: { 'Content-Type': 'application/json' },
            },
          )
        }
      }

      updateFields.push('assigned_developer_id = ?')
      updateParams.push(updates.assigned_developer_id || null)
    }

    if (updateFields.length === 0) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No hay campos para actualizar',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Add updated_at and ticket ID
    updateFields.push("updated_at = datetime('now')")
    updateParams.push(ticketId)

    // Execute update
    const updateQuery = `UPDATE tickets SET ${updateFields.join(', ')} WHERE id = ?`
    await env.DB.prepare(updateQuery)
      .bind(...updateParams)
      .run()

    // Get updated ticket with full info
    const updatedTicket = await env.DB.prepare(
      `
      SELECT t.*, p.name as project_name,
             u.display_name as client_name, u.email as client_email,
             dev.display_name as developer_name, dev.email as developer_email
      FROM tickets t
      JOIN projects p ON t.project_id = p.id
      JOIN users u ON t.client_id = u.id
      LEFT JOIN users dev ON t.assigned_developer_id = dev.id
      WHERE t.id = ?
    `,
    )
      .bind(ticketId)
      .first()

    // Log action in audit_log
    const auditStmt = env.DB.prepare(`
      INSERT INTO audit_log (
        entity_type, entity_id, action, user_id,
        old_values, new_values, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `)

    await auditStmt
      .bind(
        'ticket',
        ticketId,
        'update',
        payload.userId,
        JSON.stringify(existingTicket),
        JSON.stringify(updates),
      )
      .run()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Ticket actualizado exitosamente',
        data: { ticket: updatedTicket },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
    )
  } catch (error) {
    console.error('Update ticket error:', error)

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
      'Access-Control-Allow-Methods': 'GET, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
