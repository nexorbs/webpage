// Update user - Admin only functionality
import { AuthService } from '../../utils/auth'

interface UpdateUserRequest {
  display_name?: string
  email?: string
  role?: 'client' | 'developer' | 'admin'
  is_active?: boolean
  company_name?: string
  phone?: string
  password?: string // Optional password change
}

export async function onRequestPut(context: any): Promise<Response> {
  try {
    const { request, env, params } = context
    const userId = params.id

    if (!userId) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'ID de usuario requerido',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

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
          error: 'Solo administradores pueden editar usuarios',
        }),
        {
          status: 403,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Parse request body
    const body: UpdateUserRequest = await request.json()

    // Check if user exists
    const existingUser = await env.DB.prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first()

    if (!existingUser) {
      return new Response(
        JSON.stringify({
          success: false,
          error: 'Usuario no encontrado',
        }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Validate role if provided
    if (body.role && !['client', 'developer', 'admin'].includes(body.role)) {
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

    // Check if email is being changed and if it's already in use
    if (body.email && body.email !== existingUser.email) {
      const emailExists = await env.DB.prepare('SELECT id FROM users WHERE email = ? AND id != ?')
        .bind(body.email, userId)
        .first()

      if (emailExists) {
        return new Response(
          JSON.stringify({
            success: false,
            error: 'El email ya está en uso por otro usuario',
          }),
          {
            status: 409,
            headers: { 'Content-Type': 'application/json' },
          },
        )
      }
    }

    // Build update query dynamically
    const updateFields: string[] = []
    const updateValues: any[] = []

    if (body.display_name !== undefined) {
      updateFields.push('display_name = ?')
      updateValues.push(body.display_name)
    }

    if (body.email !== undefined) {
      updateFields.push('email = ?')
      updateValues.push(body.email)
    }

    if (body.role !== undefined) {
      updateFields.push('role = ?')
      updateValues.push(body.role)
    }

    if (body.is_active !== undefined) {
      updateFields.push('is_active = ?')
      updateValues.push(body.is_active)
    }

    if (body.company_name !== undefined) {
      updateFields.push('company_name = ?')
      updateValues.push(body.company_name)
    }

    if (body.phone !== undefined) {
      updateFields.push('phone = ?')
      updateValues.push(body.phone)
    }

    // Handle password change if provided
    if (body.password) {
      const passwordHash = await AuthService.hashPassword(body.password)
      updateFields.push('password_hash = ?')
      updateValues.push(passwordHash)
    }

    // Always update the updated_at timestamp
    updateFields.push('updated_at = datetime("now")')

    if (updateFields.length === 1) {
      // Only updated_at
      return new Response(
        JSON.stringify({
          success: false,
          error: 'No se proporcionaron campos para actualizar',
        }),
        {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        },
      )
    }

    // Execute update
    const updateQuery = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`
    updateValues.push(userId)

    await env.DB.prepare(updateQuery)
      .bind(...updateValues)
      .run()

    // Get updated user data
    const updatedUser = await env.DB.prepare('SELECT * FROM users WHERE id = ?')
      .bind(userId)
      .first()

    // Log the change in audit_log
    const auditStmt = env.DB.prepare(`
      INSERT INTO audit_log (
        entity_type, entity_id, action, user_id,
        old_values, new_values, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
    `)

    await auditStmt
      .bind(
        'user',
        userId,
        'update',
        payload.userId,
        JSON.stringify({
          display_name: existingUser.display_name,
          email: existingUser.email,
          role: existingUser.role,
          is_active: existingUser.is_active,
        }),
        JSON.stringify({
          display_name: updatedUser.display_name,
          email: updatedUser.email,
          role: updatedUser.role,
          is_active: updatedUser.is_active,
        }),
      )
      .run()

    // Return sanitized user data (without password_hash)
    const sanitizedUser = {
      id: updatedUser.id,
      account_id: updatedUser.account_id,
      display_name: updatedUser.display_name,
      email: updatedUser.email,
      role: updatedUser.role,
      is_active: updatedUser.is_active,
      created_at: updatedUser.created_at,
      updated_at: updatedUser.updated_at,
      last_login: updatedUser.last_login,
      company_name: updatedUser.company_name,
      phone: updatedUser.phone,
      avatar_url: updatedUser.avatar_url,
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Usuario actualizado exitosamente',
        data: { user: sanitizedUser },
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'PUT, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      },
    )
  } catch (error) {
    console.error('Update user error:', error)

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
      'Access-Control-Allow-Methods': 'PUT, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Max-Age': '86400',
    },
  })
}
