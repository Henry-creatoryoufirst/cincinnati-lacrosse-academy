'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, MapPin, Users, Pencil, Trash2, ToggleLeft, ToggleRight } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'
import EventForm from '@/components/admin/EventForm'
import type { Event } from '@/lib/types'

interface EventListProps {
  events: Event[]
}

const eventTypeColors: Record<string, string> = {
  camp: 'bg-blue-100 text-blue-700',
  clinic: 'bg-green-100 text-green-700',
  tournament: 'bg-purple-100 text-purple-700',
  training: 'bg-cyan-100 text-cyan-700',
  scrimmage: 'bg-orange-100 text-orange-700',
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

  return (
    <>
      {/* Create Button */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-foreground">All Events</h2>
        <Button onClick={handleCreateNew}>
          + Create New Event
        </Button>
      </div>

      {/* Event List */}
      {events.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Calendar className="w-12 h-12 text-muted mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">No Events Yet</h3>
            <p className="text-muted mb-6">Create your first event to get started.</p>
            <Button onClick={handleCreateNew}>Create New Event</Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {events.map((event) => (
            <Card key={event.id}>
              <CardContent>
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  {/* Event Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className="text-lg font-semibold text-foreground truncate">
                        {event.title}
                      </h3>
                      <span
                        className={
                          'px-3 py-1 rounded-full text-xs font-medium capitalize ' +
                          (eventTypeColors[event.event_type] || 'bg-gray-100 text-gray-700')
                        }
                      >
                        {event.event_type}
                      </span>
                      <span
                        className={
                          'px-3 py-1 rounded-full text-xs font-medium ' +
                          (event.is_active
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700')
                        }
                      >
                        {event.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-muted">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-1.5" />
                        {formatDate(event.start_date)}
                        {event.start_date !== event.end_date && ' - ' + formatDate(event.end_date)}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1.5" />
                        {event.location}
                      </div>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1.5" />
                        {event.current_participants}/{event.max_participants} participants
                      </div>
                      <div className="font-medium text-foreground">
                        {formatPrice(event.price)}
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEdit(event)}
                      title="Edit event"
                    >
                      <Pencil className="w-4 h-4 mr-1.5" />
                      Edit
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleToggleActive(event)}
                      disabled={loadingId === event.id}
                      title={event.is_active ? 'Deactivate event' : 'Activate event'}
                    >
                      {event.is_active ? (
                        <>
                          <ToggleRight className="w-4 h-4 mr-1.5 text-green-600" />
                          <span className="text-green-600">Active</span>
                        </>
                      ) : (
                        <>
                          <ToggleLeft className="w-4 h-4 mr-1.5 text-red-500" />
                          <span className="text-red-500">Inactive</span>
                        </>
                      )}
                    </Button>

                    {deleteConfirmId === event.id ? (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          disabled={loadingId === event.id}
                          className="text-red-600 hover:bg-red-50"
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeleteConfirmId(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteConfirmId(event.id)}
                        title="Delete event"
                        className="text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4 mr-1.5" />
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
