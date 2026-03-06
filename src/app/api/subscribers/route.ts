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

// POST /api/subscribers — Add a new email subscriber (public)
export async function POST(request: NextRequest) {
  try {
    let body: Record<string, unknown>
    try {
      body = await request.json()
    } catch {
      return NextResponse.json(
        { error: 'Invalid JSON body' },
        { status: 400 }
      )
    }

    const { email, name, source, phone } = body

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { error: 'Missing required field: email' },
        { status: 400 }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Phone validation (US format, optional)
    if (phone && typeof phone === 'string') {
      const cleaned = phone.replace(/\D/g, '')
      if (cleaned.length !== 10 && cleaned.length !== 11) {
        return NextResponse.json(
          { error: 'Please enter a valid US phone number' },
          { status: 400 }
        )
      }
    }

    const supabase = await createClient()

    const { data: subscriber, error } = await supabase
      .from('email_subscribers')
      .insert({
        email: email.toLowerCase().trim(),
        name: name ?? null,
        phone: phone ? String(phone).replace(/\D/g, '').slice(-10) : null,
        source: source ?? 'website',
      })
      .select()
      .single()

    if (error) {
      // Check for duplicate email (unique constraint violation)
      if (error.code === '23505') {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 409 }
        )
      }

      console.error('Supabase insert error:', error)
      return NextResponse.json(
        { error: 'Failed to subscribe. Please try again.' },
        { status: 500 }
      )
    }

    return NextResponse.json({ subscriber }, { status: 201 })
  } catch {
    return NextResponse.json(
      { error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}

// GET /api/subscribers — List all subscribers (admin only)
export async function GET(request: NextRequest) {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response

  const { searchParams } = new URL(request.url)
  const format = searchParams.get('format')

  const { data: subscribers, error } = await auth.supabase
    .from('email_subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch subscribers', details: error.message },
      { status: 500 }
    )
  }

  // Return CSV download if requested
  if (format === 'csv') {
    const headers = ['id', 'email', 'name', 'phone', 'source', 'is_active', 'created_at']
    const csvRows = [headers.join(',')]

    for (const sub of subscribers ?? []) {
      const row = headers.map((header) => {
        const value = sub[header as keyof typeof sub]
        const stringValue = value === null || value === undefined ? '' : String(value)
        // Escape commas and quotes in CSV values
        if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
          return `"${stringValue.replace(/"/g, '""')}"`
        }
        return stringValue
      })
      csvRows.push(row.join(','))
    }

    return new NextResponse(csvRows.join('\n'), {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="subscribers.csv"',
      },
    })
  }

  return NextResponse.json({ subscribers })
}

// DELETE /api/subscribers?id=<uuid> — Remove a subscriber (admin only)
export async function DELETE(request: NextRequest) {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response

  const { searchParams } = new URL(request.url)
  const id = searchParams.get('id')

  if (!id) {
    return NextResponse.json(
      { error: 'Missing required query parameter: id' },
      { status: 400 }
    )
  }

  const { error } = await auth.supabase
    .from('email_subscribers')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: 'Failed to delete subscriber', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: 'Subscriber removed successfully' })
}
