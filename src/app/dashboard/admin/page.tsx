import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AdminDashboard from '@/components/admin/AdminDashboard'
import type { Event } from '@/lib/types'

export default async function AdminDashboardPage() {
  const supabase = await createClient()

  // Auth check
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/dashboard/admin')
  }

  // Admin role check
  const { data: profile } = await supabase
    .from('profiles')
    .select('role, full_name')
    .eq('user_id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch all events (including inactive)
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: true })

  const allEvents: Event[] = events || []

  // Calculate stats
  const now = new Date()
  const upcomingEvents = allEvents.filter(
    (e) => new Date(e.start_date) > now && e.is_active
  ).length
  const activeEvents = allEvents.filter(e => e.is_active).length

  const totalBookingsResult = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
  const totalBookings = totalBookingsResult.count || 0

  // Fetch subscriber count
  let totalSubscribers = 0
  try {
    const subscriberCountResult = await supabase
      .from('email_subscribers')
      .select('id', { count: 'exact', head: true })
    totalSubscribers = subscriberCountResult.count || 0
  } catch {
    totalSubscribers = 0
  }

  const firstName = profile.full_name?.split(' ')[0] || 'Admin'

  return (
    <AdminDashboard
      firstName={firstName}
      events={allEvents}
      stats={{
        upcoming: upcomingEvents,
        active: activeEvents,
        bookings: totalBookings,
        subscribers: totalSubscribers,
      }}
    />
  )
}
