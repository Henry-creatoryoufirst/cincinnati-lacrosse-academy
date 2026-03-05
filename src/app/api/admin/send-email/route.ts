import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

async function verifyAdmin() {
  const supabase = await createClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Unauthorized: not authenticated' },
        { status: 401 }
      ),
      supabase: null,
    } as const
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (profileError || !profile || profile.role !== 'admin') {
    return {
      authorized: false,
      response: NextResponse.json(
        { error: 'Forbidden: admin access required' },
        { status: 403 }
      ),
      supabase: null,
    } as const
  }

  return { authorized: true, response: null, supabase } as const
}

// POST /api/admin/send-email — Prepare an email to subscribers (admin only)
export async function POST(request: NextRequest) {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json(
      { error: 'Invalid JSON body' },
      { status: 400 }
    )
  }

  const { subject, body: emailBody, recipientIds } = body

  if (!subject || typeof subject !== 'string') {
    return NextResponse.json(
      { error: 'Missing required field: subject' },
      { status: 400 }
    )
  }

  if (!emailBody || typeof emailBody !== 'string') {
    return NextResponse.json(
      { error: 'Missing required field: body' },
      { status: 400 }
    )
  }

  // Fetch recipients based on whether specific IDs were provided
  let query = auth.supabase
    .from('email_subscribers')
    .select('id, email, name')
    .eq('is_active', true)

  if (Array.isArray(recipientIds) && recipientIds.length > 0) {
    query = query.in('id', recipientIds)
  }

  const { data: subscribers, error } = await query.order('email', { ascending: true })

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subscribers', details: error.message },
      { status: 500 }
    )
  }

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json(
      { error: 'No active subscribers found' },
      { status: 404 }
    )
  }

  const recipients = subscribers.map((s: { email: string }) => s.email)

  // Log the send attempt for debugging / audit purposes
  console.log('[send-email] Admin email prepared:', {
    subject,
    recipientCount: recipients.length,
    timestamp: new Date().toISOString(),
  })

  return NextResponse.json({
    message:
      'Email details prepared. Automated sending will be available once an email provider (e.g. Resend) is configured. For now, use the recipients list below to send manually.',
    recipients,
    subject,
    body: emailBody,
    recipientCount: recipients.length,
  })
}
