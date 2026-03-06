import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

// GET /api/events/week?start=2026-03-02T00:00:00&end=2026-03-08T23:59:59
// Public API — returns active events for a given date range
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const start = searchParams.get('start')
  const end = searchParams.get('end')

  if (!start || !end) {
    return NextResponse.json(
      { error: 'Missing required query parameters: start and end' },
      { status: 400 }
    )
  }

  const supabase = await createClient()

  const { data: events, error } = await supabase
    .from('events')
    .select('id, title, event_type, start_date, end_date, location, price, member_price, max_participants, current_participants')
    .eq('is_active', true)
    .gte('start_date', start)
    .lte('start_date', end)
    .order('start_date', { ascending: true })

  if (error) {
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }

  return NextResponse.json({ events: events || [] })
}
