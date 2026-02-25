import Link from 'next/link'
import { redirect } from 'next/navigation'
import { ArrowLeft, Calendar, MapPin, Clock, Plus, RefreshCw } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'

export const dynamic = 'force-dynamic'

const statusStyles: Record<string, string> = {
  confirmed: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  cancelled: 'bg-red-100 text-red-700',
  attended: 'bg-blue-100 text-blue-700',
}

export default async function BookingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/dashboard/bookings')
  }

  // Fetch upcoming bookings
  const { data: upcomingBookings } = await supabase
    .from('bookings')
    .select(`*, events (*)`)
    .eq('user_id', user.id)
    .in('status', ['confirmed', 'pending'])
    .order('created_at', { ascending: false })

  // Fetch past bookings
  const { data: pastBookings } = await supabase
    .from('bookings')
    .select(`*, events (*)`)
    .eq('user_id', user.id)
    .in('status', ['attended', 'cancelled'])
    .order('created_at', { ascending: false })

  type BookingRow = { id: string; status: string; events: unknown; [key: string]: unknown }
  const upcoming: BookingRow[] = upcomingBookings || []
  const past: BookingRow[] = pastBookings || []
  const hasBookings = upcoming.length > 0 || past.length > 0

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/dashboard" className="inline-flex items-center text-muted hover:text-primary transition-colors mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">My Bookings</h1>
              <p className="text-muted mt-1">Manage your upcoming and past event bookings.</p>
            </div>
            <Link href="/events">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Book Event
              </Button>
            </Link>
          </div>
        </div>

        {!hasBookings ? (
          <Card>
            <CardContent className="text-center py-16">
              <Calendar className="w-16 h-16 text-muted mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-foreground mb-2">No bookings yet</h2>
              <p className="text-muted mb-6">You haven&apos;t booked any events. Browse our upcoming events to get started.</p>
              <Link href="/events">
                <Button size="lg">Browse Events</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-10">
            {/* Upcoming Events */}
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                  {upcoming.map((booking) => {
                    const evt = booking.events as unknown as {
                      id: string; title: string; start_date: string;
                      end_date: string; location: string; event_type: string
                    } | null
                    if (!evt) return null
                    return (
                      <Card key={booking.id}>
                        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-1.5 h-full min-h-[60px] rounded-full bg-primary flex-shrink-0 hidden sm:block" />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{evt.title}</h3>
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                                  {booking.status}
                                </span>
                              </div>
                              <div className="space-y-1 text-sm text-muted">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {new Date(evt.start_date).toLocaleDateString('en-US', {
                                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                                  })}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2" />
                                  {new Date(evt.start_date).toLocaleTimeString('en-US', {
                                    hour: 'numeric', minute: '2-digit'
                                  })}
                                  {evt.end_date && (
                                    <>
                                      {' \u2014 '}
                                      {new Date(evt.end_date).toLocaleTimeString('en-US', {
                                        hour: 'numeric', minute: '2-digit'
                                      })}
                                    </>
                                  )}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  {evt.location}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Past Events */}
            {past.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold text-foreground mb-4">Past Events</h2>
                <div className="space-y-4">
                  {past.map((booking) => {
                    const evt = booking.events as unknown as {
                      id: string; title: string; start_date: string;
                      end_date: string; location: string; event_type: string
                    } | null
                    if (!evt) return null
                    return (
                      <Card key={booking.id} className="opacity-75">
                        <CardContent className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <div className="flex items-start gap-4">
                            <div className="w-1.5 h-full min-h-[60px] rounded-full bg-gray-300 flex-shrink-0 hidden sm:block" />
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-semibold text-foreground">{evt.title}</h3>
                                <span className={`inline-flex px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${statusStyles[booking.status] || 'bg-gray-100 text-gray-700'}`}>
                                  {booking.status}
                                </span>
                              </div>
                              <div className="space-y-1 text-sm text-muted">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-2" />
                                  {new Date(evt.start_date).toLocaleDateString('en-US', {
                                    weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'
                                  })}
                                </div>
                                <div className="flex items-center">
                                  <MapPin className="w-4 h-4 mr-2" />
                                  {evt.location}
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Link href="/events">
                              <Button variant="outline" size="sm">
                                <RefreshCw className="w-4 h-4 mr-1" />
                                Book Again
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
