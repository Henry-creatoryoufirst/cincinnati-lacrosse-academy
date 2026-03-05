import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EventList from '@/components/admin/EventList'
import SubscriberList from '@/components/admin/SubscriberList'
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
  const totalEvents = allEvents.length
  const upcomingEvents = allEvents.filter(
    (e) => new Date(e.start_date) > now && e.is_active
  ).length
  const activeEvents = allEvents.filter(e => e.is_active).length

  const totalBookingsResult = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
  const totalBookings = totalBookingsResult.count || 0

  // Fetch subscriber count (gracefully handle if table doesn't exist)
  let totalSubscribers = 0
  try {
    const subscriberCountResult = await supabase
      .from('email_subscribers')
      .select('id', { count: 'exact', head: true })
    totalSubscribers = subscriberCountResult.count || 0
  } catch {
    // Table may not exist yet - that's fine
    totalSubscribers = 0
  }

  // Get first name for greeting
  const firstName = profile.full_name?.split(' ')[0] || 'Admin'

  return (
    <main className="pt-[72px] min-h-screen bg-secondary">
      <div className="container pt-12 pb-20">

        {/* Header */}
        <div className="mb-12">
          <p className="text-[0.6875rem] font-semibold tracking-[0.15em] uppercase text-accent mb-2">
            Admin Dashboard
          </p>
          <h1 className="text-[clamp(1.75rem,4vw,2.25rem)] font-semibold tracking-[-0.02em] text-foreground mb-2">
            Welcome back, {firstName}
          </h1>
          <p className="text-muted text-base">
            Manage your events, training sessions, and bookings.
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-5 mb-12">
          <StatCard
            value={totalEvents}
            label="Total Events"
            color="var(--accent)"
          />
          <StatCard
            value={upcomingEvents}
            label="Upcoming"
            color="#059669"
          />
          <StatCard
            value={activeEvents}
            label="Active"
            color="#0891b2"
          />
          <StatCard
            value={totalBookings}
            label="Bookings"
            color="#7c3aed"
          />
          <StatCard
            value={totalSubscribers}
            label="Subscribers"
            color="#d97706"
          />
        </div>

        {/* Events Management */}
        <EventList events={allEvents} />

        {/* Email Subscribers Management */}
        <SubscriberList />
      </div>
    </main>
  )
}

function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div className="bg-background rounded-2xl border border-border p-6 flex items-center gap-4">
      <div
        className="w-12 h-12 rounded-xl flex items-center justify-center"
        style={{ background: `${color}10` }}
      >
        <span
          className="text-xl font-bold"
          style={{ color: color }}
        >
          {value}
        </span>
      </div>
      <span className="text-[0.9375rem] text-muted font-medium">
        {label}
      </span>
    </div>
  )
}
