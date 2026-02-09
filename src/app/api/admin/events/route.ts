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

// GET /api/admin/events — List ALL events (including inactive) for admin
export async function GET() {
  const auth = await verifyAdmin()
  if (!auth.authorized) return auth.response

  const { data: events, error } = await auth.supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: false })

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ events })
}

// POST /api/admin/events — Create a new event
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

  const {
    title,
    description,
    event_type,
    start_date,
    end_date,
    location,
    address,
    max_participants,
    price,
    member_price,
    skill_levels,
    age_groups,
  } = body

  if (!title || !start_date) {
    return NextResponse.json(
      { error: 'Missing required fields: title and start_date are required' },
      { status: 400 }
    )
  }

  const { data: event, error } = await auth.supabase
    .from('events')
    .insert({
      title,
      description: description ?? null,
      event_type: event_type ?? null,
      start_date,
      end_date: end_date ?? null,
      location: location ?? null,
      address: address ?? null,
      max_participants: max_participants ?? null,
      price: price ?? null,
      member_price: member_price ?? null,
      skill_levels: skill_levels ?? null,
      age_groups: age_groups ?? null,
      is_active: true,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: 'Failed to create event', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ event }, { status: 201 })
}

// PUT /api/admin/events — Update an event (id in body)
export async function PUT(request: NextRequest) {
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

  const { id, ...updates } = body

  if (!id) {
    return NextResponse.json(
      { error: 'Missing required field: id' },
      { status: 400 }
    )
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json(
      { error: 'No fields to update' },
      { status: 400 }
    )
  }

  const { data: event, error } = await auth.supabase
    .from('events')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    return NextResponse.json(
      { error: 'Failed to update event', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ event })
}

// DELETE /api/admin/events — Soft delete (deactivate) an event (id in query param)
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
    .from('events')
    .update({ is_active: false })
    .eq('id', id)

  if (error) {
    return NextResponse.json(
      { error: 'Failed to deactivate event', details: error.message },
      { status: 500 }
    )
  }

  return NextResponse.json({ message: 'Event deactivated successfully' })
}
