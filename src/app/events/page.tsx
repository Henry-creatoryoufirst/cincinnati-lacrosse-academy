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
    <main className="min-h-screen bg-secondary pt-[72px]">
      {/* Hero Section */}
      <section
        className="relative overflow-hidden text-center"
        style={{
          background: 'linear-gradient(180deg, #111827 0%, #0a0a0b 100%)',
          padding: '64px 24px 80px',
        }}
      >
        {/* Subtle radial glow */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '600px',
            height: '600px',
            background: 'radial-gradient(circle, rgba(37, 99, 235, 0.08) 0%, transparent 60%)',
          }}
        />

        <div className="relative z-10 mx-auto max-w-5xl">
          <div
            className="mx-auto mb-7"
            style={{
              width: '48px',
              height: '2px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            }}
          />

          <h1
            className="mb-4 font-bold tracking-tight"
            style={{
              fontSize: 'clamp(2.25rem, 4vw, 3.25rem)',
              letterSpacing: '-0.02em',
              lineHeight: 1.1,
              background: 'linear-gradient(180deg, #ffffff 0%, rgba(255,255,255,0.85) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Upcoming Events
          </h1>

          <p
            className="mx-auto max-w-xl text-lg font-normal"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Browse and book our training sessions, camps, clinics, and tournaments.
          </p>
        </div>
      </section>

      {/* Events Grid */}
      <section className="min-h-[50vh] px-6 py-16">
        <div className="mx-auto max-w-7xl">
          {!events || events.length === 0 ? (
            <div className="flex items-center justify-center px-4 py-20">
              <div className="w-full max-w-md rounded-2xl border border-border bg-white p-10 text-center shadow-sm">
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-secondary">
                  <Calendar className="h-10 w-10 text-muted" />
                </div>

                <h2 className="mb-3 text-2xl font-bold text-foreground">
                  No Upcoming Events
                </h2>

                <p className="mx-auto mb-8 max-w-sm text-base text-muted">
                  Check back soon — new training sessions, camps, and clinics are added regularly.
                </p>

                <div className="flex flex-wrap items-center justify-center gap-3">
                  <Link href="/get-started/sessions">
                    <Button>View Training Sessions</Button>
                  </Link>
                  <Link href="/contact">
                    <Button variant="outline">Contact Us</Button>
                  </Link>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
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
        <section className="bg-white px-6 py-16 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-2xl font-bold text-foreground">
              Can&apos;t Find What You&apos;re Looking For?
            </h2>
            <p className="mb-8 text-lg text-muted">
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
