'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { startOfWeek, endOfWeek, addWeeks, addDays, format, isSameDay, isToday } from 'date-fns'

interface CalendarEvent {
  id: string
  title: string
  event_type: string
  start_date: string
  end_date: string
  location: string
  price: number
  member_price?: number
  max_participants: number
  current_participants: number
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(cents)
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export default function WeeklyCalendarBar() {
  const [weekOffset, setWeekOffset] = useState(0)
  const [events, setEvents] = useState<CalendarEvent[]>([])
  const [loading, setLoading] = useState(true)

  const weekStart = startOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 })
  const weekEnd = endOfWeek(addWeeks(new Date(), weekOffset), { weekStartsOn: 1 })

  useEffect(() => {
    async function fetchWeekEvents() {
      setLoading(true)
      try {
        const res = await fetch(
          `/api/events/week?start=${weekStart.toISOString()}&end=${weekEnd.toISOString()}`
        )
        const data = await res.json()
        setEvents(data.events || [])
      } catch {
        setEvents([])
      } finally {
        setLoading(false)
      }
    }
    fetchWeekEvents()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [weekOffset])

  function getEventsForDay(dayIndex: number): CalendarEvent[] {
    const date = addDays(weekStart, dayIndex)
    return events.filter(e => isSameDay(new Date(e.start_date), date))
  }

  return (
    <section
      style={{
        padding: '64px 0',
        borderBottom: '1px solid var(--border)',
        background: 'white',
      }}
    >
      <div className="container">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
              marginBottom: '32px',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
                gap: '16px',
              }}
            >
              <div>
                <span
                  style={{
                    display: 'block',
                    fontSize: '0.6875rem',
                    fontWeight: 600,
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: 'var(--accent)',
                    marginBottom: '8px',
                  }}
                >
                  Training Schedule
                </span>
                <h2
                  style={{
                    fontSize: 'clamp(1.5rem, 3vw, 2rem)',
                    fontWeight: 600,
                    letterSpacing: '-0.02em',
                    color: 'var(--foreground)',
                    margin: 0,
                  }}
                >
                  {format(weekStart, 'MMM d')} &ndash; {format(weekEnd, 'MMM d, yyyy')}
                </h2>
              </div>

              {/* Week navigation */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <button
                  onClick={() => setWeekOffset(prev => prev - 1)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--foreground-secondary)',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  aria-label="Previous week"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                {weekOffset !== 0 && (
                  <button
                    onClick={() => setWeekOffset(0)}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '9999px',
                      fontSize: '0.75rem',
                      fontWeight: 500,
                      border: '1px solid var(--border)',
                      color: 'var(--foreground-secondary)',
                      background: 'transparent',
                      cursor: 'pointer',
                    }}
                  >
                    This Week
                  </button>
                )}
                <button
                  onClick={() => setWeekOffset(prev => prev + 1)}
                  style={{
                    width: '36px',
                    height: '36px',
                    borderRadius: '50%',
                    border: '1px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--foreground-secondary)',
                    background: 'transparent',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s, color 0.2s',
                  }}
                  aria-label="Next week"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Calendar grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Desktop: 7-column grid */}
          <div
            style={{
              display: 'none',
            }}
            className="md:!grid"
          >
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '12px',
              }}
            >
              {DAYS.map((day, index) => {
                const date = addDays(weekStart, index)
                const dayEvents = getEventsForDay(index)
                const isCurrentDay = isToday(date)
                const spotsAvailable = (e: CalendarEvent) => e.max_participants - e.current_participants

                return (
                  <div
                    key={day}
                    style={{
                      minHeight: '180px',
                      borderRadius: '12px',
                      padding: '14px',
                      background: isCurrentDay ? 'rgba(37, 99, 235, 0.04)' : '#F8F9FA',
                      border: isCurrentDay ? '2px solid rgba(37, 99, 235, 0.2)' : '1px solid var(--border)',
                      display: 'flex',
                      flexDirection: 'column',
                    }}
                  >
                    {/* Day header */}
                    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                      <span
                        style={{
                          display: 'block',
                          fontSize: '0.6875rem',
                          fontWeight: 500,
                          textTransform: 'uppercase',
                          letterSpacing: '0.08em',
                          color: isCurrentDay ? 'var(--accent)' : 'var(--foreground-muted)',
                        }}
                      >
                        {day}
                      </span>
                      <div
                        style={{
                          fontSize: '1.25rem',
                          fontWeight: 600,
                          marginTop: '2px',
                          color: isCurrentDay ? 'var(--accent)' : 'var(--foreground)',
                        }}
                      >
                        {format(date, 'd')}
                      </div>
                    </div>

                    {/* Events */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                      {dayEvents.map(event => (
                        <div
                          key={event.id}
                          style={{
                            background: 'white',
                            borderRadius: '10px',
                            padding: '10px 12px',
                            border: '1px solid var(--border)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                          }}
                        >
                          <p
                            style={{
                              fontSize: '0.75rem',
                              fontWeight: 600,
                              color: 'var(--foreground)',
                              lineHeight: 1.3,
                              marginBottom: '4px',
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {event.title}
                          </p>
                          <p
                            style={{
                              fontSize: '0.6875rem',
                              color: 'var(--foreground-muted)',
                              marginBottom: '2px',
                            }}
                          >
                            {format(new Date(event.start_date), 'h:mm a')}
                          </p>
                          {event.location && (
                            <p
                              style={{
                                fontSize: '0.625rem',
                                color: 'var(--foreground-muted)',
                                opacity: 0.7,
                                marginBottom: '8px',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {event.location}
                            </p>
                          )}
                          <div
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              gap: '4px',
                            }}
                          >
                            <span
                              style={{
                                fontSize: '0.75rem',
                                fontWeight: 600,
                                color: 'var(--accent)',
                              }}
                            >
                              {formatPrice(event.price)}
                            </span>
                            {spotsAvailable(event) > 0 ? (
                              <Link
                                href={`/events/${event.id}/book`}
                                style={{
                                  fontSize: '0.625rem',
                                  fontWeight: 600,
                                  background: 'var(--foreground)',
                                  color: 'white',
                                  padding: '4px 10px',
                                  borderRadius: '9999px',
                                  textDecoration: 'none',
                                  whiteSpace: 'nowrap',
                                  transition: 'opacity 0.2s',
                                }}
                              >
                                Register
                              </Link>
                            ) : (
                              <span style={{ fontSize: '0.625rem', fontWeight: 500, color: 'var(--foreground-muted)' }}>Full</span>
                            )}
                          </div>
                          {spotsAvailable(event) > 0 && spotsAvailable(event) <= 5 && (
                            <p style={{ fontSize: '0.5625rem', color: '#d97706', fontWeight: 500, marginTop: '4px' }}>
                              {spotsAvailable(event)} spot{spotsAvailable(event) !== 1 ? 's' : ''} left
                            </p>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Empty state */}
                    {dayEvents.length === 0 && !loading && (
                      <p style={{ fontSize: '0.6875rem', color: 'var(--foreground-muted)', opacity: 0.4, textAlign: 'center', marginTop: 'auto', paddingTop: '24px' }}>
                        &mdash;
                      </p>
                    )}

                    {/* Loading skeleton */}
                    {loading && (
                      <div style={{ flex: 1 }}>
                        <div style={{ background: 'var(--border)', opacity: 0.3, borderRadius: '10px', height: '60px' }} className="animate-pulse" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Mobile: Stacked list view */}
          <div className="md:!hidden" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {DAYS.map((day, index) => {
              const date = addDays(weekStart, index)
              const dayEvents = getEventsForDay(index)
              const isCurrentDay = isToday(date)

              if (dayEvents.length === 0 && !loading) return null

              return (
                <div
                  key={day}
                  style={{
                    borderRadius: '12px',
                    padding: '16px',
                    background: isCurrentDay ? 'rgba(37, 99, 235, 0.04)' : '#F8F9FA',
                    border: isCurrentDay ? '2px solid rgba(37, 99, 235, 0.2)' : '1px solid var(--border)',
                  }}
                >
                  {/* Day header */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                    <div
                      style={{
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: isCurrentDay ? 'var(--accent)' : 'var(--foreground)',
                      }}
                    >
                      {format(date, 'd')}
                    </div>
                    <div>
                      <span
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: 500,
                          color: isCurrentDay ? 'var(--accent)' : 'var(--foreground)',
                        }}
                      >
                        {format(date, 'EEEE')}
                      </span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)', marginLeft: '8px' }}>
                        {format(date, 'MMM')}
                      </span>
                    </div>
                    {isCurrentDay && (
                      <span
                        style={{
                          fontSize: '0.625rem',
                          fontWeight: 600,
                          color: 'var(--accent)',
                          background: 'rgba(37, 99, 235, 0.1)',
                          padding: '2px 8px',
                          borderRadius: '9999px',
                          marginLeft: 'auto',
                        }}
                      >
                        Today
                      </span>
                    )}
                  </div>

                  {/* Events */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {dayEvents.map(event => {
                      const spots = event.max_participants - event.current_participants
                      return (
                        <div
                          key={event.id}
                          style={{
                            background: 'white',
                            borderRadius: '10px',
                            padding: '12px 14px',
                            border: '1px solid var(--border)',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                          }}
                        >
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <p
                              style={{
                                fontSize: '0.875rem',
                                fontWeight: 600,
                                color: 'var(--foreground)',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {event.title}
                            </p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)' }}>
                              {format(new Date(event.start_date), 'h:mm a')}
                              {event.location && ` \u00b7 ${event.location}`}
                            </p>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                            <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--accent)' }}>
                              {formatPrice(event.price)}
                            </span>
                            {spots > 0 ? (
                              <Link
                                href={`/events/${event.id}/book`}
                                style={{
                                  fontSize: '0.75rem',
                                  fontWeight: 600,
                                  background: 'var(--foreground)',
                                  color: 'white',
                                  padding: '8px 16px',
                                  borderRadius: '9999px',
                                  textDecoration: 'none',
                                  whiteSpace: 'nowrap',
                                }}
                              >
                                Register
                              </Link>
                            ) : (
                              <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--foreground-muted)', padding: '8px 12px' }}>Full</span>
                            )}
                          </div>
                        </div>
                      )
                    })}
                  </div>

                  {/* Loading */}
                  {loading && (
                    <div style={{ background: 'var(--border)', opacity: 0.3, borderRadius: '10px', height: '56px' }} className="animate-pulse" />
                  )}
                </div>
              )
            })}

            {/* Mobile: Show message when all days empty */}
            {!loading && events.length === 0 && (
              <div style={{ textAlign: 'center', padding: '32px 0' }}>
                <p style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem' }}>No sessions scheduled this week.</p>
                <button
                  onClick={() => setWeekOffset(prev => prev + 1)}
                  style={{
                    color: 'var(--accent)',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    marginTop: '8px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Check next week &rarr;
                </button>
              </div>
            )}
          </div>

          {/* Desktop: Empty week message */}
          {!loading && events.length === 0 && (
            <div className="hidden md:!block" style={{ textAlign: 'center', padding: '16px 0', marginTop: '16px' }}>
              <p style={{ color: 'var(--foreground-muted)', fontSize: '0.875rem' }}>No sessions scheduled this week.</p>
              <button
                onClick={() => setWeekOffset(prev => prev + 1)}
                style={{
                  color: 'var(--accent)',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  marginTop: '8px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Check next week &rarr;
              </button>
            </div>
          )}
        </motion.div>
      </div>
    </section>
  )
}
