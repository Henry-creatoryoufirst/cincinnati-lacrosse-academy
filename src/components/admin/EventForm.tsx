'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
import { X } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import type { Event } from '@/lib/types'

interface EventFormProps {
  event?: Event | null
  isOpen: boolean
  onClose: () => void
}

interface EventFormData {
  title: string
  description: string
  event_type: 'training' | 'camp' | 'tournament' | 'clinic' | 'scrimmage'
  start_date: string
  end_date: string
  location: string
  address: string
  max_participants: number
  price: number
  member_price: number
  skill_levels: string[]
  age_groups: string[]
}

const SKILL_LEVEL_OPTIONS = ['beginner', 'intermediate', 'advanced', 'elite'] as const

const EVENT_TYPE_OPTIONS = [
  { value: 'training', label: 'Training' },
  { value: 'camp', label: 'Camp' },
  { value: 'tournament', label: 'Tournament' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'scrimmage', label: 'Scrimmage' },
] as const

const initialFormData: EventFormData = {
  title: '',
  description: '',
  event_type: 'training',
  start_date: '',
  end_date: '',
  location: '',
  address: '',
  max_participants: 30,
  price: 0,
  member_price: 0,
  skill_levels: [],
  age_groups: [],
}

function formatDateTimeLocal(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return ''
    const pad = (n: number) => n.toString().padStart(2, '0')
    return [
      date.getFullYear(),
      '-',
      pad(date.getMonth() + 1),
      '-',
      pad(date.getDate()),
      'T',
      pad(date.getHours()),
      ':',
      pad(date.getMinutes()),
    ].join('')
  } catch {
    return ''
  }
}

export default function EventForm({ event, isOpen, onClose }: EventFormProps) {
  const router = useRouter()
  const [formData, setFormData] = useState<EventFormData>(initialFormData)
  const [ageGroupInput, setAgeGroupInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isEditMode = !!event

  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title,
        description: event.description,
        event_type: event.event_type,
        start_date: formatDateTimeLocal(event.start_date),
        end_date: formatDateTimeLocal(event.end_date),
        location: event.location,
        address: event.address || '',
        max_participants: event.max_participants,
        price: event.price,
        member_price: event.member_price || 0,
        skill_levels: event.skill_levels || [],
        age_groups: event.age_groups || [],
      })
      setAgeGroupInput((event.age_groups || []).join(', '))
    } else {
      setFormData(initialFormData)
      setAgeGroupInput('')
    }
    setError(null)
  }, [event, isOpen])

  function handleInputChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value, type } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value,
    }))
  }

  function handleSkillLevelToggle(level: string) {
    setFormData((prev) => ({
      ...prev,
      skill_levels: prev.skill_levels.includes(level)
        ? prev.skill_levels.filter((l) => l !== level)
        : [...prev.skill_levels, level],
    }))
  }

  function handleAgeGroupChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setAgeGroupInput(value)
    const groups = value
      .split(',')
      .map((g) => g.trim())
      .filter(Boolean)
    setFormData((prev) => ({ ...prev, age_groups: groups }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const url = '/api/admin/events'
      const method = isEditMode ? 'PUT' : 'POST'
      const payload = isEditMode ? { id: event!.id, ...formData } : formData

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const data = await response.json().catch(() => ({}))
        throw new Error(data.error || 'Failed to ' + (isEditMode ? 'update' : 'create') + ' event')
      }

      onClose()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <h2 className="text-xl font-semibold text-foreground">
              {isEditMode ? 'Edit Event' : 'Create New Event'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
            >
              <X className="w-5 h-5 text-muted" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[70vh] overflow-y-auto">
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
                {error}
              </div>
            )}

            <Input
              id="title"
              name="title"
              label="Event Title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="e.g. Spring Training Camp"
              required
            />

            <div className="w-full">
              <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the event..."
                rows={3}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground placeholder-muted focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              />
            </div>

            <div className="w-full">
              <label htmlFor="event_type" className="block text-sm font-medium text-foreground mb-2">
                Event Type
              </label>
              <select
                id="event_type"
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 rounded-xl border border-border bg-white text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all duration-300"
              >
                {EVENT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Input
                id="start_date"
                name="start_date"
                label="Start Date & Time"
                type="datetime-local"
                value={formData.start_date}
                onChange={handleInputChange}
                required
              />
              <Input
                id="end_date"
                name="end_date"
                label="End Date & Time"
                type="datetime-local"
                value={formData.end_date}
                onChange={handleInputChange}
                required
              />
            </div>

            <Input
              id="location"
              name="location"
              label="Location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="e.g. CLA Training Center"
              required
            />

            <Input
              id="address"
              name="address"
              label="Address"
              value={formData.address}
              onChange={handleInputChange}
              placeholder="e.g. 123 Lacrosse Way, Cincinnati, OH"
            />

            <div className="grid grid-cols-3 gap-4">
              <Input
                id="max_participants"
                name="max_participants"
                label="Max Participants"
                type="number"
                min={1}
                value={formData.max_participants}
                onChange={handleInputChange}
                required
              />
              <Input
                id="price"
                name="price"
                label="Price ($)"
                type="number"
                min={0}
                step={0.01}
                value={formData.price}
                onChange={handleInputChange}
                required
              />
              <Input
                id="member_price"
                name="member_price"
                label="Member Price ($)"
                type="number"
                min={0}
                step={0.01}
                value={formData.member_price}
                onChange={handleInputChange}
              />
            </div>

            <div className="w-full">
              <label className="block text-sm font-medium text-foreground mb-2">
                Skill Levels
              </label>
              <div className="flex flex-wrap gap-2">
                {SKILL_LEVEL_OPTIONS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => handleSkillLevelToggle(level)}
                    className={
                      'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ' +
                      (formData.skill_levels.includes(level)
                        ? 'bg-primary text-white'
                        : 'bg-secondary text-foreground hover:bg-cyan-100')
                    }
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            <Input
              id="age_groups"
              name="age_groups"
              label="Age Groups (comma-separated)"
              value={ageGroupInput}
              onChange={handleAgeGroupChange}
              placeholder="e.g. 8-11, 12-14, 15-18"
            />

            {/* Footer */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" isLoading={isLoading}>
                {isEditMode ? 'Update Event' : 'Create Event'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
