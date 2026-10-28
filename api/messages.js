import { neon } from '@neondatabase/serverless'

const recipient = 'azadehahmadi080@gmail.com'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default async function handler(request, response) {
  if (request.method !== 'POST') {
    response.setHeader('Allow', 'POST')
    return response.status(405).json({ error: 'Method not allowed.' })
  }

  const { name, email, message } = request.body ?? {}
  if (![name, email, message].every((value) => typeof value === 'string' && value.trim())) {
    return response.status(400).json({ error: 'Please complete all required fields.' })
  }

  const safeName = name.trim()
  const safeEmail = email.trim()
  const safeMessage = message.trim()
  if (safeName.length > 120 || safeEmail.length > 254 || safeMessage.length > 5000 || !emailPattern.test(safeEmail)) {
    return response.status(400).json({ error: 'Please check your details and try again.' })
  }

  const { DATABASE_URL, RESEND_API_KEY, MAIL_FROM } = process.env
  if (!DATABASE_URL || !RESEND_API_KEY || !MAIL_FROM) {
    return response.status(503).json({ error: 'Contact form services are not configured yet.' })
  }

  try {
    const sql = neon(DATABASE_URL)
    await sql`CREATE TABLE IF NOT EXISTS messages (
      id BIGSERIAL PRIMARY KEY,
      name VARCHAR(120) NOT NULL,
      email VARCHAR(254) NOT NULL,
      message TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )`

    const subjectName = safeName.replace(/[\r\n]+/g, ' ')
    const emailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: MAIL_FROM,
        to: [recipient],
        reply_to: safeEmail,
        subject: `Portfolio contact from ${subjectName}`,
        text: `Name: ${safeName}\nEmail: ${safeEmail}\n\n${safeMessage}`,
      }),
    })

    if (!emailResponse.ok) {
      console.error('Resend delivery failed:', await emailResponse.text())
      return response.status(502).json({ error: 'Email could not be delivered. Please try again later.' })
    }

    try {
      await sql`INSERT INTO messages (name, email, message) VALUES (${safeName}, ${safeEmail}, ${safeMessage})`
    } catch (databaseError) {
      console.error('Email delivered, but message could not be saved:', databaseError)
    }

    return response.status(201).json({ ok: true })
  } catch (error) {
    console.error('Contact form request failed:', error)
    return response.status(502).json({ error: 'Contact form is temporarily unavailable. Please try again later.' })
  }
}
