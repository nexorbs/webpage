import { AuthService } from '../../utils/auth'

interface UpdateProjectRequest {
  name?: string
  description?: string
  type?: 'Desarrollo Web' | 'Aplicación Móvil' | 'Consultoría Tech' | 'Solución Integral'
  client_id?: string
  status?: 'active' | 'completed' | 'cancelled' | 'on-hold'
  estimated_budget?: number
  estimated_duration?: number
  start_date?: string
  deadline?: string
}

// GET PROJECT BY ID
export async function onRequestGet(context: any): Promise<Response> {
  try {
    const { params, env, request } = context
    const projectId = params.id

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

    // Get project with client information
    const project = await env.DB.prepare(
      `
      SELECT p.*, u.display_name as client_name, u.email as client_email, u.company_name
      FROM projects p
      JOIN users u ON p.client_id = u.id
      WHERE p.id = ?
    `,
    )
      .bind(projectId)
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
          error: 'No tienes permisos para ver este proyecto',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // For developers, check if they have tickets in this project (will implement later)
    if (payload.role === 'developer') {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Acceso no autorizado',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: { project },
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
    console.error('Get project error:', error)

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

// UPDATE PROJECT
export async function onRequestPut(context: any): Promise<Response> {
  try {
    const { params, env, request } = context
    const projectId = params.id

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
          error: 'Solo administradores pueden editar proyectos',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Parse request body
    const updates: UpdateProjectRequest = await request.json()

    // Verify project exists
    const existingProject = await env.DB.prepare('SELECT * FROM projects WHERE id = ?')
      .bind(projectId)
      .first()

    if (!existingProject) {
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

    // Build update query
    const updateFields: string[] = []
    const updateParams: any[] = []

    if (updates.name !== undefined) {
      updateFields.push('name = ?')
      updateParams.push(updates.name)
    }

    if (updates.description !== undefined) {
      updateFields.push('description = ?')
      updateParams.push(updates.description)
    }

    if (updates.type !== undefined) {
      const validTypes = [
        'Desarrollo Web',
        'Aplicación Móvil',
        'Consultoría Tech',
        'Solución Integral',
      ]
      if (!validTypes.includes(updates.type)) {
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
      updateFields.push('type = ?')
      updateParams.push(updates.type)
    }

    if (updates.client_id !== undefined) {
      // Verify new client exists and is a client
      const client = await env.DB.prepare(
        'SELECT id FROM users WHERE id = ? AND role = ? AND is_active = TRUE',
      )
        .bind(updates.client_id, 'client')
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

      updateFields.push('client_id = ?')
      updateParams.push(updates.client_id)
    }

    if (updates.status !== undefined) {
      const validStatuses = ['active', 'completed', 'cancelled', 'on-hold']
      if (!validStatuses.includes(updates.status)) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'Estado de proyecto inválido',
          }),
          {
            status: 400,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }
      updateFields.push('status = ?')
      updateParams.push(updates.status)
    }

    if (updates.estimated_budget !== undefined) {
      updateFields.push('estimated_budget = ?')
      updateParams.push(updates.estimated_budget)
    }

    if (updates.estimated_duration !== undefined) {
      updateFields.push('estimated_duration = ?')
      updateParams.push(updates.estimated_duration)
    }

    if (updates.start_date !== undefined) {
      updateFields.push('start_date = ?')
      updateParams.push(updates.start_date)
    }

    if (updates.deadline !== undefined) {
      updateFields.push('deadline = ?')
      updateParams.push(updates.deadline)
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

    // Add updated_at and project ID
    updateFields.push("updated_at = datetime('now')")
    updateParams.push(projectId)

    // Execute update
    const updateQuery = `UPDATE projects SET ${updateFields.join(', ')} WHERE id = ?`
    await env.DB.prepare(updateQuery)
      .bind(...updateParams)
      .run()

    // Get updated project with client info
    const updatedProject = await env.DB.prepare(
      `
      SELECT p.*, u.display_name as client_name, u.email as client_email, u.company_name
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
        old_values, new_values, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `)

    await auditStmt
      .bind(
        'project',
        projectId,
        'update',
        payload.userId,
        JSON.stringify(existingProject),
        JSON.stringify(updates),
      )
      .run()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Proyecto actualizado exitosamente',
        data: { project: updatedProject },
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
    console.error('Update project error:', error)

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

// DELETE PROJECT
export async function onRequestDelete(context: any): Promise<Response> {
  try {
    const { params, env, request } = context
    const projectId = params.id

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
          error: 'Solo administradores pueden eliminar proyectos',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Get project before deletion for audit
    const project = await env.DB.prepare('SELECT * FROM projects WHERE id = ?')
      .bind(projectId)
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

    // Check if project has tickets (when tickets are implemented)
    // For now, we'll allow deletion

    // Delete project
    await env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(projectId).run()

    // Log action in audit_log
    const auditStmt = env.DB.prepare(`
      INSERT INTO audit_log (
        entity_type, entity_id, action, user_id,
        old_values, created_at
      ) VALUES (?, ?, ?, ?, ?, datetime('now'))
    `)

    await auditStmt
      .bind('project', projectId, 'delete', payload.userId, JSON.stringify(project))
      .run()

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Proyecto eliminado exitosamente',
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
    console.error('Delete project error:', error)

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
