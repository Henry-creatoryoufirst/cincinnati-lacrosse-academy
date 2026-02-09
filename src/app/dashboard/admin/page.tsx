import { redirect } from 'next/navigation'
import { Calendar, Users, ClipboardList, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Card, { CardContent } from '@/components/ui/Card'
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
    .select('role')
    .eq('user_id', user.id)
    .single()

  if (!profile || profile.role !== 'admin') {
    redirect('/dashboard')
  }

  // Fetch all events (including inactive)
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .order('start_date', { ascending: false })

  const allEvents: Event[] = events || []

  // Calculate stats
  const totalEvents = allEvents.length
  const upcomingEvents = allEvents.filter(
    (e) => new Date(e.start_date) > new Date() && e.is_active
  ).length
  const totalBookingsResult = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
  const totalBookings = totalBookingsResult.count || 0

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
              <p className="text-muted">Manage events, bookings, and site content.</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalEvents}</p>
                <p className="text-sm text-muted">Total Events</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcomingEvents}</p>
                <p className="text-sm text-muted">Upcoming Events</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <ClipboardList className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{totalBookings}</p>
                <p className="text-sm text-muted">Total Bookings</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Events Management */}
        <EventList events={allEvents} />
      </div>
    </div>
  )
}
