import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Calendar, CreditCard, User, Clock, ArrowRight, CheckCircle } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader } from '@/components/ui/Card'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/login?redirect=/dashboard')
  }

  // Mock data - in production would come from Supabase
  const upcomingBookings = [
    {
      id: '1',
      event_title: 'Weekly Training Session',
      date: '2025-03-08',
      time: '9:00 AM - 11:00 AM',
      location: 'CLA Training Center',
      status: 'confirmed',
    },
    {
      id: '2',
      event_title: 'Spring Training Camp',
      date: '2025-03-15',
      time: '8:00 AM - 5:00 PM',
      location: 'CLA Training Center',
      status: 'confirmed',
    },
  ]

  const membership = {
    plan: 'Monthly Membership',
    status: 'active',
    next_billing: '2025-04-01',
    price: '$99/month',
  }

  return (
    <div className="min-h-screen bg-secondary py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {user.user_metadata?.full_name || user.email?.split('@')[0]}!
          </h1>
          <p className="text-muted">Manage your bookings, membership, and account settings.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="flex items-center">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{upcomingBookings.length}</p>
                <p className="text-sm text-muted">Upcoming Events</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mr-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground capitalize">{membership.status}</p>
                <p className="text-sm text-muted">Membership</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mr-4">
                <Clock className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">12</p>
                <p className="text-sm text-muted">Sessions Attended</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="flex items-center">
              <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center mr-4">
                <CreditCard className="w-6 h-6 text-cyan-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{membership.price}</p>
                <p className="text-sm text-muted">Current Plan</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Upcoming Events */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Upcoming Events</h2>
                <Link href="/dashboard/bookings">
                  <Button variant="ghost" size="sm">
                    View All
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                </Link>
              </CardHeader>
              <CardContent>
                {upcomingBookings.length > 0 ? (
                  <div className="space-y-4">
                    {upcomingBookings.map((booking) => (
                      <div key={booking.id} className="flex items-center justify-between p-4 bg-secondary rounded-xl">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mr-4">
                            <Calendar className="w-6 h-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-foreground">{booking.event_title}</h3>
                            <p className="text-sm text-muted">{booking.date} | {booking.time}</p>
                            <p className="text-sm text-muted">{booking.location}</p>
                          </div>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Calendar className="w-12 h-12 text-muted mx-auto mb-4" />
                    <p className="text-muted mb-4">No upcoming events</p>
                    <Link href="/events">
                      <Button>Browse Events</Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Membership Card */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-foreground">Membership</h2>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Plan</span>
                    <span className="font-medium text-foreground">{membership.plan}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Status</span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium capitalize">
                      {membership.status}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-muted">Next Billing</span>
                    <span className="font-medium text-foreground">{membership.next_billing}</span>
                  </div>
                  <hr className="border-border" />
                  <Link href="/dashboard/membership">
                    <Button variant="outline" className="w-full">
                      Manage Membership
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <h2 className="text-xl font-semibold text-foreground">Quick Actions</h2>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/events" className="block">
                  <Button variant="secondary" className="w-full justify-start">
                    <Calendar className="w-5 h-5 mr-3" />
                    Book an Event
                  </Button>
                </Link>
                <Link href="/dashboard/profile" className="block">
                  <Button variant="secondary" className="w-full justify-start">
                    <User className="w-5 h-5 mr-3" />
                    Edit Profile
                  </Button>
                </Link>
                <Link href="/dashboard/billing" className="block">
                  <Button variant="secondary" className="w-full justify-start">
                    <CreditCard className="w-5 h-5 mr-3" />
                    Billing History
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Need Help */}
            <Card className="bg-gradient-to-br from-primary to-accent text-white">
              <CardContent>
                <h3 className="font-semibold text-lg mb-2">Need Help?</h3>
                <p className="text-cyan-100 text-sm mb-4">
                  Have questions about your account or upcoming events?
                </p>
                <Link href="/contact">
                  <Button className="w-full bg-white text-primary hover:bg-cyan-50">
                    Contact Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
