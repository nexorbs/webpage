import { TransactionalEmailsApi, SendSmtpEmail } from '@getbrevo/brevo'

interface ContactFormData {
  name: string
  email: string
  project?: 'web' | 'mobile' | 'consultoria' | 'integral'
  message: string
}

interface Env {
  BREVO_API_KEY: string
}

export async function onRequestPost(context: { request: Request; env: Env }) {
  const { request, env } = context

  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (request.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders })
  }

  try {
    const formData = await request.formData()
    const data: ContactFormData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      project: formData.get('project') as any,
      message: formData.get('message') as string,
    }

    if (!data.name || !data.email || !data.message) {
      return new Response(JSON.stringify({ error: 'Faltan campos obligatorios' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const emailAPI = new TransactionalEmailsApi()
    ;(emailAPI as any).authentications.apiKey.apiKey = env.BREVO_API_KEY

    const projectTypes = {
      web: 'Desarrollo Web',
      mobile: 'Aplicación Móvil',
      consultoria: 'Consultoría Tech',
      integral: 'Solución Integral',
    }

    const message = new SendSmtpEmail()
    message.subject = `Nuevo contacto de ${data.name} - ${projectTypes[data.project as keyof typeof projectTypes] || 'Sin especificar'}`
    message.htmlContent = `
      <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="background: #000000; color: #ffffff; padding: 30px; text-align: center; margin-bottom: 30px;">
          <h1 style="margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">NEXORBS</h1>
          <p style="margin: 10px 0 0 0; color: #cccccc; font-size: 16px;">Nuevo mensaje de contacto</p>
        </div>

        <div style="background: #ffffff; padding: 30px; border: 2px solid #000000;">
          <h2 style="color: #000000; margin: 0 0 25px 0; font-size: 20px; font-weight: bold;">INFORMACIÓN DEL CONTACTO</h2>

          <div style="margin-bottom: 20px;">
            <strong style="color: #000000; display: inline-block; width: 120px;">NOMBRE:</strong>
            <span style="color: #666666;">${data.name}</span>
          </div>

          <div style="margin-bottom: 20px;">
            <strong style="color: #000000; display: inline-block; width: 120px;">EMAIL:</strong>
            <span style="color: #666666;">${data.email}</span>
          </div>

          ${
            data.project
              ? `
          <div style="margin-bottom: 20px;">
            <strong style="color: #000000; display: inline-block; width: 120px;">PROYECTO:</strong>
            <span style="color: #666666;">${projectTypes[data.project as keyof typeof projectTypes]}</span>
          </div>
          `
              : ''
          }

          <div style="margin-bottom: 20px;">
            <strong style="color: #000000; display: block; margin-bottom: 10px;">MENSAJE:</strong>
            <div style="background: #f8f8f8; padding: 20px; border-left: 4px solid #000000; color: #333333; line-height: 1.6;">
              ${data.message.replace(/\n/g, '<br>')}
            </div>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; padding: 20px; background: #f8f8f8; color: #666666; font-size: 14px;">
          <p style="margin: 0;">Este mensaje fue enviado desde el formulario de contacto de nexorbs.com</p>
          <p style="margin: 10px 0 0 0;">Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })}</p>
        </div>
      </div>
    `

    message.textContent = `
NUEVO CONTACTO - NEXORBS

INFORMACIÓN DEL CONTACTO:
- Nombre: ${data.name}
- Email: ${data.email}
${data.project ? `- Tipo de proyecto: ${projectTypes[data.project as keyof typeof projectTypes]}` : ''}

MENSAJE:
${data.message}

---
Enviado desde el formulario de contacto de nexorbs.com
Fecha: ${new Date().toLocaleString('es-ES', { timeZone: 'America/Mexico_City' })}
    `

    message.sender = {
      name: data.name,
      email: 'contacto@nexorbs.com',
    }

    message.to = [
      {
        email: 'contacto@nexorbs.com',
        name: 'NexOrbs Team',
      },
    ]

    message.replyTo = {
      email: data.email,
      name: data.name,
    }

    await emailAPI.sendTransacEmail(message)

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email enviado correctamente',
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  } catch (error) {
    console.error('Error sending email:', error)

    return new Response(
      JSON.stringify({
        error: 'Error interno del servidor',
        details: error instanceof Error ? error.message : 'Error desconocido',
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      },
    )
  }
}
