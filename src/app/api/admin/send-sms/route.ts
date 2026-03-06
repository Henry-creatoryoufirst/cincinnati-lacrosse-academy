import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getSmsProvider } from '@/lib/sms'

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

// GET /api/admin/send-sms — Get count of subscribers with phone numbers
export async function GET() {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response

  const { count, error } = await auth.supabase
    .from('email_subscribers')
    .select('id', { count: 'exact', head: true })
    .eq('is_active', true)
    .not('phone', 'is', null)

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch count' },
      { status: 500 }
    )
  }

  const smsProvider = getSmsProvider()

  return NextResponse.json({
    phoneSubscriberCount: count || 0,
    smsConfigured: smsProvider.isConfigured(),
  })
}

// POST /api/admin/send-sms — Send SMS broadcast to all subscribers with phone numbers
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

  const { message } = body

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return NextResponse.json(
      { error: 'Message is required' },
      { status: 400 }
    )
  }

  if (message.length > 1600) {
    return NextResponse.json(
      { error: 'Message too long (max 1600 characters)' },
      { status: 400 }
    )
  }

  // Fetch subscribers with phone numbers
  interface PhoneSubscriber {
    id: string
    phone: string | null
    name: string | null
  }

  const { data, error } = await auth.supabase
    .from('email_subscribers')
    .select('id, phone, name')
    .eq('is_active', true)
    .not('phone', 'is', null)
    .order('created_at', { ascending: false })

  const subscribers = data as PhoneSubscriber[] | null

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    )
  }

  if (!subscribers || subscribers.length === 0) {
    return NextResponse.json(
      { error: 'No subscribers with phone numbers found' },
      { status: 404 }
    )
  }

  const smsProvider = getSmsProvider()

  if (!smsProvider.isConfigured()) {
    return NextResponse.json({
      message: 'SMS provider not configured. Add TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, and TWILIO_PHONE_NUMBER to your environment variables.',
      configured: false,
      phoneNumbers: subscribers.map(s => s.phone),
      recipientCount: subscribers.length,
    })
  }

  // Send to all subscribers
  const results = { sent: 0, failed: 0, errors: [] as string[] }

  for (const subscriber of subscribers) {
    if (!subscriber.phone) continue
    const result = await smsProvider.sendSms(subscriber.phone, message.trim())
    if (result.success) {
      results.sent++
    } else {
      results.failed++
      results.errors.push(`${subscriber.phone}: ${result.error}`)
    }
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100))
  }

  return NextResponse.json({
    message: `SMS broadcast complete: ${results.sent} sent, ${results.failed} failed`,
    configured: true,
    ...results,
  })
}
