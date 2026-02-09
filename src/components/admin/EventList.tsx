'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import EventForm from '@/components/admin/EventForm'
import type { Event } from '@/lib/types'

interface EventListProps {
  events: Event[]
}

const eventTypeStyles: Record<string, { bg: string; color: string }> = {
  camp: { bg: '#EFF6FF', color: '#2563EB' },
  clinic: { bg: '#F0FDF4', color: '#16A34A' },
  tournament: { bg: '#FAF5FF', color: '#9333EA' },
  training: { bg: '#ECFEFF', color: '#0891B2' },
  scrimmage: { bg: '#FFF7ED', color: '#EA580C' },
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

function formatPrice(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents)
}

export default function EventList({ events }: EventListProps) {
  const router = useRouter()
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [loadingId, setLoadingId] = useState<string | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  function handleCreateNew() {
    setEditingEvent(null)
    setIsFormOpen(true)
  }

  function handleEdit(event: Event) {
    setEditingEvent(event)
    setIsFormOpen(true)
  }

  function handleCloseForm() {
    setEditingEvent(null)
    setIsFormOpen(false)
  }

  async function handleToggleActive(event: Event) {
    setLoadingId(event.id)
    try {
      const response = await fetch('/api/admin/events', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: event.id, is_active: !event.is_active }),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to update event status')
      }

      router.refresh()
    } catch (err) {
      console.error('Failed to toggle event status:', err)
    } finally {
      setLoadingId(null)
    }
  }

  async function handleDelete(eventId: string) {
    setLoadingId(eventId)
    try {
      const response = await fetch('/api/admin/events?id=' + eventId, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to delete event')
      }

      setDeleteConfirmId(null)
      router.refresh()
    } catch (err) {
      console.error('Failed to delete event:', err)
    } finally {
      setLoadingId(null)
    }
  }

  // Separate upcoming and past events
  const now = new Date()
  const upcomingEvents = events.filter(e => new Date(e.start_date) >= now)
  const pastEvents = events.filter(e => new Date(e.start_date) < now)

  return (
    <>
      {/* Section Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '24px'
      }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 600,
          color: 'var(--foreground)',
          letterSpacing: '-0.01em'
        }}>
          Events
        </h2>
        <button
          onClick={handleCreateNew}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '12px 24px',
            fontSize: '0.9375rem',
            fontWeight: 500,
            borderRadius: '9999px',
            border: 'none',
            cursor: 'pointer',
            background: 'var(--foreground)',
            color: 'var(--background)',
            transition: 'all 0.2s ease'
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
          New Event
        </button>
      </div>

      {/* Events List */}
      {events.length === 0 ? (
        <div style={{
          background: 'var(--background)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          padding: '64px 24px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'var(--background-secondary)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px'
          }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="16" y1="2" x2="16" y2="6"></line>
              <line x1="8" y1="2" x2="8" y2="6"></line>
              <line x1="3" y1="10" x2="21" y2="10"></line>
            </svg>
          </div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: 'var(--foreground)', marginBottom: '8px' }}>
            No events yet
          </h3>
          <p style={{ color: 'var(--foreground-muted)', marginBottom: '24px' }}>
            Create your first event to get started.
          </p>
          <button
            onClick={handleCreateNew}
            style={{
              padding: '12px 24px',
              fontSize: '0.9375rem',
              fontWeight: 500,
              borderRadius: '9999px',
              border: 'none',
              cursor: 'pointer',
              background: 'var(--accent)',
              color: 'white'
            }}
          >
            Create Event
          </button>
        </div>
      ) : (
        <div style={{
          background: 'var(--background)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
          overflow: 'hidden'
        }}>
          {/* Upcoming Events */}
          {upcomingEvents.length > 0 && (
            <>
              <div style={{
                padding: '16px 24px',
                background: 'var(--background-secondary)',
                borderBottom: '1px solid var(--border)',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--foreground-muted)'
              }}>
                Upcoming ({upcomingEvents.length})
              </div>
              {upcomingEvents.map((event, idx) => (
                <EventRow
                  key={event.id}
                  event={event}
                  isLast={idx === upcomingEvents.length - 1 && pastEvents.length === 0}
                  loadingId={loadingId}
                  deleteConfirmId={deleteConfirmId}
                  onEdit={handleEdit}
                  onToggleActive={handleToggleActive}
                  onDelete={handleDelete}
                  setDeleteConfirmId={setDeleteConfirmId}
                />
              ))}
            </>
          )}

          {/* Past Events */}
          {pastEvents.length > 0 && (
            <>
              <div style={{
                padding: '16px 24px',
                background: 'var(--background-secondary)',
                borderBottom: '1px solid var(--border)',
                borderTop: upcomingEvents.length > 0 ? '1px solid var(--border)' : 'none',
                fontSize: '0.75rem',
                fontWeight: 600,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--foreground-muted)'
              }}>
                Past ({pastEvents.length})
              </div>
              {pastEvents.map((event, idx) => (
                <EventRow
                  key={event.id}
                  event={event}
                  isLast={idx === pastEvents.length - 1}
                  isPast
                  loadingId={loadingId}
                  deleteConfirmId={deleteConfirmId}
                  onEdit={handleEdit}
                  onToggleActive={handleToggleActive}
                  onDelete={handleDelete}
                  setDeleteConfirmId={setDeleteConfirmId}
                />
              ))}
            </>
          )}
        </div>
      )}

      {/* Event Form Modal */}
      <EventForm
        event={editingEvent}
        isOpen={isFormOpen}
        onClose={handleCloseForm}
      />
    </>
  )
}

interface EventRowProps {
  event: Event
  isLast?: boolean
  isPast?: boolean
  loadingId: string | null
  deleteConfirmId: string | null
  onEdit: (event: Event) => void
  onToggleActive: (event: Event) => void
  onDelete: (id: string) => void
  setDeleteConfirmId: (id: string | null) => void
}

function EventRow({
  event,
  isLast,
  isPast,
  loadingId,
  deleteConfirmId,
  onEdit,
  onToggleActive,
  onDelete,
  setDeleteConfirmId
}: EventRowProps) {
  const typeStyle = eventTypeStyles[event.event_type] || { bg: '#F3F4F6', color: '#6B7280' }
  const isLoading = loadingId === event.id
  const isDeleting = deleteConfirmId === event.id

  return (
    <div style={{
      padding: '20px 24px',
      borderBottom: isLast ? 'none' : '1px solid var(--border)',
      opacity: isPast ? 0.6 : 1,
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      {/* Main Row */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        gap: '16px',
        flexWrap: 'wrap'
      }}>
        {/* Event Info */}
        <div style={{ flex: 1, minWidth: '240px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <h3 style={{
              fontSize: '1rem',
              fontWeight: 600,
              color: 'var(--foreground)',
              margin: 0
            }}>
              {event.title}
            </h3>
            <span style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.6875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.03em',
              background: typeStyle.bg,
              color: typeStyle.color
            }}>
              {event.event_type}
            </span>
            <span style={{
              padding: '4px 10px',
              borderRadius: '9999px',
              fontSize: '0.6875rem',
              fontWeight: 600,
              background: event.is_active ? '#D1FAE5' : '#FEE2E2',
              color: event.is_active ? '#059669' : '#DC2626'
            }}>
              {event.is_active ? 'Active' : 'Inactive'}
            </span>
          </div>

          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            fontSize: '0.875rem',
            color: 'var(--foreground-muted)',
            flexWrap: 'wrap'
          }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                <line x1="16" y1="2" x2="16" y2="6"></line>
                <line x1="8" y1="2" x2="8" y2="6"></line>
                <line x1="3" y1="10" x2="21" y2="10"></line>
              </svg>
              {formatDate(event.start_date)}
              {event.start_date !== event.end_date && ` - ${formatDate(event.end_date)}`}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              {event.location}
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
              </svg>
              {event.current_participants}/{event.max_participants}
            </span>
            <span style={{ fontWeight: 600, color: 'var(--foreground)' }}>
              {formatPrice(event.price)}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {isDeleting ? (
            <>
              <button
                onClick={() => onDelete(event.id)}
                disabled={isLoading}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  background: '#DC2626',
                  color: 'white',
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                {isLoading ? 'Deleting...' : 'Confirm Delete'}
              </button>
              <button
                onClick={() => setDeleteConfirmId(null)}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: 'transparent',
                  color: 'var(--foreground-muted)'
                }}
              >
                Cancel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => onEdit(event)}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  borderRadius: '8px',
                  border: '1px solid var(--border)',
                  cursor: 'pointer',
                  background: 'transparent',
                  color: 'var(--foreground)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                </svg>
                Edit
              </button>
              <button
                onClick={() => onToggleActive(event)}
                disabled={isLoading}
                style={{
                  padding: '8px 16px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  borderRadius: '8px',
                  border: 'none',
                  cursor: isLoading ? 'not-allowed' : 'pointer',
                  background: event.is_active ? '#FEF3C7' : '#D1FAE5',
                  color: event.is_active ? '#B45309' : '#059669',
                  opacity: isLoading ? 0.5 : 1
                }}
              >
                {isLoading ? '...' : event.is_active ? 'Deactivate' : 'Activate'}
              </button>
              <button
                onClick={() => setDeleteConfirmId(event.id)}
                style={{
                  padding: '8px 12px',
                  fontSize: '0.8125rem',
                  fontWeight: 500,
                  borderRadius: '8px',
                  border: '1px solid #FEE2E2',
                  cursor: 'pointer',
                  background: '#FEF2F2',
                  color: '#DC2626',
                  display: 'flex',
                  alignItems: 'center'
                }}
                title="Delete event"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"></polyline>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
