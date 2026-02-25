import Link from 'next/link'
import { Calendar, MapPin, Users } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'
import { formatPrice } from '@/lib/stripe'
import { createClient } from '@/lib/supabase/server'

interface EventData {
  id: string
  title: string
  description: string
  event_type: string
  start_date: string
  end_date: string
  location: string
  address?: string
  max_participants: number
  current_participants: number
  price: number
  member_price?: number
  skill_levels: string[]
  age_groups: string[]
  is_active?: boolean
}

async function getEvents(): Promise<EventData[] | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .eq('is_active', true)
      .gte('start_date', new Date().toISOString())
      .order('start_date', { ascending: true })

    if (error || !data || data.length === 0) {
      return null
    }
    return data
  } catch {
    return null
  }
}

const eventTypeColors: Record<string, string> = {
  camp: 'bg-blue-100 text-blue-700',
  clinic: 'bg-green-100 text-green-700',
  tournament: 'bg-purple-100 text-purple-700',
  training: 'bg-cyan-100 text-cyan-700',
  scrimmage: 'bg-orange-100 text-orange-700',
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default async function EventsPage() {
  const events = await getEvents()

  return (
    <main style={{ paddingTop: '72px', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
        color: 'white',
        padding: '64px 24px 80px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 4vw, 3rem)',
            fontWeight: 700,
            marginBottom: '16px',
            letterSpacing: '-0.025em',
            color: 'white',
          }}>
            Upcoming Events
          </h1>
          <p style={{
            fontSize: '1.125rem',
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '600px',
            margin: '0 auto',
          }}>
            Browse and book our training sessions, camps, clinics, and tournaments.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section style={{ padding: '64px 24px', minHeight: '50vh' }}>
        <div style={{ maxWidth: '1280px', margin: '0 auto' }}>
          {!events || events.length === 0 ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              padding: '80px 16px',
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '16px',
                background: '#f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '24px',
              }}>
                <Calendar style={{ width: '40px', height: '40px', color: '#9ca3af' }} />
              </div>
              <h2 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: '#111827',
                marginBottom: '12px',
              }}>
                No Upcoming Events
              </h2>
              <p style={{
                color: '#6b7280',
                marginBottom: '32px',
                maxWidth: '420px',
                fontSize: '1rem',
              }}>
                Check back soon — new training sessions, camps, and clinics are added regularly.
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', justifyContent: 'center' }}>
                <Link href="/get-started/sessions">
                  <Button>View Training Sessions</Button>
                </Link>
                <Link href="/contact">
                  <Button variant="outline">Contact Us</Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <Card key={event.id} hover className="overflow-hidden">
                  <div className="h-44 bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                    <Calendar className="w-14 h-14 text-primary/30" />
                  </div>
                  <CardContent>
                    <div className="flex items-center justify-between mb-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${eventTypeColors[event.event_type] || 'bg-gray-100 text-gray-700'}`}>
                        {event.event_type}
                      </span>
                      <span className="text-sm text-muted">
                        {event.current_participants}/{event.max_participants} spots
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{event.title}</h3>
                    <p className="text-muted text-sm mb-4 line-clamp-2">{event.description}</p>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-muted">
                        <Calendar className="w-4 h-4 mr-2 flex-shrink-0" />
                        {formatDate(event.start_date)}
                        {event.start_date !== event.end_date && ` - ${formatDate(event.end_date)}`}
                      </div>
                      <div className="flex items-center text-sm text-muted">
                        <MapPin className="w-4 h-4 mr-2 flex-shrink-0" />
                        {event.location}
                      </div>
                      {event.age_groups && event.age_groups.length > 0 && (
                        <div className="flex items-center text-sm text-muted">
                          <Users className="w-4 h-4 mr-2 flex-shrink-0" />
                          Ages {event.age_groups.join(', ')}
                        </div>
                      )}
                    </div>

                    {event.skill_levels && event.skill_levels.length > 0 && (
                      <div className="flex flex-wrap gap-1 mb-4">
                        {event.skill_levels.map((level) => (
                          <span key={level} className="px-2 py-1 bg-gray-100 rounded text-xs text-muted capitalize">
                            {level}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div>
                        <p className="text-2xl font-bold text-primary">{formatPrice(event.price)}</p>
                        {event.member_price !== undefined && event.member_price < event.price && (
                          <p className="text-sm text-green-600">{formatPrice(event.member_price)} for members</p>
                        )}
                      </div>
                      <Link href={`/events/${event.id}/book`}>
                        <Button size="sm">Book Now</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section — only show when there are events */}
      {events && events.length > 0 && (
        <section style={{ padding: '64px 24px', background: 'white', textAlign: 'center' }}>
          <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#111827', marginBottom: '16px' }}>
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p style={{ fontSize: '1.125rem', color: '#6b7280', marginBottom: '32px' }}>
              Contact us to learn about private coaching, team training, or custom events.
            </p>
            <Link href="/contact">
              <Button size="lg">Contact Us</Button>
            </Link>
          </div>
        </section>
      )}
    </main>
  )
}
