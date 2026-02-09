import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import EventList from '@/components/admin/EventList'
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

  // Get first name for greeting
  const firstName = profile.full_name?.split(' ')[0] || 'Admin'

  return (
    <main style={{ paddingTop: '72px', minHeight: '100vh', background: 'var(--background-secondary)' }}>
      <div className="container" style={{ paddingTop: '48px', paddingBottom: '80px' }}>

        {/* Header */}
        <div style={{ marginBottom: '48px' }}>
          <p style={{
            fontSize: '0.6875rem',
            fontWeight: 600,
            letterSpacing: '0.15em',
            textTransform: 'uppercase',
            color: 'var(--accent)',
            marginBottom: '8px'
          }}>
            Admin Dashboard
          </p>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 2.25rem)',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            color: 'var(--foreground)',
            marginBottom: '8px'
          }}>
            Welcome back, {firstName}
          </h1>
          <p style={{ color: 'var(--foreground-muted)', fontSize: '1rem' }}>
            Manage your events, training sessions, and bookings.
          </p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '48px'
        }}>
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
        </div>

        {/* Events Management */}
        <EventList events={allEvents} />
      </div>
    </main>
  )
}

function StatCard({ value, label, color }: { value: number; label: string; color: string }) {
  return (
    <div style={{
      background: 'var(--background)',
      borderRadius: '16px',
      border: '1px solid var(--border)',
      padding: '24px',
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      <div style={{
        width: '48px',
        height: '48px',
        borderRadius: '12px',
        background: `${color}10`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <span style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: color
        }}>
          {value}
        </span>
      </div>
      <span style={{
        fontSize: '0.9375rem',
        color: 'var(--foreground-muted)',
        fontWeight: 500
      }}>
        {label}
      </span>
    </div>
  )
}
