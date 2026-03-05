'use client'

import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation'
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
  { value: 'training', label: 'Training Session' },
  { value: 'camp', label: 'Camp' },
  { value: 'tournament', label: 'Tournament' },
  { value: 'clinic', label: 'Clinic' },
  { value: 'scrimmage', label: 'Scrimmage' },
] as const

interface QuickPreset {
  label: string
  emoji: string
  data: Partial<EventFormData>
  ageGroupInput: string
}

const QUICK_PRESETS: QuickPreset[] = [
  {
    label: 'Weekend Training',
    emoji: '🥍',
    data: {
      title: 'Weekend Training Session',
      description: 'Weekend training session focused on skill development, game IQ, and competitive play. All skill levels welcome.',
      event_type: 'training',
      location: 'CLA Training Center',
      max_participants: 30,
      price: 40,
      member_price: 0,
      skill_levels: ['beginner', 'intermediate', 'advanced'],
      age_groups: ['8-14', '15-18'],
    },
    ageGroupInput: '8-14, 15-18',
  },
  {
    label: 'Saturday Camp',
    emoji: '🏕️',
    data: {
      title: 'Saturday Skills Camp',
      description: 'Full-day camp covering stick skills, shooting, defense, and live play. Lunch included.',
      event_type: 'camp',
      location: 'CLA Training Center',
      max_participants: 40,
      price: 75,
      member_price: 60,
      skill_levels: ['beginner', 'intermediate', 'advanced'],
      age_groups: ['10-14', '15-18'],
    },
    ageGroupInput: '10-14, 15-18',
  },
  {
    label: 'Scrimmage',
    emoji: '🏟️',
    data: {
      title: 'Weekend Scrimmage',
      description: 'Competitive scrimmage play. Great way to get live reps and apply what you have been working on in training.',
      event_type: 'scrimmage',
      location: 'CLA Training Center',
      max_participants: 40,
      price: 25,
      member_price: 0,
      skill_levels: ['intermediate', 'advanced', 'elite'],
      age_groups: ['12-18'],
    },
    ageGroupInput: '12-18',
  },
]

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

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px 16px',
  fontSize: '0.9375rem',
  border: '1px solid var(--border)',
  borderRadius: '12px',
  background: 'var(--background)',
  color: 'var(--foreground)',
  outline: 'none',
  transition: 'border-color 0.2s ease, box-shadow 0.2s ease'
}

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.8125rem',
  fontWeight: 500,
  color: 'var(--foreground)',
  marginBottom: '8px'
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

  function applyPreset(preset: QuickPreset) {
    setFormData((prev) => ({
      ...prev,
      ...preset.data,
    }))
    setAgeGroupInput(preset.ageGroupInput)
    setError(null)
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
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 50,
      overflowY: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      {/* Backdrop */}
      <div
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(4px)'
        }}
        onClick={onClose}
      />

      {/* Modal */}
      <div style={{
        position: 'relative',
        width: '100%',
        maxWidth: '640px',
        background: 'var(--background)',
        borderRadius: '20px',
        boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
      }}>
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '24px',
          borderBottom: '1px solid var(--border)'
        }}>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 600,
            color: 'var(--foreground)',
            margin: 0
          }}>
            {isEditMode ? 'Edit Event' : 'Create New Event'}
          </h2>
          <button
            onClick={onClose}
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              border: 'none',
              background: 'var(--background-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--foreground-muted)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{
          padding: '24px',
          maxHeight: '70vh',
          overflowY: 'auto'
        }}>
          {error && (
            <div style={{
              padding: '14px 16px',
              background: '#FEF2F2',
              border: '1px solid #FEE2E2',
              borderRadius: '12px',
              color: '#DC2626',
              fontSize: '0.875rem',
              marginBottom: '20px'
            }}>
              {error}
            </div>
          )}

          {/* Quick Presets - only show when creating new */}
          {!isEditMode && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ ...labelStyle, marginBottom: '10px' }}>Quick Start</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {QUICK_PRESETS.map((preset) => (
                  <button
                    key={preset.label}
                    type="button"
                    onClick={() => applyPreset(preset)}
                    style={{
                      padding: '10px 18px',
                      borderRadius: '10px',
                      fontSize: '0.8125rem',
                      fontWeight: 500,
                      border: '1px solid var(--border)',
                      background: 'var(--background-secondary)',
                      color: 'var(--foreground)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                    }}
                  >
                    <span>{preset.emoji}</span>
                    {preset.label}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)', marginTop: '8px' }}>
                Pick a preset to pre-fill the form, then just set the date and adjust as needed.
              </p>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Title */}
            <div>
              <label style={labelStyle}>Event Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Saturday Training Session"
                required
                style={inputStyle}
              />
            </div>

            {/* Description */}
            <div>
              <label style={labelStyle}>Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe the event, what players will learn, etc."
                rows={3}
                required
                style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
              />
            </div>

            {/* Event Type */}
            <div>
              <label style={labelStyle}>Event Type *</label>
              <select
                name="event_type"
                value={formData.event_type}
                onChange={handleInputChange}
                required
                style={inputStyle}
              >
                {EVENT_TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Dates */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Start Date & Time *</label>
                <input
                  type="datetime-local"
                  name="start_date"
                  value={formData.start_date}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>End Date & Time *</label>
                <input
                  type="datetime-local"
                  name="end_date"
                  value={formData.end_date}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label style={labelStyle}>Location *</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                placeholder="e.g. CLA Training Center"
                required
                style={inputStyle}
              />
            </div>

            {/* Address */}
            <div>
              <label style={labelStyle}>Address</label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="e.g. 123 Lacrosse Way, Cincinnati, OH"
                style={inputStyle}
              />
            </div>

            {/* Capacity & Pricing */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Max Participants *</label>
                <input
                  type="number"
                  name="max_participants"
                  min={1}
                  value={formData.max_participants}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Price ($) *</label>
                <input
                  type="number"
                  name="price"
                  min={0}
                  step={0.01}
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  style={inputStyle}
                />
              </div>
              <div>
                <label style={labelStyle}>Member Price ($)</label>
                <input
                  type="number"
                  name="member_price"
                  min={0}
                  step={0.01}
                  value={formData.member_price}
                  onChange={handleInputChange}
                  style={inputStyle}
                />
              </div>
            </div>

            {/* Skill Levels */}
            <div>
              <label style={labelStyle}>Skill Levels</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {SKILL_LEVEL_OPTIONS.map((level) => {
                  const isSelected = formData.skill_levels.includes(level)
                  return (
                    <button
                      key={level}
                      type="button"
                      onClick={() => handleSkillLevelToggle(level)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '9999px',
                        fontSize: '0.8125rem',
                        fontWeight: 500,
                        border: isSelected ? 'none' : '1px solid var(--border)',
                        background: isSelected ? 'var(--accent)' : 'transparent',
                        color: isSelected ? 'white' : 'var(--foreground)',
                        cursor: 'pointer',
                        textTransform: 'capitalize',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      {level}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Age Groups */}
            <div>
              <label style={labelStyle}>Age Groups</label>
              <input
                type="text"
                name="age_groups"
                value={ageGroupInput}
                onChange={handleAgeGroupChange}
                placeholder="e.g. 8-11, 12-14, 15-18"
                style={inputStyle}
              />
              <p style={{ fontSize: '0.75rem', color: 'var(--foreground-muted)', marginTop: '6px' }}>
                Separate multiple age groups with commas
              </p>
            </div>
          </div>

          {/* Footer */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            marginTop: '28px',
            paddingTop: '20px',
            borderTop: '1px solid var(--border)'
          }}>
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '12px 24px',
                fontSize: '0.9375rem',
                fontWeight: 500,
                borderRadius: '9999px',
                border: '1px solid var(--border)',
                background: 'transparent',
                color: 'var(--foreground)',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              style={{
                padding: '12px 24px',
                fontSize: '0.9375rem',
                fontWeight: 500,
                borderRadius: '9999px',
                border: 'none',
                background: 'var(--foreground)',
                color: 'var(--background)',
                cursor: isLoading ? 'not-allowed' : 'pointer',
                opacity: isLoading ? 0.6 : 1
              }}
            >
              {isLoading ? 'Saving...' : isEditMode ? 'Update Event' : 'Create Event'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
